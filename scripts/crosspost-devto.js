#!/usr/bin/env node

// Cross-posts opted-in nodes to dev.to with canonical_url pointing at berris.dev.
// A node opts in with `devto: true` (published) or `devto: { published: false }` (draft)
// in its front matter. The sync is idempotent: existing dev.to articles are matched on
// canonical_url, and only updated when the generated article differs.
//
// After a real sync, data/devto-articles.json maps each published node to its dev.to
// article ({ slug: { id, url } }); the node page uses it to show reactions and comments.
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
const articlesFile = path.join(root, "data", "devto-articles.json")
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

// dev.to can ask for a 5 minute wait after a few new articles. Waiting that out would hit the
// CI step timeout, so longer waits stop the sync; the remaining nodes go out on the next run.
const MAX_RATE_LIMIT_WAIT_SECONDS = 60

class RateLimitError extends Error {}

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

  if (response.status === 429) {
    const wait = Number(response.headers.get("retry-after")) || 30
    if (wait > MAX_RATE_LIMIT_WAIT_SECONDS || attempt > 3) {
      throw new RateLimitError(`${method} ${endpoint} rate limited by dev.to (retry after ${wait}s)`)
    }
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

// List endpoints return tag_list as an array and tags as a string; single-article
// responses (create, update) return them the other way around
function tagsOf(article) {
  const value = Array.isArray(article.tag_list) || typeof article.tag_list === "string" ? article.tag_list : article.tags
  if (Array.isArray(value)) return value
  return typeof value === "string" ? value.split(",").map((tag) => tag.trim()).filter(Boolean) : null
}

const sameTags = (a, b) => [...a].sort().join(",") === [...b].sort().join(",")

function isUnchanged(existing, article) {
  const existingTags = tagsOf(existing) || []
  return (
    existing.title === article.title &&
    existing.body_markdown?.trim() === article.body_markdown.trim() &&
    existing.description === article.description &&
    existing.published === article.published &&
    sameTags(existingTags, article.tags)
  )
}

function readArticleMap() {
  return fs.existsSync(articlesFile) ? JSON.parse(fs.readFileSync(articlesFile, "utf8")) : {}
}

// Sorted keys keep the diff small when the file is committed
function writeArticleMap(map) {
  const sorted = Object.fromEntries(Object.keys(map).sort().map((slug) => [slug, map[slug]]))
  fs.writeFileSync(articlesFile, `${JSON.stringify(sorted, null, 2)}\n`)
}

// Only published articles get an entry: drafts have no public page or comments.
// Single-article responses have no `published` field, only `published_at`.
function recordArticle(map, slug, article) {
  const published = article?.published ?? Boolean(article?.published_at)
  if (published && article.url) map[slug] = { id: article.id, url: article.url }
  else delete map[slug]
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

  // A full sync drops nodes that opted out; --only leaves the other entries alone
  const articleMap = readArticleMap()
  if (!only) {
    const optedIn = new Set(nodes.map(({ slug }) => slug))
    Object.keys(articleMap).forEach((slug) => optedIn.has(slug) || delete articleMap[slug])
  }

  // Written after every change, so a killed step (CI timeout) still keeps what was synced
  const save = () => !dryRun && writeArticleMap(articleMap)
  save()

  const pending = nodes.map(({ slug }) => slug)
  try {
    for (const { slug, article } of nodes) {
      const match = existing.get(normalizeUrl(article.canonical_url))
      // An existing article is already live, so record it before the update can fail
      if (match) {
        recordArticle(articleMap, slug, match)
        save()
      }

      if (match && isUnchanged(match, article)) {
        counts.unchanged++
        pending.shift()
        console.log(`= ${slug} (unchanged)`)
        continue
      }

      const action = match ? "update" : "create"
      if (dryRun) {
        pending.shift()
        console.log(`[dry-run] would ${action} ${slug}`)
        continue
      }

      // tags must be an array: dev.to silently drops a comma-separated string
      const payload = { article }
      const result = match ? await api("PUT", `/articles/${match.id}`, payload) : await api("POST", "/articles", payload)
      counts[match ? "updated" : "created"]++
      recordArticle(articleMap, slug, result)
      save()
      pending.shift()
      console.log(`${match ? "~" : "+"} ${slug} -> ${result.url}`)
      warnOnTagDrift(slug, article.tags, result)

      // Stay well under dev.to's write rate limit
      await sleep(5000)
    }
  } catch (error) {
    if (!(error instanceof RateLimitError)) throw error
    // Rate limiting is expected with several new nodes: stop cleanly, the next run continues
    console.log(`::warning::${error.message}; not synced yet: ${pending.join(", ")}`)
  }

  console.log(`dev.to sync done: ${counts.created} created, ${counts.updated} updated, ${counts.unchanged} unchanged`)
}

// The front matter is the source of truth for tags, but dev.to may store different ones.
// Warn so a node that gets re-updated on every deploy is easy to spot.
function warnOnTagDrift(slug, sentTags, result) {
  const stored = tagsOf(result)
  if (stored && !sameTags(stored, sentTags)) {
    console.log(`::warning::${slug}: sent tags ${sentTags.join(",")} but dev.to stored ${stored.join(",")}`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
