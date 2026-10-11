"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Hexagon, Search } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { clusterSlug } from "@/lib/site"
import type { NodeSummary } from "@/lib/graph-types"

export const SEARCH_OPEN_EVENT = "berris:search-open"

export function SearchPalette({ nodes }: { nodes: NodeSummary[] }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  // The map has its own prominent search field, so the HUD trigger is only needed elsewhere
  const onMap = usePathname() === "/"
  const clusters = Array.from(new Set(nodes.flatMap((n) => n.tags))).sort()

  // A page with its own inline search (the map) can claim the request by calling preventDefault
  const requestOpen = () => {
    const claimed = !window.dispatchEvent(new Event(SEARCH_OPEN_EVENT, { cancelable: true }))
    if (!claimed) setOpen(true)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (open) setOpen(false)
        else requestOpen()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      <button
        type="button"
        hidden={onMap}
        onClick={requestOpen}
        className="flex h-9 items-center gap-2 rounded-full border border-cyan/50 bg-cyan/10 px-3 text-cyan shadow-[0_0_18px_-6px_var(--cyan)] transition-colors hover:bg-cyan/20 md:w-64 md:justify-start"
        aria-label="Search nodes"
      >
        <Search className="size-4" />
        <span className="hidden font-mono text-[11px] uppercase tracking-wider md:inline">Search nodes…</span>
        <kbd className="ml-auto hidden rounded border border-cyan/40 px-1.5 font-mono text-[10px] md:inline">⌘K</kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search nodes"
        description="Find a node by title, summary or cluster"
        className="hud-panel border-neon/30 bg-popover/95"
      >
        <CommandInput placeholder="Query the database…" />
        <CommandList className="max-h-[60vh]">
          <CommandEmpty className="hud-label py-8 text-center">No signal found</CommandEmpty>
          <CommandGroup heading="Nodes">
            {nodes.map((n) => (
              <CommandItem
                key={n.slug}
                value={`${n.code} ${n.title} ${n.excerpt} ${n.tags.join(" ")}`}
                onSelect={() => go(`/nodes/${n.slug}/`)}
                className="flex flex-col items-start gap-1"
              >
                <span className="hud-label text-cyan"><span className="normal-case">///{n.code}</span> · {n.readingTime} min</span>
                <span className="font-medium">{n.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Projects & Tools">
            <CommandItem
              value="Devbox Agents devbox-vscode-extension VS Code Extension Claude Code Codex Antigravity tmux worktree"
              onSelect={() => go(`/projects/devbox-vscode-extension/`)}
              className="flex flex-col items-start gap-1"
            >
              <span className="hud-label text-cyan">VS Code Extension · v1.0.0</span>
              <span className="font-medium">Devbox Agents (devbox-vscode-extension)</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Clusters">
            {clusters.map((tag) => (
              <CommandItem key={tag} value={`cluster ${tag}`} onSelect={() => go(`/clusters/${clusterSlug(tag)}/`)}>
                <Hexagon className="text-neon" />
                <span className="font-mono text-xs uppercase tracking-wider">{tag}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
