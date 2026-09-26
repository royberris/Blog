import fs from "fs"
import path from "path"
import matter from "gray-matter"
import tagsConfig from "@/data/tags.json"
import { nodeCodeFor } from "@/lib/node-code"
import { withLayout } from "@/lib/graph-layout"
import { clusterId, nodeId, type GraphData, type GraphLink, type NodeSummary } from "@/lib/graph-types"

export interface NodePost extends NodeSummary {
  content: string
  related: string[]
  invalidTags?: string[] // For tracking invalid tags during development
}

const nodesDirectory = path.join(process.cwd(), "nodes")
const WORDS_PER_MINUTE = 220

function validateTags(tags: string[] | undefined, fileName: string): { validTags: string[], invalidTags: string[] } {
  if (!tags || !Array.isArray(tags)) {
    return { validTags: [], invalidTags: [] }
  }

  const validTags: string[] = []
  const invalidTags: string[] = []
  const knownTags = Object.keys(tagsConfig)

  tags.forEach(tag => {
    if (knownTags.includes(tag)) {
      validTags.push(tag)
    } else {
      invalidTags.push(tag)
      console.warn(`⚠️  Invalid tag "${tag}" found in ${fileName}. Available tags: ${knownTags.join(', ')}`)
    }
  })

  return { validTags, invalidTags }
}

function getParsedNodes(): NodePost[] {
  const fileNames = fs.readdirSync(nodesDirectory)
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "")
      const fileContents = fs.readFileSync(path.join(nodesDirectory, fileName), "utf8")
      const { data, content } = matter(fileContents)

      // Validate tags against tags.json
      const { validTags, invalidTags } = validateTags(data.tags, fileName)
      const words = content.trim().split(/\s+/).length

      const post: NodePost = {
        slug,
        code: nodeCodeFor(slug),
        title: data.title,
        date: data.date,
        updated: data.updated ?? null,
        excerpt: data.excerpt,
        // The page header already renders the title, so drop a leading H1 from the body
        content: content.replace(/^\s*#\s+[^\n]*\n/, ""),
        tags: validTags, // Only include valid tags
        author: data.author ?? null,
        related: Array.isArray(data.related) ? data.related : [],
        readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
      }

      // In development, include invalid tags for debugging
      if (process.env.NODE_ENV === "development" && invalidTags.length > 0) {
        post.invalidTags = invalidTags
      }

      return post
    })

  // Two slugs hashing to the same three words would make codes ambiguous, so fail the build
  const seen = new Map<string, string>()
  posts.forEach((post) => {
    const clash = seen.get(post.code)
    if (clash) throw new Error(`Node code "${post.code}" collides for "${clash}" and "${post.slug}"; rename one slug`)
    seen.set(post.code, post.slug)
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllNodes(): NodePost[] {
  return getParsedNodes()
}

export function getNodeBySlug(slug: string): NodePost | null {
  return getParsedNodes().find((node) => node.slug === slug) || null
}

export function getAllNodeSlugs(): string[] {
  return getParsedNodes().map((node) => node.slug)
}

export function toSummary({ slug, code, title, date, updated, excerpt, tags, readingTime, author }: NodePost): NodeSummary {
  return { slug, code, title, date, updated, excerpt, tags, readingTime, author }
}

export function getNodeSummaries(): NodeSummary[] {
  return getParsedNodes().map(toSummary)
}

function buildGraph(): GraphData {
  const posts = getParsedNodes()
  const slugs = new Set(posts.map((p) => p.slug))
  const clusterCounts = new Map<string, number>()
  const links: GraphLink[] = []
  const seenRelated = new Set<string>()

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      clusterCounts.set(tag, (clusterCounts.get(tag) ?? 0) + 1)
      links.push({ source: nodeId(post.slug), target: clusterId(tag), kind: "cluster" })
    })

    post.related
      .filter((other) => slugs.has(other) && other !== post.slug)
      .forEach((other) => {
        const key = [post.slug, other].sort().join("|")
        if (seenRelated.has(key)) return
        seenRelated.add(key)
        links.push({ source: nodeId(post.slug), target: nodeId(other), kind: "related" })
      })
  })

  return {
    nodes: [
      ...posts.map((p) => ({ id: nodeId(p.slug), kind: "node" as const, label: p.title, weight: p.readingTime, slug: p.slug })),
      ...Array.from(clusterCounts.entries()).map(([tag, count]) => ({
        id: clusterId(tag),
        kind: "cluster" as const,
        label: tag,
        weight: count,
      })),
    ],
    links,
  }
}

export function getGraph(): GraphData {
  return withLayout(buildGraph())
}

// Subgraph of one node, its clusters and every node sharing a cluster or a related link
export function getNeighborhood(slug: string): GraphData {
  const graph = buildGraph()
  const self = nodeId(slug)
  const direct = new Set<string>([self])
  graph.links.forEach((l) => {
    if (l.source === self) direct.add(l.target)
    if (l.target === self) direct.add(l.source)
  })
  const keep = new Set(direct)
  graph.links.forEach((l) => {
    if (direct.has(l.target) && l.target.startsWith("cluster:")) keep.add(l.source)
  })
  return withLayout({
    nodes: graph.nodes.filter((n) => keep.has(n.id)),
    links: graph.links.filter((l) => keep.has(l.source) && keep.has(l.target)),
  })
}

export function getAvailableTags(): string[] {
  return Object.keys(tagsConfig).sort()
}

export function getTagConfig(tag: string) {
  return tagsConfig[tag as keyof typeof tagsConfig] || null
}

export function validateNodeTags(): { node: string, invalidTags: string[] }[] {
  return getParsedNodes()
    .filter((node) => node.invalidTags && node.invalidTags.length > 0)
    .map((node) => ({ node: node.slug, invalidTags: node.invalidTags! }))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
