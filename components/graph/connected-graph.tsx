"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FullDisplayOnly } from "@/components/full-display-only"
import { NodeGraph } from "@/components/graph/node-graph"
import { clusterSlug } from "@/lib/site"
import type { GraphData } from "@/lib/graph-types"

export function ConnectedGraph({ data, focusId }: { data: GraphData; focusId: string }) {
  const router = useRouter()
  const neighbours = data.nodes.filter((n) => n.id !== focusId).sort((a, b) => a.kind.localeCompare(b.kind) || a.label.localeCompare(b.label))

  return (
    <>
      <div className="h-full simple:hidden">
        <FullDisplayOnly>
          <NodeGraph
            compact
            data={data}
            focusId={focusId}
            onNodeSelect={(node) => {
              if (node.kind === "node" && node.slug && node.id !== focusId) router.push(`/nodes/${node.slug}/`)
              if (node.kind === "cluster") router.push(`/clusters/${clusterSlug(node.label)}/`)
            }}
          />
        </FullDisplayOnly>
      </div>

      {/* Simple view: the same connections as a plain list */}
      <ul className="hidden space-y-2 p-4 simple:block" aria-label="Connected nodes">
        {neighbours.map((n) => (
          <li key={n.id}>
            <Link
              href={n.kind === "cluster" ? `/clusters/${clusterSlug(n.label)}/` : `/nodes/${n.slug}/`}
              className="text-primary underline underline-offset-4"
            >
              {n.kind === "cluster" ? `Cluster: ${n.label}` : n.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
