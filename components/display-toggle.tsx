"use client"

import { Contrast } from "lucide-react"
import { setDisplayMode, useDisplayMode } from "@/hooks/use-display-mode"
import { cn } from "@/lib/utils"

export function DisplayToggle() {
  const simple = useDisplayMode() === "simple"

  return (
    <button
      type="button"
      aria-pressed={simple}
      aria-label="Simple view"
      title={simple ? "Back to the full view with the map" : "Simple view: high contrast, no map"}
      onClick={() => setDisplayMode(simple ? "full" : "simple")}
      className={cn(
        "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
        simple ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/40 text-muted-foreground hover:text-foreground",
      )}
    >
      <Contrast className="size-4" />
      <span className="hidden lg:inline">Simple</span>
    </button>
  )
}
