import { getAllNodes, getTagConfig, type NodePost } from "@/lib/nodes"
import { AUTHOR, SITE_NAME, SITE_DESCRIPTION, absoluteUrl, clusterSlug } from "@/lib/site"

// Required for static export
export const dynamic = "force-static"

const nodeUrl = (slug: string) => absoluteUrl(`/nodes/${slug}/`)
const markdownUrl = (slug: string) => absoluteUrl(`/nodes/${slug}.md`)
const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "")
const linkedIn = AUTHOR.sameAs.find((u) => hostOf(u) === "linkedin.com")
const gitHub = AUTHOR.sameAs.find((u) => hostOf(u) === "github.com")

function nodeLine(node: NodePost): string {
  return `- [${node.title}](${nodeUrl(node.slug)}): ${node.excerpt} ([Markdown](${markdownUrl(node.slug)}))`
}

function generateLlmsTxt(nodes: NodePost[]): string {
  const clusters = new Map<string, NodePost[]>()
  nodes.forEach((node) => {
    node.tags.forEach((tag) => {
      if (!clusters.has(tag)) clusters.set(tag, [])
      clusters.get(tag)!.push(node)
    })
  })

  // Biggest clusters first, then alphabetical
  const sections = Array.from(clusters.entries())
    .sort(([a, x], [b, y]) => y.length - x.length || a.localeCompare(b))
    .map(([tag, posts]) => {
      const config = getTagConfig(tag)
      const heading = config && config.fullName !== tag ? `${config.fullName} (${tag})` : tag
      const clusterLink = `[All ${tag} nodes](${absoluteUrl(`/clusters/${clusterSlug(tag)}/`)})`
      const intro = `${config ? `${config.description} ` : ""}${clusterLink}\n\n`
      return `## ${heading}\n\n${intro}${posts.map(nodeLine).join("\n")}`
    })

  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} is written by ${AUTHOR.name}, ${AUTHOR.jobTitle} at ${AUTHOR.worksFor.name} in the Netherlands. Posts are called "nodes" and are grouped into topic clusters on an interactive map. Every node is written from first-hand experience; AI helps with structure and readability, and the author owns every technical claim. More about the author: [About](${absoluteUrl("/about/")}), [GitHub](${gitHub}), [LinkedIn](${linkedIn}).

Each node is available as a web page at \`${absoluteUrl("/nodes/<slug>/")}\` and as raw Markdown at \`${absoluteUrl("/nodes/<slug>.md")}\`. The full text of every node is in [llms-full.txt](${absoluteUrl("/llms-full.txt")}).

${sections.join("\n\n")}

## Optional

- [Projects](${absoluteUrl("/projects/")}): Open-source packages and developer tools by ${AUTHOR.name}.
- [About ${AUTHOR.name}](${absoluteUrl("/about/")}): Who writes ${SITE_NAME}, background and speaking.
- [Node index](${absoluteUrl("/nodes/")}): Every node, filterable by cluster.
- [Full text](${absoluteUrl("/llms-full.txt")}): All nodes as one Markdown document, newest first.
- [Sitemap](${absoluteUrl("/sitemap.xml")}): Machine-readable list of every page.
`
}

export function GET() {
  return new Response(generateLlmsTxt(getAllNodes()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
