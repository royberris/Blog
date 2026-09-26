import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Waypoints } from "lucide-react"
import { NodeCard } from "@/components/node-card"
import { JsonLd } from "@/components/json-ld"
import { getClusterBySlug, getClusters } from "@/lib/clusters"
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site"

interface ClusterPageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  return getClusters().map((cluster) => ({ tag: cluster.slug }))
}

function describe(fullName: string, description: string, count: number) {
  const nodes = `${count} ${count === 1 ? "article" : "articles"}`
  return `${nodes} on ${fullName} by Roy Berris. ${description}`
}

export async function generateMetadata({ params }: ClusterPageProps): Promise<Metadata> {
  const { tag } = await params
  const cluster = getClusterBySlug(tag)

  if (!cluster) {
    return { title: "Cluster not found", robots: { index: false } }
  }

  const url = `/clusters/${cluster.slug}/`
  const title = cluster.fullName === cluster.tag ? cluster.fullName : `${cluster.fullName} (${cluster.tag})`
  const description = describe(cluster.fullName, cluster.description, cluster.nodes.length)

  return {
    title,
    description,
    keywords: [cluster.tag, cluster.fullName],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      title,
      description,
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  }
}

export default async function ClusterPage({ params }: ClusterPageProps) {
  const { tag } = await params
  const cluster = getClusterBySlug(tag)

  if (!cluster) {
    notFound()
  }

  const pageUrl = absoluteUrl(`/clusters/${cluster.slug}/`)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: cluster.fullName,
        description: describe(cluster.fullName, cluster.description, cluster.nodes.length),
        about: { "@type": "Thing", name: cluster.fullName, alternateName: cluster.tag },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: "en",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: cluster.nodes.length,
          itemListElement: cluster.nodes.map((node, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteUrl(`/nodes/${node.slug}/`),
            name: node.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Clusters", item: absoluteUrl("/clusters/") },
          { "@type": "ListItem", position: 3, name: cluster.fullName, item: pageUrl },
        ],
      },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="hud-grid min-h-screen pt-14">
        <div className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
          <header className="py-8 md:py-12">
            <Link href="/clusters/" className="hud-label inline-flex items-center gap-2 hover:text-foreground">
              <ArrowLeft className="size-3.5" />
              All clusters
            </Link>
            <p className="hud-label mt-8 text-cyan">// cluster · {cluster.tag}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight neon-text md:text-5xl text-balance">{cluster.fullName}</h1>
            {cluster.description && (
              <p className="mt-3 max-w-2xl text-muted-foreground text-pretty">{cluster.description}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="hud-label">
                {cluster.nodes.length} {cluster.nodes.length === 1 ? "node" : "nodes"}
              </span>
              <Link
                href={`/nodes/?cluster=${encodeURIComponent(cluster.tag)}`}
                className="hud-chip inline-flex items-center gap-1.5 hover:border-cyan hover:text-cyan"
              >
                <Waypoints className="size-3.5" />
                Filter in index
              </Link>
            </div>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cluster.nodes.map((node) => (
              <NodeCard key={node.slug} node={node} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
