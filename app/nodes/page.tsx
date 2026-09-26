import type { Metadata } from "next"
import { Suspense } from "react"
import { NodeIndex } from "@/components/node-index"
import { NodeCard } from "@/components/node-card"
import { getNodeSummaries } from "@/lib/nodes"

export const metadata: Metadata = {
  title: "Index",
  description: "Every node in the database, filterable by cluster.",
}

export default function NodesIndexPage() {
  const nodes = getNodeSummaries()

  return (
    <>
      <main className="hud-grid min-h-screen pt-14">
        <div className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
          <header className="py-8 md:py-12">
            <p className="hud-label text-cyan">// database</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight neon-text md:text-5xl">Index</h1>
            <p className="mt-3 max-w-xl text-muted-foreground text-pretty">
              Every node in the network. Filter by cluster, sort by date or depth.
            </p>
          </header>

          <Suspense
            fallback={
              <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                {nodes.map((node) => (
                  <NodeCard key={node.slug} node={node} />
                ))}
              </div>
            }
          >
            <NodeIndex nodes={nodes} />
          </Suspense>
        </div>
      </main>
    </>
  )
}
