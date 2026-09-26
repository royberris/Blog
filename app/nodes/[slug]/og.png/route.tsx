import { renderOgCard } from "@/components/og-card"
import { getAllNodeSlugs, getNodeBySlug } from "@/lib/nodes"

// A route handler (not opengraph-image.tsx) so the static export writes a real .png file;
// GitHub Pages would serve the extensionless opengraph-image output as octet-stream
export const dynamic = "force-static"

export function generateStaticParams() {
  return getAllNodeSlugs().map((slug) => ({ slug }))
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const node = getNodeBySlug(slug)
  if (!node) return new Response("Not found", { status: 404 })

  return renderOgCard({ eyebrow: `///${node.code}`, title: node.title, subtitle: node.excerpt, tags: node.tags })
}
