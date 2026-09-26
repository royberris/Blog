import Link from "next/link"
import { GraphExplorer } from "@/components/graph/graph-explorer"
import { getGraph, getNodeSummaries } from "@/lib/nodes"

export default function HomePage() {
  const graph = getGraph()
  const nodes = getNodeSummaries()

  return (
    <main className="hud-grid relative h-[100dvh] overflow-hidden pt-14">
      <GraphExplorer graph={graph} nodes={nodes} />

      {/* Keyboard / screen reader / no-JS path through the same content */}
      <nav aria-label="All nodes" className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:left-4 focus-within:top-20 focus-within:z-50 focus-within:rounded-xl focus-within:border focus-within:bg-card focus-within:p-4">
        <ul className="space-y-2">
          {nodes.map((n) => (
            <li key={n.slug}>
              <Link href={`/nodes/${n.slug}`}>{n.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <noscript>
        <ul className="absolute inset-x-4 top-20 z-50 space-y-3 hud-panel p-4">
          {nodes.map((n) => (
            <li key={n.slug}>
              <a href={`/nodes/${n.slug}`}>{n.title}</a>
            </li>
          ))}
        </ul>
      </noscript>
    </main>
  )
}
