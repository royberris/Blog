// Shared, client-safe types for the node graph (no fs imports here)

export interface NodeSummary {
  slug: string
  code: string // what3words-style, e.g. amber.orbit.falcon
  title: string
  date: string
  updated: string | null // optional "updated" frontmatter, ISO date
  excerpt: string
  tags: string[]
  readingTime: number
  author: string | null
}

export type GraphNodeKind = "node" | "cluster"

export interface GraphNode {
  id: string
  kind: GraphNodeKind
  label: string
  weight: number
  slug?: string
  // Pre-computed layout position (set at build time)
  x?: number
  y?: number
}

export interface GraphLink {
  source: string
  target: string
  kind: "cluster" | "related"
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

export const clusterId = (tag: string) => `cluster:${tag}`
export const nodeId = (slug: string) => `node:${slug}`
