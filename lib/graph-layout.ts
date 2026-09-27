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

export const shortLabel = (label: string, max = 26) => {
  const head = label.split(/[:—–]/)[0].trim()
  return head.length > max ? `${head.slice(0, max - 1)}…` : head
}

// Approximate footprint of a node plus the label rendered beneath it, relative to its centre.
// Char widths match the rendered fonts: 12px semibold sans for nodes, 9.5px tracked mono for clusters.
export function labelBox(n: GraphNode) {
  const r = nodeRadius(n)
  const text = n.kind === "cluster" ? n.label : shortLabel(n.label)
  const halfWidth = Math.max(r, text.length * (n.kind === "cluster" ? 3.7 : 3.4))
  return { halfWidth, top: r, bottom: r + (n.kind === "cluster" ? 22 : 26) }
}

// Rectangle collision over node + label boxes, so labels never overlap each other or other nodes
function forceLabelCollide(padding = 8, iterations = 3) {
  let nodes: SimNode[] = []
  const force = () => {
    for (let k = 0; k < iterations; k++) resolve()
  }
  const resolve = () => {
    const boxes = nodes.map(labelBox)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        const ba = boxes[i]
        const bb = boxes[j]
        const dx = (b.x ?? 0) + (b.vx ?? 0) - ((a.x ?? 0) + (a.vx ?? 0))
        const dy = (b.y ?? 0) + (b.vy ?? 0) - ((a.y ?? 0) + (a.vy ?? 0))
        const overlapX = ba.halfWidth + bb.halfWidth + padding - Math.abs(dx)
        // b below a: a's bottom meets b's top, and vice versa
        const overlapY = (dy >= 0 ? ba.bottom + bb.top : bb.bottom + ba.top) + padding - Math.abs(dy)
        if (overlapX <= 0 || overlapY <= 0) continue
        // Push apart along the cheaper axis
        // Like d3's forceCollide, not scaled by alpha: overlap must lose to links even as the layout cools
        const strength = 0.5
        if (overlapX < overlapY) {
          const shift = (dx >= 0 ? 1 : -1) * overlapX * strength
          a.vx = (a.vx ?? 0) - shift
          b.vx = (b.vx ?? 0) + shift
        } else {
          const shift = (dy >= 0 ? 1 : -1) * overlapY * strength
          a.vy = (a.vy ?? 0) - shift
          b.vy = (b.vy ?? 0) + shift
        }
      }
    }
  }
  force.initialize = (n: SimNode[]) => {
    nodes = n
  }
  return force
}

export function createSimulation(nodes: SimNode[], links: SimLink[]) {
  return forceSimulation<SimNode, SimLink>(nodes)
    .force(
      "link",
      forceLink<SimNode, SimLink>(links)
        .id((d) => d.id)
        .distance((l) => (l.kind === "related" ? 120 : 85))
        .strength(0.7),
    )
    .force("charge", forceManyBody<SimNode>().strength((d) => (d.kind === "cluster" ? -300 : -240)))
    .force("collide", forceCollide<SimNode>().radius((d) => nodeRadius(d) + 22))
    .force("labels", forceLabelCollide())
    .force("center", forceCenter(0, 0))
    .stop()
}

// Settle the layout at build time so the client paints final positions without running physics
export function withLayout(graph: GraphData): GraphData {
  const nodes = graph.nodes.map((n) => ({ ...n })) as SimNode[]
  const links = graph.links.map((l) => ({ ...l })) as SimLink[]
  createSimulation(nodes, links).tick(400)
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
