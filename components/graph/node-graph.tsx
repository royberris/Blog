"use client"

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { select } from "d3-selection"
import { zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom"
import { drag } from "d3-drag"
import "d3-transition"
import type { GraphData, GraphNode } from "@/lib/graph-types"
import { createSimulation, labelBox, nodeRadius, shortLabel, type SimLink, type SimNode } from "@/lib/graph-layout"
import { cn } from "@/lib/utils"

interface NodeGraphProps {
  data: GraphData
  selectedId?: string | null
  activeCluster?: string | null
  focusId?: string | null
  // Search hits: when set, only these ids are lit
  matchIds?: Set<string> | null
  compact?: boolean
  className?: string
  onNodeSelect?: (node: GraphNode) => void
}

const ZOOMED_OUT_BELOW = 0.45

// Dark outline behind labels so links and neighbouring nodes don't bleed through the text
const labelHalo = { stroke: "var(--background)", strokeWidth: 4, strokeLinejoin: "round", paintOrder: "stroke" } as const

const hexagon = (r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6
    return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`
  }).join(" ")

const endId = (end: string | number | SimNode) => (typeof end === "object" ? end.id : String(end))

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}

// Positions arrive pre-computed from the build; the simulation only wakes up while dragging
function useLayout(data: GraphData) {
  return useMemo(() => {
    const nodes = data.nodes.map((n) => ({ ...n })) as SimNode[]
    const links = data.links.map((l) => ({ ...l })) as SimLink[]
    const sim = createSimulation(nodes, links)
    return { nodes, links, sim }
  }, [data])
}

interface NodeViewProps {
  node: SimNode
  lit: boolean
  active: boolean
  showLabel: boolean
  compact: boolean
  register: (id: string, el: SVGGElement | null) => void
  onHover: (id: string | null) => void
  onSelect?: (node: GraphNode) => void
}

// Memoised so hover/search only re-render the nodes whose state actually changed
const NodeView = memo(function NodeView({ node: n, lit, active, showLabel, compact, register, onHover, onSelect }: NodeViewProps) {
  const r = nodeRadius(n)
  return (
    <g
      ref={(el) => register(n.id, el)}
      data-id={n.id}
      transform={`translate(${n.x ?? 0},${n.y ?? 0})`}
      role="button"
      tabIndex={0}
      aria-label={n.kind === "cluster" ? `Cluster ${n.label}` : `Node ${n.label}`}
      className="cursor-pointer outline-none [&:focus-visible>.focus-ring]:opacity-100"
      style={{ opacity: lit ? 1 : 0.18, transition: "opacity 250ms" }}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(n.id)}
      onPointerLeave={() => onHover(null)}
      onClick={() => onSelect?.(n)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect?.(n)
        }
      }}
    >
      {/* Generous invisible hit area for thumbs */}
      <circle r={Math.max(r + 10, 22)} fill="transparent" />
      <circle className="focus-ring opacity-0" r={r + 9} fill="none" style={{ stroke: "var(--cyan)" }} strokeWidth={1.5} />

      {n.kind === "cluster" ? (
        <>
          <polygon
            points={hexagon(r)}
            style={{
              fill: active ? "var(--cyan-soft)" : "oklch(0.2 0.05 280 / 0.8)",
              stroke: active ? "var(--cyan)" : "var(--neon)",
            }}
            strokeWidth={1.4}
          />
          <polygon points={hexagon(r * 0.45)} style={{ fill: active ? "var(--cyan)" : "var(--neon-soft)" }} />
          <text
            y={r + 16}
            textAnchor="middle"
            className="font-mono uppercase"
            style={{ ...labelHalo, fill: active ? "var(--cyan)" : "var(--muted-foreground)", fontSize: 9.5, letterSpacing: "0.14em" }}
          >
            {n.label}
          </text>
        </>
      ) : (
        <>
          {/* Gradient halo instead of an SVG blur filter: same glow, no per-frame filter cost */}
          <circle r={r * 1.8} fill="url(#halo)" />
          <circle r={r + 6} fill="none" style={{ stroke: active ? "var(--cyan)" : "var(--neon)", strokeOpacity: 0.35 }} strokeWidth={1} />
          <circle r={r} fill="url(#core)" />
          {showLabel && (
            <text y={r + 18} textAnchor="middle" style={{ ...labelHalo, fill: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>
              {shortLabel(n.label, compact ? 22 : 26)}
            </text>
          )}
        </>
      )}
    </g>
  )
})

export function NodeGraph({
  data,
  selectedId,
  activeCluster,
  focusId,
  matchIds,
  compact = false,
  className,
  onNodeSelect,
}: NodeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const layerRef = useRef<SVGGElement>(null)
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const nodeEls = useRef(new Map<string, SVGGElement>())
  const linkEls = useRef<(SVGLineElement | null)[]>([])
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [zoomedOut, setZoomedOut] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const { nodes, links, sim } = useLayout(data)

  const adjacency = useMemo(() => {
    const map = new Map<string, Set<string>>()
    data.nodes.forEach((n) => map.set(n.id, new Set([n.id])))
    data.links.forEach((l) => {
      map.get(l.source)?.add(l.target)
      map.get(l.target)?.add(l.source)
    })
    return map
  }, [data])

  const register = useCallback((id: string, el: SVGGElement | null) => {
    if (el) nodeEls.current.set(id, el)
    else nodeEls.current.delete(id)
  }, [])

  // Position updates during drag go straight to the DOM, bypassing React
  const applyPositions = useCallback(() => {
    nodes.forEach((n) => nodeEls.current.get(n.id)?.setAttribute("transform", `translate(${n.x ?? 0},${n.y ?? 0})`))
    links.forEach((l, i) => {
      const el = linkEls.current[i]
      if (!el) return
      const s = l.source as SimNode
      const t = l.target as SimNode
      el.setAttribute("x1", String(s.x ?? 0))
      el.setAttribute("y1", String(s.y ?? 0))
      el.setAttribute("x2", String(t.x ?? 0))
      el.setAttribute("y2", String(t.y ?? 0))
    })
  }, [nodes, links])

  useEffect(() => {
    sim.on("tick", applyPositions)
    return () => {
      sim.on("tick", null)
      sim.stop()
    }
  }, [sim, applyPositions])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Zoom / pan / pinch: the transform is written to the DOM directly, React only hears about label visibility
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 4])
      .on("zoom", (event) => {
        layerRef.current?.setAttribute("transform", event.transform.toString())
        setZoomedOut(event.transform.k < ZOOMED_OUT_BELOW)
      })
    zoomRef.current = behavior
    const selection = select(svg).call(behavior)
    if (compact) {
      // Don't hijack page scroll on the reading page
      selection.on("wheel.zoom", null)
    }
    selection.on("dblclick.zoom", null)
    return () => {
      selection.on(".zoom", null)
    }
  }, [compact])

  const fitTo = useCallback(
    (ids: Set<string> | null, animate: boolean) => {
      const svg = svgRef.current
      const behavior = zoomRef.current
      if (!svg || !behavior || !size.width) return
      const targets = nodes.filter((n) => !ids || ids.has(n.id))
      if (!targets.length) return
      // Keep clear of the overlay search (top) and cluster chips (bottom) on the full map
      const inset = compact ? { x: 16, top: 24, bottom: 24 } : { x: 12, top: size.width >= 768 ? 180 : 130, bottom: 110 }
      const boxes = targets.map((n) => ({ n, box: labelBox(n) }))
      const xs = boxes.flatMap(({ n, box }) => [(n.x ?? 0) - box.halfWidth, (n.x ?? 0) + box.halfWidth])
      const ys = boxes.flatMap(({ n, box }) => [(n.y ?? 0) - box.top, (n.y ?? 0) + box.bottom])
      const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
      const availW = size.width - inset.x * 2
      const availH = size.height - inset.top - inset.bottom
      const scale = Math.min(1.6, Math.max(0.3, Math.min(availW / (maxX - minX || 1), availH / (maxY - minY || 1))))
      const next = zoomIdentity
        .translate(size.width / 2, inset.top + availH / 2)
        .scale(scale)
        .translate(-(minX + maxX) / 2, -(minY + maxY) / 2)
      const selection = select(svg)
      if (animate && !reducedMotion) {
        selection.transition().duration(650).call(behavior.transform, next)
      } else {
        selection.call(behavior.transform, next)
      }
    },
    [nodes, size, compact, reducedMotion],
  )

  // Initial fit, and refit when the viewport changes size
  useEffect(() => {
    if (!size.width) return
    const focusSet = focusId ? adjacency.get(focusId) ?? null : null
    fitTo(compact ? null : focusSet, false)
  }, [size.width, size.height, nodes]) // eslint-disable-line react-hooks/exhaustive-deps

  // Refocus when the active cluster changes
  const firstCluster = useRef(true)
  useEffect(() => {
    if (firstCluster.current) {
      firstCluster.current = false
      return
    }
    fitTo(activeCluster ? adjacency.get(activeCluster) ?? null : null, true)
  }, [activeCluster]) // eslint-disable-line react-hooks/exhaustive-deps

  // Node dragging, bound once per layout
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const byId = new Map(nodes.map((n) => [n.id, n]))
    const behavior = drag<SVGGElement, unknown>()
      .subject(function () {
        const n = byId.get(this.dataset.id ?? "")
        return n ? { x: n.x ?? 0, y: n.y ?? 0 } : { x: 0, y: 0 }
      })
      .on("start", function (event) {
        const n = byId.get(this.dataset.id ?? "")
        if (!n) return
        if (!event.active) sim.alphaTarget(0.25).restart()
        n.fx = n.x
        n.fy = n.y
      })
      .on("drag", function (event) {
        const n = byId.get(this.dataset.id ?? "")
        if (!n) return
        n.fx = event.x
        n.fy = event.y
      })
      .on("end", function (event) {
        const n = byId.get(this.dataset.id ?? "")
        if (!n) return
        if (!event.active) sim.alphaTarget(0)
        n.fx = null
        n.fy = null
      })
    const selection = select(svg).selectAll<SVGGElement, unknown>("g[data-id]").call(behavior)
    return () => {
      selection.on(".drag", null)
    }
  }, [nodes, sim])

  const highlight = useMemo(() => {
    if (hoveredId) return adjacency.get(hoveredId) ?? null
    if (matchIds) return matchIds
    const anchor = selectedId ?? activeCluster ?? (compact ? focusId : null)
    return anchor ? adjacency.get(anchor) ?? null : null
  }, [hoveredId, matchIds, selectedId, activeCluster, focusId, compact, adjacency])

  const isLit = (id: string) => !highlight || highlight.has(id)

  return (
    <div ref={containerRef} className={cn("relative h-full w-full touch-none select-none", className)}>
      <svg
        ref={svgRef}
        width={size.width}
        height={size.height}
        className={cn("block cursor-grab active:cursor-grabbing transition-opacity duration-500", size.width ? "opacity-100" : "opacity-0")}
        role="group"
        aria-label="Map of all nodes and clusters"
      >
        <defs>
          <radialGradient id="core" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="oklch(0.9 0.08 293)" />
            <stop offset="45%" stopColor="oklch(0.78 0.2 293)" />
            <stop offset="100%" stopColor="oklch(0.5 0.25 293)" />
          </radialGradient>
          <radialGradient id="halo">
            <stop offset="0%" stopColor="oklch(0.68 0.25 293)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="oklch(0.68 0.25 293)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g ref={layerRef}>
          <g>
            {links.map((l, i) => {
              const s = l.source as SimNode
              const t = l.target as SimNode
              const lit = !!highlight && isLit(endId(s)) && isLit(endId(t))
              const related = l.kind === "related"
              return (
                <line
                  key={i}
                  ref={(el) => {
                    linkEls.current[i] = el
                  }}
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  className={lit && !reducedMotion ? "graph-stream" : undefined}
                  style={{
                    stroke: related || lit ? "var(--cyan)" : "var(--neon)",
                    strokeOpacity: highlight ? (lit ? 0.85 : 0.06) : related ? 0.5 : 0.28,
                    strokeWidth: lit ? 1.6 : 1,
                    strokeDasharray: lit || related ? "4 8" : undefined,
                    transition: "stroke-opacity 250ms",
                  }}
                />
              )
            })}
          </g>

          {nodes.map((n) => (
            <NodeView
              key={n.id}
              node={n}
              lit={isLit(n.id)}
              active={n.id === selectedId || n.id === activeCluster || (compact && n.id === focusId)}
              showLabel={!zoomedOut}
              compact={compact}
              register={register}
              onHover={setHoveredId}
              onSelect={onNodeSelect}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
