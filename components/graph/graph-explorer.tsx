"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Clock, Crosshair, Search, X } from "lucide-react"
import { NodeGraph } from "@/components/graph/node-graph"
import { SEARCH_OPEN_EVENT } from "@/components/search-palette"
import { Slider } from "@/components/ui/slider"
import { DEFAULT_WINDOW_YEARS, isWithinYears } from "@/lib/node-age"
import { clusterId, nodeId, type GraphData, type GraphNode, type NodeSummary } from "@/lib/graph-types"
import { cn } from "@/lib/utils"

interface GraphExplorerProps {
  graphs: Record<number, GraphData> // one pre-laid-out graph per "last N years" step
  nodes: NodeSummary[]
  now: string // build time; the window is relative to it
  maxYears: number // the step that covers every node
  bottomSlot?: ReactNode // rendered under the cluster filter
}

const MAX_RESULTS = 5

export function GraphExplorer({ graphs, nodes: allNodes, now, maxYears, bottomSlot }: GraphExplorerProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [cursor, setCursor] = useState(0)
  const [focused, setFocused] = useState(false)
  const [activeCluster, setActiveCluster] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const [years, setYears] = useState(Math.min(DEFAULT_WINDOW_YEARS, maxYears))

  const graph = graphs[years]
  const nodes = useMemo(() => allNodes.filter((n) => isWithinYears(n.date, years, new Date(now))), [allNodes, years, now])
  const allTime = years >= maxYears
  const rangeLabel = allTime ? "All time" : `Last ${years} ${years === 1 ? "year" : "years"}`
  const rangeShort = allTime ? "all" : `${years}y`

  // A cluster can vanish when the window shrinks
  useEffect(() => {
    if (activeCluster && !graph.nodes.some((n) => n.id === activeCluster)) setActiveCluster(null)
  }, [graph, activeCluster])

  const clusters = useMemo(
    () => graph.nodes.filter((n) => n.kind === "cluster").sort((a, b) => b.weight - a.weight || a.label.localeCompare(b.label)),
    [graph],
  )

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const results = useMemo(() => {
    if (!terms.length) return []
    return nodes.filter((n) => {
      const haystack = `${n.code} ${n.title} ${n.excerpt} ${n.tags.join(" ")} ${n.author ?? ""}`.toLowerCase()
      return terms.every((t) => haystack.includes(t))
    })
  }, [nodes, query]) // eslint-disable-line react-hooks/exhaustive-deps

  // Matches outside the window, so search can offer to widen it
  const olderMatches = useMemo(() => {
    if (!terms.length || allTime) return 0
    return allNodes.filter((n) => {
      if (nodes.includes(n)) return false
      const haystack = `${n.code} ${n.title} ${n.excerpt} ${n.tags.join(" ")} ${n.author ?? ""}`.toLowerCase()
      return terms.every((t) => haystack.includes(t))
    }).length
  }, [allNodes, nodes, query, allTime]) // eslint-disable-line react-hooks/exhaustive-deps

  // Light up hits and their clusters on the map while typing
  const matchIds = useMemo(() => {
    if (!terms.length) return null
    const ids = new Set<string>()
    results.forEach((n) => {
      ids.add(nodeId(n.slug))
      n.tags.forEach((t) => ids.add(clusterId(t)))
    })
    return ids
  }, [results]) // eslint-disable-line react-hooks/exhaustive-deps

  // The HUD search button and ⌘K focus this field instead of opening the palette
  useEffect(() => {
    const claim = (e: Event) => {
      e.preventDefault()
      inputRef.current?.focus()
      inputRef.current?.select()
    }
    window.addEventListener(SEARCH_OPEN_EVENT, claim)
    return () => window.removeEventListener(SEARCH_OPEN_EVENT, claim)
  }, [])

  useEffect(() => setCursor(0), [query])

  const summaryBySlug = useMemo(() => new Map(allNodes.map((n) => [n.slug, n])), [allNodes])

  const renderHoverCard = useCallback(
    (node: GraphNode) => {
      const summary = node.slug ? summaryBySlug.get(node.slug) : undefined
      if (!summary) return null
      return (
        <div className="hud-panel space-y-2 bg-popover/95 p-4 shadow-[0_0_40px_-12px_var(--neon)]">
          <p className="hud-label normal-case text-cyan">///{summary.code}</p>
          <p className="font-semibold leading-snug text-balance">{summary.title}</p>
          <p className="line-clamp-4 text-sm leading-relaxed text-foreground/65 text-pretty">{summary.excerpt}</p>
          <p className="hud-label border-t border-border/60 pt-2">
            <time dateTime={summary.date}>{summary.date}</time> · {summary.readingTime} min
          </p>
        </div>
      )
    },
    [summaryBySlug],
  )

  const openNode = useCallback((slug: string) => router.push(`/nodes/${slug}`), [router])

  // Stable identity so memoised graph nodes don't re-render on every keystroke
  const handleSelect = useCallback(
    (node: GraphNode) => {
      if (node.kind === "node" && node.slug) {
        openNode(node.slug)
      } else {
        setActiveCluster((current) => (current === node.id ? null : node.id))
      }
    },
    [openNode],
  )

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const shown = results.slice(0, MAX_RESULTS)
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, shown.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
    } else if (e.key === "Enter" && shown[cursor]) {
      e.preventDefault()
      openNode(shown[cursor].slug)
    } else if (e.key === "Escape") {
      setQuery("")
      inputRef.current?.blur()
    }
  }

  const showResults = focused && terms.length > 0

  return (
    <div className="relative h-full w-full">
      <NodeGraph
        key={`${resetKey}-${years}`}
        data={graph}
        activeCluster={activeCluster}
        matchIds={matchIds}
        onNodeSelect={handleSelect}
        renderHoverCard={renderHoverCard}
      />

      {/* Search: the primary way into the database */}
      <div className="absolute inset-x-0 top-0 px-4 pt-4 md:pt-8">
        <div className="mx-auto max-w-xl">
          <h2 className="sr-only">Berris.dev node map</h2>
          <div className="relative z-10">
            <div
              className={cn(
                "flex h-14 items-center gap-3 rounded-2xl border bg-card/95 px-4 transition-shadow md:h-16",
                focused
                  ? "border-cyan shadow-[0_0_0_1px_var(--cyan),0_0_40px_-8px_var(--cyan)]"
                  : "border-cyan/40 shadow-[0_0_40px_-14px_var(--cyan)]",
              )}
            >
              <Search className="size-5 shrink-0 text-cyan" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 120)}
                onKeyDown={onKeyDown}
                placeholder="Search the knowledge database…"
                aria-label="Search nodes"
                aria-controls="search-results"
                aria-expanded={showResults}
                role="combobox"
                autoComplete="off"
                className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-lg [&::-webkit-search-cancel-button]:hidden"
              />
              {query ? (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              ) : (
                <kbd className="hidden rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground md:inline">⌘K</kbd>
              )}
            </div>

            {showResults && (
              <ul id="search-results" role="listbox" className="hud-panel absolute inset-x-0 top-full mt-2 overflow-hidden bg-popover/95 p-1.5">
                {results.length === 0 && olderMatches === 0 && <li className="hud-label px-3 py-4 text-center">No signal found</li>}
                {results.slice(0, MAX_RESULTS).map((n, i) => (
                  <li key={n.slug} role="option" aria-selected={i === cursor}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => openNode(n.slug)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                        i === cursor && "bg-neon/15",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="hud-label block text-cyan">
                          <span className="normal-case">///{n.code}</span> · {n.readingTime} min{n.author && ` · ${n.author}`}
                        </span>
                        <span className="block truncate font-medium">{n.title}</span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  </li>
                ))}
                {olderMatches > 0 && (
                  <li>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setYears(maxYears)}
                      className="hud-label flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-cyan hover:bg-neon/15"
                    >
                      <Clock className="size-3" />
                      {olderMatches} older {olderMatches === 1 ? "match" : "matches"} · search all time
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="hud-label min-w-0 truncate">
              {terms.length
                ? `${results.length} of ${nodes.length} nodes match${olderMatches ? ` · ${olderMatches} older` : ""}`
                : <>{nodes.length} nodes · {clusters.length} clusters<span className="hidden sm:inline"> · {graph.links.length} links</span></>}
            </p>
            <div className="flex items-center gap-3">
            {/* Deliberately quiet: the window is a minor control, the map is the point */}
            <div className="group flex items-center gap-2 opacity-60 transition-opacity focus-within:opacity-100 hover:opacity-100">
              <Clock className="size-3 shrink-0 text-muted-foreground group-hover:text-cyan group-focus-within:text-cyan" />
              <span className="hud-label w-6 whitespace-nowrap normal-case" aria-hidden="true">{rangeShort}</span>
              <Slider
                min={1}
                max={maxYears}
                step={1}
                value={[years]}
                onValueChange={([value]) => setYears(value)}
                aria-label={`Time range: ${rangeLabel}`}
                className="w-16 sm:w-20 [&_[data-slot=slider-track]]:h-0.5 [&_[data-slot=slider-range]]:bg-muted-foreground group-hover:[&_[data-slot=slider-range]]:bg-cyan group-focus-within:[&_[data-slot=slider-range]]:bg-cyan [&_[data-slot=slider-thumb]]:size-2.5 [&_[data-slot=slider-thumb]]:border-muted-foreground group-hover:[&_[data-slot=slider-thumb]]:border-cyan group-focus-within:[&_[data-slot=slider-thumb]]:border-cyan"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveCluster(null)
                setQuery("")
                setYears(Math.min(DEFAULT_WINDOW_YEARS, maxYears))
                setResetKey((k) => k + 1)
              }}
              className="hud-chip bg-card/90 px-2.5 py-1"
              aria-label="Reset view"
            >
              <Crosshair className="size-3.5" />
              <span className="hidden sm:inline">Recenter</span>
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thumb-zone cluster filter */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="bg-gradient-to-t from-background via-background/95 to-transparent pt-10 lg:via-background/80">
          <p className="hud-label mb-2 px-4 md:px-8">Clusters</p>
          <div className="no-scrollbar pointer-events-auto flex gap-2 overflow-x-auto px-4 md:px-8" role="toolbar" aria-label="Filter by cluster">
            <button
              type="button"
              className="hud-chip bg-card/60"
              data-active={activeCluster === null}
              onClick={() => setActiveCluster(null)}
            >
              All
            </button>
            {clusters.map((c) => (
              <button
                key={c.id}
                type="button"
                className="hud-chip bg-card/60"
                data-active={activeCluster === c.id}
                onClick={() => setActiveCluster((cur) => (cur === c.id ? null : c.id))}
              >
                {c.label}
                <span className="opacity-60">{c.weight}</span>
              </button>
            ))}
          </div>
          {bottomSlot}
        </div>
      </div>
    </div>
  )
}
