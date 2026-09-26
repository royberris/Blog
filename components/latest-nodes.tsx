import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/utils-client"
import type { NodeSummary } from "@/lib/graph-types"

// Floating panel on the map's left edge (desktop)
export function LatestNodesPanel({ nodes }: { nodes: NodeSummary[] }) {
  return (
    <aside aria-labelledby="latest-panel-heading" className="hud-panel pointer-events-auto w-64 bg-card/90 p-4">
      <h2 id="latest-panel-heading" className="hud-label text-cyan">// latest</h2>
      <ol className="mt-3 space-y-3">
        {nodes.map((node) => (
          <li key={node.slug}>
            <Link href={`/nodes/${node.slug}/`} className="group block">
              <time dateTime={node.date} className="hud-label text-[10px]">{formatDate(node.date)}</time>
              <span className="mt-0.5 block text-sm font-medium leading-snug text-balance group-hover:text-cyan">{node.title}</span>
            </Link>
          </li>
        ))}
      </ol>
      <Link href="/nodes/" className="hud-label mt-4 inline-flex items-center gap-1.5 text-foreground hover:text-cyan">
        More in the index
        <ArrowRight className="size-3" />
      </Link>
    </aside>
  )
}

// Horizontal swipe strip under the cluster filter (mobile)
export function LatestNodesStrip({ nodes }: { nodes: NodeSummary[] }) {
  return (
    <nav aria-label="Latest nodes" className="pointer-events-auto mt-3">
      <div className="mb-2 flex items-center justify-between px-4 md:px-8">
        <p className="hud-label">Latest</p>
        {/* The map captures touch drags, so this is the way down to the readable content */}
        <a href="#latest" className="hud-label inline-flex items-center gap-1.5 hover:text-cyan">
          About
          <ArrowDown className="size-3" />
        </a>
      </div>
      <ol className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 md:scroll-px-8 md:px-8">
        {nodes.map((node) => (
          <li key={node.slug} className="w-60 shrink-0 snap-start">
            <Link href={`/nodes/${node.slug}/`} className="hud-panel block h-full bg-card/85 px-3 py-2.5 hover:border-cyan">
              <time dateTime={node.date} className="hud-label text-[10px]">{formatDate(node.date)}</time>
              <span className="mt-0.5 line-clamp-2 block text-sm font-medium leading-snug">{node.title}</span>
            </Link>
          </li>
        ))}
        <li className="shrink-0 snap-start">
          <Link href="/nodes/" className="hud-panel flex h-full items-center gap-1.5 bg-card/85 px-4 hud-label text-foreground hover:border-cyan hover:text-cyan">
            More
            <ArrowRight className="size-3" />
          </Link>
        </li>
      </ol>
    </nav>
  )
}
