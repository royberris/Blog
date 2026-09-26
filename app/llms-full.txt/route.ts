import { getAllNodes, type NodePost } from "@/lib/nodes"
import { AUTHOR, SITE_NAME, SITE_DESCRIPTION, absoluteUrl } from "@/lib/site"

// Required for static export
export const dynamic = "force-static"

function nodeSection(node: NodePost): string {
  const meta = [
    `- URL: ${absoluteUrl(`/nodes/${node.slug}/`)}`,
    `- Markdown: ${absoluteUrl(`/nodes/${node.slug}.md`)}`,
    `- Author: ${node.author ?? AUTHOR.name}`,
    `- Published: ${node.date}`,
    node.updated ? `- Updated: ${node.updated}` : null,
    node.tags.length ? `- Clusters: ${node.tags.join(", ")}` : null,
  ].filter(Boolean)

  return `# ${node.title}\n\n${meta.join("\n")}\n\n> ${node.excerpt}\n\n${node.content.trim()}`
}

function generateLlmsFullTxt(nodes: NodePost[]): string {
  const header = `# ${SITE_NAME} (full text)

> ${SITE_DESCRIPTION}

Written by ${AUTHOR.name}, ${AUTHOR.jobTitle} at ${AUTHOR.worksFor.name}. About the author: ${absoluteUrl("/about/")}. Index of all nodes: ${absoluteUrl("/llms.txt")}. Nodes are listed newest first.`

  return `${[header, ...nodes.map(nodeSection)].join("\n\n---\n\n")}\n`
}

export function GET() {
  return new Response(generateLlmsFullTxt(getAllNodes()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
