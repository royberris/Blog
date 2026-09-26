import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"
import { GraphExplorer } from "@/components/graph/graph-explorer"
import { formatDate, getGraph, getNodeSummaries } from "@/lib/nodes"
import { DEFAULT_WINDOW_YEARS, isWithinYears, maxWindowYears } from "@/lib/node-age"
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site"

const LATEST_COUNT = 12

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    types: { "text/plain": [{ url: "/llms.txt", title: "LLM-friendly site index" }] },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
  },
}

export default function HomePage() {
  const nodes = getNodeSummaries()
  // The window is relative to the build, so it moves forward with every deploy
  const now = new Date()
  const maxYears = maxWindowYears(nodes.map((n) => n.date), now)
  // One pre-laid-out graph per slider step, so the map stays tidy at every range
  const graphs = Object.fromEntries(
    Array.from({ length: maxYears }, (_, i) => i + 1).map((years) => [years, getGraph((n) => isWithinYears(n.date, years, now))]),
  )
  const recent = nodes.filter((n) => isWithinYears(n.date, DEFAULT_WINDOW_YEARS, now))
  const latest = recent.slice(0, LATEST_COUNT)

  return (
    <main className="hud-grid">
      <section aria-label="Node map" className="relative h-[100dvh] overflow-hidden pt-14">
        <GraphExplorer graphs={graphs} nodes={nodes} now={now.toISOString()} maxYears={maxYears} />

        {/* The map captures wheel and drag, so give an explicit way down to the readable content */}
        <a
          href="#latest"
          className="hud-label absolute right-4 z-10 flex items-center gap-1.5 bottom-[calc(max(1rem,env(safe-area-inset-bottom))_+_2.5rem)] hover:text-cyan md:right-8"
        >
          About · latest nodes
          <ArrowDown className="size-3" />
        </a>
      </section>

      <section id="latest" aria-labelledby="home-heading" className="scroll-mt-14 border-t border-border/60 bg-background/85">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
          <header className="max-w-3xl">
            <p className="hud-label text-cyan">// knowledge database</p>
            <h1 id="home-heading" className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-balance neon-text md:text-4xl">
              {SITE_NAME}: software architecture, API design and AI agents
            </h1>
            <p className="mt-4 leading-relaxed text-foreground/75 text-pretty">
              {SITE_NAME} is written by{" "}
              <Link href="/about/" className="text-cyan hover:underline">{AUTHOR.name}</Link>, a software architect at{" "}
              {AUTHOR.worksFor.name} in the Netherlands. It covers software architecture, API design, designing APIs for AI
              agents, Architecture Decision Records (ADRs) and .NET, based on real projects. Every post is a node on the map
              above, connected to others through shared clusters.
            </p>
          </header>

          <h2 className="hud-label mt-12 text-foreground">Latest nodes · last {DEFAULT_WINDOW_YEARS} years</h2>
          <ol className="mt-4 grid gap-4 md:grid-cols-2">
            {latest.map((node) => (
              <li key={node.slug}>
                <article className="hud-panel group relative h-full p-5 transition-colors hover:border-neon/60">
                  <p className="hud-label">
                    <time dateTime={node.date}>{formatDate(node.date)}</time> · {node.readingTime} min read
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-balance">
                    <Link href={`/nodes/${node.slug}/`} className="after:absolute after:inset-0 group-hover:text-cyan">
                      {node.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65 text-pretty">{node.excerpt}</p>
                </article>
              </li>
            ))}
          </ol>

          <Link href="/nodes/" className="hud-chip mt-6 hover:border-cyan hover:text-cyan">
            {nodes.length > recent.length ? `All ${nodes.length} nodes, including older ones, in the index` : `All ${nodes.length} nodes in the index`}
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </section>
    </main>
  )
}
