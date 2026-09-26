"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { NodeCard } from "@/components/node-card"
import type { NodeSummary } from "@/lib/graph-types"

type SortKey = "recent" | "length"

export function NodeIndex({ nodes }: { nodes: NodeSummary[] }) {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const cluster = params.get("cluster")
  const sort: SortKey = params.get("sort") === "length" ? "length" : "recent"
  const [query, setQuery] = useState(params.get("q") ?? "")

  const clusters = useMemo(() => {
    const counts = new Map<string, number>()
    nodes.forEach((n) => n.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)))
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [nodes])

  const visible = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const filtered = nodes
      .filter((n) => !cluster || n.tags.includes(cluster))
      .filter((n) => {
        const haystack = `${n.code} ${n.title} ${n.excerpt} ${n.tags.join(" ")} ${n.author ?? ""}`.toLowerCase()
        return terms.every((t) => haystack.includes(t))
      })
    return [...filtered].sort((a, b) =>
      sort === "length" ? b.readingTime - a.readingTime : new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }, [nodes, cluster, sort, query])

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <>
      <div className="sticky top-14 z-20 -mx-4 space-y-3 border-b border-border/60 bg-background/95 px-4 py-3 md:-mx-8 md:bg-background/80 md:backdrop-blur-xl md:px-8">
        <label className="flex h-12 items-center gap-3 rounded-xl border border-cyan/40 bg-card/80 px-4 shadow-[0_0_30px_-14px_var(--cyan)] focus-within:border-cyan focus-within:shadow-[0_0_0_1px_var(--cyan),0_0_30px_-8px_var(--cyan)]">
          <Search className="size-4 shrink-0 text-cyan" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              update("q", e.target.value.trim() || null)
            }}
            placeholder="Filter nodes…"
            aria-label="Filter nodes"
            className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </label>
        <div className="no-scrollbar flex gap-2 overflow-x-auto" role="toolbar" aria-label="Filter by cluster">
          <button type="button" className="hud-chip" data-active={!cluster} onClick={() => update("cluster", null)}>
            All <span className="opacity-60">{nodes.length}</span>
          </button>
          {clusters.map(([tag, count]) => (
            <button
              key={tag}
              type="button"
              className="hud-chip"
              data-active={cluster === tag}
              onClick={() => update("cluster", cluster === tag ? null : tag)}
            >
              {tag} <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <p className="hud-label" aria-live="polite">
            {visible.length} {visible.length === 1 ? "result" : "results"}
            {cluster && <> in <span className="text-cyan">{cluster}</span></>}
          </p>
          <div className="flex gap-1" role="group" aria-label="Sort">
            {(["recent", "length"] as const).map((key) => (
              <button
                key={key}
                type="button"
                className="hud-chip px-2.5 py-1"
                data-active={sort === key}
                onClick={() => update("sort", key === "recent" ? null : key)}
              >
                {key === "recent" ? "Recent" : "Longest"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((node) => (
          <NodeCard key={node.slug} node={node} />
        ))}
      </div>
    </>
  )
}
