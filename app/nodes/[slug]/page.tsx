import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Waypoints } from "lucide-react"
import { getAllNodes, getAllNodeSlugs, getNeighborhood, getNodeBySlug, formatDate } from "@/lib/nodes"
import { nodeId } from "@/lib/graph-types"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { AuthorSection } from "@/components/author-section"
import { ReadingProgress } from "@/components/reading-progress"
import { ConnectedGraph } from "@/components/graph/connected-graph"
import { JsonLd } from "@/components/json-ld"
import { AUTHOR, SITE_NAME, SITE_URL, absoluteUrl, clusterSlug } from "@/lib/site"

interface NodeDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllNodeSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: NodeDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const node = getNodeBySlug(slug)

  if (!node) {
    return { title: "Node not found", robots: { index: false } }
  }

  const url = `/nodes/${slug}/`
  const image = { url: `/nodes/${slug}/og.png`, width: 1200, height: 630, alt: node.title }
  const author = node.author ?? AUTHOR.name

  return {
    title: node.title,
    description: node.excerpt,
    keywords: node.tags,
    authors: [{ name: author, url: AUTHOR.url }],
    alternates: {
      canonical: url,
      types: { "text/markdown": `/nodes/${slug}.md` },
    },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      title: node.title,
      description: node.excerpt,
      publishedTime: toIso(node.date),
      modifiedTime: toIso(node.updated ?? node.date),
      authors: [AUTHOR.url],
      tags: node.tags,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: node.title,
      description: node.excerpt,
      images: [image.url],
    },
  }
}

function toIso(date: string): string {
  return new Date(date).toISOString()
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
  const pageUrl = absoluteUrl(`/nodes/${slug}/`)
  const showUpdated = Boolean(node.updated) && toIso(node.updated!) !== toIso(node.date)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${pageUrl}#article`,
        headline: node.title,
        description: node.excerpt,
        datePublished: toIso(node.date),
        dateModified: toIso(node.updated ?? node.date),
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        url: pageUrl,
        image: absoluteUrl(`/nodes/${slug}/og.png`),
        keywords: node.tags.join(", "),
        articleSection: node.tags[0],
        wordCount: node.content.trim().split(/\s+/).length,
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Index", item: absoluteUrl("/nodes/") },
          { "@type": "ListItem", position: 3, name: node.title, item: pageUrl },
        ],
      },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
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
              {showUpdated && (
                <>
                  <span className="hud-label">·</span>
                  <span className="hud-label">
                    Updated <time dateTime={node.updated!}>{formatDate(node.updated!)}</time>
                  </span>
                </>
              )}
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
                  <Link key={tag} href={`/clusters/${clusterSlug(tag)}/`} className="hud-chip hover:border-cyan hover:text-cyan">
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
              <Link href={`/nodes/${older.slug}/`} className="hud-panel group p-4 transition-colors hover:border-neon/60">
                <span className="hud-label flex items-center gap-1.5"><ArrowLeft className="size-3" /> Older</span>
                <span className="mt-1 block font-medium text-balance">{older.title}</span>
              </Link>
            ) : <span className="hidden sm:block" />}
            {newer && (
              <Link href={`/nodes/${newer.slug}/`} className="hud-panel group p-4 text-right transition-colors hover:border-neon/60">
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
