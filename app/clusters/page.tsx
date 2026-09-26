import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { JsonLd } from "@/components/json-ld"
import { getClusters } from "@/lib/clusters"
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site"

const description =
  "Every topic cluster on Berris.dev, from software architecture and API design to AI agents, .NET and Umbraco, with the articles in each one."

export const metadata: Metadata = {
  title: "Clusters",
  description,
  alternates: { canonical: "/clusters/" },
  openGraph: {
    type: "website",
    url: "/clusters/",
    siteName: SITE_NAME,
    locale: "en_US",
    title: "Clusters",
    description,
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clusters",
    description,
    images: ["/og.png"],
  },
}

export default function ClustersPage() {
  const clusters = getClusters()
  const pageUrl = absoluteUrl("/clusters/")

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: "Clusters",
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: "en",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: clusters.length,
          itemListElement: clusters.map((cluster, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteUrl(`/clusters/${cluster.slug}/`),
            name: cluster.fullName,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Clusters", item: pageUrl },
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
            <p className="hud-label text-cyan">// database</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight neon-text md:text-5xl">Clusters</h1>
            <p className="mt-3 max-w-xl text-muted-foreground text-pretty">
              Every topic in the network. Pick a cluster to see the nodes it connects.
            </p>
          </header>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clusters.map((cluster) => (
              <li key={cluster.slug} className="group">
                <Link
                  href={`/clusters/${cluster.slug}/`}
                  className="hud-panel flex h-full flex-col gap-3 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-neon/60 hover:shadow-[0_0_40px_-12px_var(--neon)] focus-visible:border-cyan"
                >
                  <div className="flex items-center justify-between">
                    <span className="hud-label text-cyan">{cluster.tag}</span>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" />
                  </div>
                  <h2 className="text-lg font-semibold leading-snug text-balance md:text-xl">{cluster.fullName}</h2>
                  <p className="line-clamp-3 text-sm leading-relaxed text-foreground/65 text-pretty">{cluster.description}</p>
                  <p className="hud-label mt-auto border-t border-border/60 pt-3">
                    {cluster.nodes.length} {cluster.nodes.length === 1 ? "node" : "nodes"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}
