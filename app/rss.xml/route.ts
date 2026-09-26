import { getNodeSummaries } from "@/lib/nodes"
import { AUTHOR, SITE_NAME, SITE_DESCRIPTION, absoluteUrl } from "@/lib/site"

// Required for static export; keeps the old site's feed URL alive
export const dynamic = "force-static"

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export function GET() {
  const nodes = getNodeSummaries()
  const items = nodes
    .map((node) => {
      const url = absoluteUrl(`/nodes/${node.slug}/`)
      return `    <item>
      <title>${escapeXml(node.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(node.date).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(node.author ?? AUTHOR.name)}</dc:creator>
      <description>${escapeXml(node.excerpt)}</description>
${node.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${absoluteUrl("/")}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date(nodes[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })
}
