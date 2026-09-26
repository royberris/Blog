"use client"

import { useRouter } from "next/navigation"
import { NodeGraph } from "@/components/graph/node-graph"
import { clusterSlug } from "@/lib/site"
import type { GraphData } from "@/lib/graph-types"

export function ConnectedGraph({ data, focusId }: { data: GraphData; focusId: string }) {
  const router = useRouter()

  return (
    <NodeGraph
      compact
      data={data}
      focusId={focusId}
      onNodeSelect={(node) => {
        if (node.kind === "node" && node.slug && node.id !== focusId) router.push(`/nodes/${node.slug}/`)
        if (node.kind === "cluster") router.push(`/clusters/${clusterSlug(node.label)}/`)
      }}
    />
  )
}
