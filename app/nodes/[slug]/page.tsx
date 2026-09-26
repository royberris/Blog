import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Waypoints } from "lucide-react"
import { getAllNodes, getAllNodeSlugs, getNeighborhood, getNodeBySlug, formatDate } from "@/lib/nodes"
import { nodeId } from "@/lib/graph-types"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { AuthorSection } from "@/components/author-section"
import { ReadingProgress } from "@/components/reading-progress"
import { ConnectedGraph } from "@/components/graph/connected-graph"

interface NodeDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllNodeSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: NodeDetailPageProps) {
  const { slug } = await params
  const node = getNodeBySlug(slug)

  if (!node) {
    return { title: "Node Not Found" }
  }

  return {
    title: node.title,
    description: node.excerpt,
  }
}

export default async function NodeDetailPage({ params }: NodeDetailPageProps) {
  const { slug } = await params
  const node = getNodeBySlug(slug)

  if (!node) {
    notFound()
  }

  // Newest first: the previous entry in the array is the newer node
  const all = getAllNodes()
  const index = all.findIndex((n) => n.slug === slug)
  const newer = all[index - 1]
  const older = all[index + 1]
  const neighborhood = getNeighborhood(slug)

  return (
    <>
      <ReadingProgress />
      <main className="min-h-screen pt-14">
        <header className="hud-grid border-b border-border/60">
          <div className="mx-auto max-w-3xl px-4 pb-10 pt-8 md:px-8 md:pb-14 md:pt-12">
            <Link href="/" className="hud-label inline-flex items-center gap-2 hover:text-foreground">
              <ArrowLeft className="size-3.5" />
              Back to map
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="hud-label normal-case text-cyan">///{node.code}</span>
              <span className="hud-label">·</span>
              <time dateTime={node.date} className="hud-label">{formatDate(node.date)}</time>
              <span className="hud-label">·</span>
              <span className="hud-label">{node.readingTime} min read</span>
              {node.author && (
                <>
                  <span className="hud-label">·</span>
                  <span className="hud-label text-foreground/80">by {node.author}</span>
                </>
              )}
            </div>

            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-balance neon-text md:text-5xl">
              {node.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-foreground/70 text-pretty">{node.excerpt}</p>

            {node.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {node.tags.map((tag) => (
                  <Link key={tag} href={`/nodes?cluster=${encodeURIComponent(tag)}`} className="hud-chip hover:border-cyan hover:text-cyan">
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        <article className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
          <MarkdownRenderer content={node.content} />
        </article>

        <section className="mx-auto max-w-3xl px-4 md:px-8" aria-labelledby="connected-heading">
          <div className="hud-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <h2 id="connected-heading" className="hud-label flex items-center gap-2 text-foreground">
                <Waypoints className="size-3.5 text-cyan" />
                Connected nodes
              </h2>
              <span className="hud-label">{neighborhood.nodes.length - 1} links</span>
            </div>
            <div className="hud-grid h-[320px] md:h-[380px]">
              <ConnectedGraph data={neighborhood} focusId={nodeId(slug)} />
            </div>
          </div>

          <nav aria-label="More nodes" className="mt-4 grid gap-3 sm:grid-cols-2">
            {older ? (
              <Link href={`/nodes/${older.slug}`} className="hud-panel group p-4 transition-colors hover:border-neon/60">
                <span className="hud-label flex items-center gap-1.5"><ArrowLeft className="size-3" /> Older</span>
                <span className="mt-1 block font-medium text-balance">{older.title}</span>
              </Link>
            ) : <span className="hidden sm:block" />}
            {newer && (
              <Link href={`/nodes/${newer.slug}`} className="hud-panel group p-4 text-right transition-colors hover:border-neon/60">
                <span className="hud-label flex items-center justify-end gap-1.5">Newer <ArrowRight className="size-3" /></span>
                <span className="mt-1 block font-medium text-balance">{newer.title}</span>
              </Link>
            )}
          </nav>
        </section>
      </main>

      <AuthorSection name={node.author ?? undefined} />
    </>
  )
}
