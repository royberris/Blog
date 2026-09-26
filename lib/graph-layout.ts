import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force"
import type { GraphData, GraphNode } from "@/lib/graph-types"

// Shared by the build (to pre-compute positions) and the client (to keep dragging physical)

export type SimNode = GraphNode & SimulationNodeDatum
export type SimLink = SimulationLinkDatum<SimNode> & { kind: "cluster" | "related" }

export const nodeRadius = (n: GraphNode) => (n.kind === "cluster" ? 12 + n.weight * 4 : 7 + Math.min(n.weight, 12) * 0.9)

export function createSimulation(nodes: SimNode[], links: SimLink[]) {
  return forceSimulation<SimNode, SimLink>(nodes)
    .force(
      "link",
      forceLink<SimNode, SimLink>(links)
        .id((d) => d.id)
        .distance((l) => (l.kind === "related" ? 100 : 70))
        .strength(0.7),
    )
    .force("charge", forceManyBody<SimNode>().strength((d) => (d.kind === "cluster" ? -300 : -240)))
    .force("collide", forceCollide<SimNode>().radius((d) => nodeRadius(d) + 22))
    .force("center", forceCenter(0, 0))
    .stop()
}

// Settle the layout at build time so the client paints final positions without running physics
export function withLayout(graph: GraphData): GraphData {
  const nodes = graph.nodes.map((n) => ({ ...n })) as SimNode[]
  const links = graph.links.map((l) => ({ ...l })) as SimLink[]
  createSimulation(nodes, links).tick(300)
  return {
    nodes: nodes.map(({ id, kind, label, weight, slug, x, y }) => ({
      id,
      kind,
      label,
      weight,
      ...(slug ? { slug } : {}),
      x: Math.round((x ?? 0) * 10) / 10,
      y: Math.round((y ?? 0) * 10) / 10,
    })),
    links: graph.links,
  }
}
