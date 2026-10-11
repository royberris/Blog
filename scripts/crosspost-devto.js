#!/usr/bin/env node

// Cross-posts opted-in nodes to dev.to with canonical_url pointing at berris.dev.
// A node opts in with `devto: true` (published) or `devto: { published: false }` (draft)
// in its front matter. The sync is idempotent: existing dev.to articles are matched on
// canonical_url, and only updated when the generated article differs.
//
// Usage:
//   DEVTO_API_KEY=... node scripts/crosspost-devto.js            sync all opted-in nodes
//   node scripts/crosspost-devto.js --dry-run [--out <dir>]      show what would happen
//   node scripts/crosspost-devto.js --only <slug>                limit to one node
const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")

const root = path.join(__dirname, "..")
const nodesDirectory = path.join(root, "nodes")
const siteUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://berris.dev").replace(/\/$/, "")
const apiBase = "https://dev.to/api"
const apiKey = process.env.DEVTO_API_KEY

const args = process.argv.slice(2)
const argValue = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined)
const dryRun = args.includes("--dry-run")
const only = argValue("--only")
const outDirectory = argValue("--out")

// dev.to tags are lowercase alphanumeric, at most 4 per article. Without `devto.tags`,
// clusters map to established dev.to tags so the article lands in feeds people follow.
const DEVTO_TAG_PATTERN = /^[a-z0-9]+$/
const CLUSTER_TO_DEVTO_TAG = {
  ".NET": "dotnet",
  ADR: "architecture",
  AI: "ai",
  "AI Agents": "ai",
  API: "api",
  "API Design": "api",
  "Best Practices": "programming",
  Blogging: "writing",
  "C#": "csharp",
  "Design Patterns": "designpatterns",
  "Engineering Leadership": "leadership",
  Events: "community",
  Hosting: "cloud",
  "Remote Development": "productivity",
  Security: "security",
  "Software Architecture": "architecture",
  "Team Collaboration": "softwareengineering",
  "Technical Writing": "writing",
  Umbraco: "umbraco",
}
const clusterToDevtoTag = (tag) => CLUSTER_TO_DEVTO_TAG[tag] || tag.toLowerCase().replace(/[^a-z0-9]/g, "")

function devtoTagsFor(slug, data, options) {
  if (!options.tags) return [...new Set((data.tags || []).map(clusterToDevtoTag).filter(Boolean))].slice(0, 4)

  // Explicit tags are used as written, so reject anything dev.to would refuse or mangle
  const invalid = options.tags.filter((tag) => typeof tag !== "string" || !DEVTO_TAG_PATTERN.test(tag))
  if (invalid.length || options.tags.length > 4 || new Set(options.tags).size !== options.tags.length) {
    throw new Error(`${slug}: devto.tags must be 1 to 4 unique lowercase alphanumeric tags, got ${JSON.stringify(options.tags)}`)
  }
  return options.tags
}

const canonicalFor = (slug) => `${siteUrl}/nodes/${slug}/`
const normalizeUrl = (url) => (url || "").replace(/\/+$/, "")

// dev.to does not render Mermaid, so diagrams become images rendered by mermaid.ink
function mermaidToImage(source) {
  const encoded = Buffer.from(source.trim(), "utf8").toString("base64url")
  return `![Diagram](https://mermaid.ink/img/${encoded}?type=png&theme=dark&bgColor=111827)`
}

function toDevtoMarkdown(content, canonical) {
  const body = content
    .replace(/^\s*# .*\n+/, "") // dev.to shows the title itself; drop the H1 that repeats it
    .replace(/^```mermaid\n([\s\S]*?)^```$/gm, (_, source) => mermaidToImage(source))
    .replace(/(\]\()\/(?!\/)/g, `$1${siteUrl}/`) // site-relative links and images become absolute
    .trimEnd()

  return `${body}\n\n---\n\n*Originally published at [berris.dev](${canonical}).*\n`
}

function loadNodes() {
  return fs
    .readdirSync(nodesDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "")
      const { data, content } = matter(fs.readFileSync(path.join(nodesDirectory, file), "utf8"))
      return { slug, data, content }
    })
    .filter(({ slug, data }) => data.devto && (!only || slug === only))
    .map(({ slug, data, content }) => {
      const options = typeof data.devto === "object" ? data.devto : {}
      const canonical = canonicalFor(slug)

      const article = {
        title: data.title,
        body_markdown: toDevtoMarkdown(content, canonical),
        published: options.published !== false,
        canonical_url: canonical,
        description: data.excerpt,
        tags: devtoTagsFor(slug, data, options),
      }
      if (options.series) article.series = options.series
      if (options.main_image) article.main_image = options.main_image
      return { slug, article }
    })
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function api(method, endpoint, body, attempt = 1) {
  const response = await fetch(`${apiBase}${endpoint}`, {
    method,
    headers: {
      "api-key": apiKey,
      accept: "application/vnd.forem.api-v1+json",
      "content-type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 429 && attempt <= 5) {
    const wait = Number(response.headers.get("retry-after")) || 30
    console.log(`  rate limited, retrying in ${wait}s`)
    await sleep(wait * 1000)
    return api(method, endpoint, body, attempt + 1)
  }
  if (!response.ok) {
    throw new Error(`${method} ${endpoint} failed: ${response.status} ${await response.text()}`)
  }
  return response.json()
}

async function fetchExistingArticles() {
  const byCanonical = new Map()
  for (let page = 1; ; page++) {
    const articles = await api("GET", `/articles/me/all?per_page=1000&page=${page}`)
    articles.forEach((a) => a.canonical_url && byCanonical.set(normalizeUrl(a.canonical_url), a))
    if (articles.length < 1000) return byCanonical
  }
}

function isUnchanged(existing, article) {
  const existingTags = Array.isArray(existing.tag_list) ? existing.tag_list : existing.tags?.split(", ") || []
  return (
    existing.title === article.title &&
    existing.body_markdown?.trim() === article.body_markdown.trim() &&
    existing.description === article.description &&
    existing.published === article.published &&
    [...existingTags].sort().join(",") === [...article.tags].sort().join(",")
  )
}

async function main() {
  const nodes = loadNodes()
  if (nodes.length === 0) {
    console.log("No nodes opted in to dev.to (add `devto: true` to the front matter)")
    return
  }

  if (outDirectory) {
    fs.mkdirSync(outDirectory, { recursive: true })
    nodes.forEach(({ slug, article }) => fs.writeFileSync(path.join(outDirectory, `${slug}.md`), article.body_markdown))
    console.log(`Wrote ${nodes.length} dev.to Markdown previews to ${outDirectory}`)
  }

  if (!apiKey) {
    if (!dryRun) throw new Error("DEVTO_API_KEY is not set")
    nodes.forEach(({ slug, article }) => console.log(`[dry-run] ${slug}: tags=${article.tags.join(",")} published=${article.published}`))
    console.log("DEVTO_API_KEY not set, so existing dev.to articles were not checked")
    return
  }

  const existing = await fetchExistingArticles()
  const counts = { created: 0, updated: 0, unchanged: 0 }

  for (const { slug, article } of nodes) {
    const match = existing.get(normalizeUrl(article.canonical_url))

    if (match && isUnchanged(match, article)) {
      counts.unchanged++
      console.log(`= ${slug} (unchanged)`)
      continue
    }

    const action = match ? "update" : "create"
    if (dryRun) {
      console.log(`[dry-run] would ${action} ${slug}`)
      continue
    }

    // The v1 API takes tags as a comma-separated string
    const payload = { article: { ...article, tags: article.tags.join(",") } }
    const result = match ? await api("PUT", `/articles/${match.id}`, payload) : await api("POST", "/articles", payload)
    counts[match ? "updated" : "created"]++
    console.log(`${match ? "~" : "+"} ${slug} -> ${result.url}`)

    // Stay well under dev.to's write rate limit
    await sleep(5000)
  }

  console.log(`dev.to sync done: ${counts.created} created, ${counts.updated} updated, ${counts.unchanged} unchanged`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
