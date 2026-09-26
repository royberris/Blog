import { getNodeSummaries, getTagConfig } from "@/lib/nodes"
import { clusterSlug } from "@/lib/site"
import type { NodeSummary } from "@/lib/graph-types"

export interface Cluster {
  tag: string
  slug: string
  fullName: string
  description: string
  nodes: NodeSummary[]
}

// Clusters (tags) that at least one node uses, biggest first
export function getClusters(): Cluster[] {
  const byTag = new Map<string, NodeSummary[]>()
  getNodeSummaries().forEach((node) => {
    node.tags.forEach((tag) => byTag.set(tag, [...(byTag.get(tag) ?? []), node]))
  })

  return Array.from(byTag.entries())
    .map(([tag, nodes]) => {
      const config = getTagConfig(tag)
      return {
        tag,
        slug: clusterSlug(tag),
        fullName: config?.fullName ?? tag,
        description: config?.description ?? "",
        nodes,
      }
    })
    .sort((a, b) => b.nodes.length - a.nodes.length || a.tag.localeCompare(b.tag))
}

export function getClusterBySlug(slug: string): Cluster | null {
  return getClusters().find((cluster) => cluster.slug === slug) ?? null
}
