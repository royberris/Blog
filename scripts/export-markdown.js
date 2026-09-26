#!/usr/bin/env node

// Runs after `next build`: publishes each node's Markdown at out/nodes/<slug>.md,
// next to the out/nodes/<slug>/index.html page, so AI tools can read the raw source.
const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")

const root = path.join(__dirname, "..")
const nodesDirectory = path.join(root, "nodes")
const outDirectory = path.join(root, "out", "nodes")
const siteUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://berris.dev").replace(/\/$/, "")

if (!fs.existsSync(outDirectory)) {
  console.error("out/nodes not found; run `next build` first")
  process.exit(1)
}

const files = fs.readdirSync(nodesDirectory).filter((f) => f.endsWith(".md"))

files.forEach((file) => {
  const slug = file.replace(/\.md$/, "")
  const { data, content } = matter(fs.readFileSync(path.join(nodesDirectory, file), "utf8"))
  const toDate = (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value)

  // JSON strings are valid YAML scalars, so this stays parseable front matter
  const header = [
    ["title", data.title],
    ["canonical", `${siteUrl}/nodes/${slug}/`],
    ["author", data.author || "Roy Berris"],
    ["date", toDate(data.date)],
    ["updated", toDate(data.updated)],
    ["excerpt", data.excerpt],
    ["tags", data.tags],
  ]
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n")

  fs.writeFileSync(path.join(outDirectory, `${slug}.md`), `---\n${header}\n---\n${content}`)
})

console.log(`Exported ${files.length} Markdown nodes to out/nodes/<slug>.md`)
