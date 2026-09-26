import Link from "next/link"
import { getNodeSummaries } from "@/lib/nodes"
import { SearchPalette } from "@/components/search-palette"
import { HudNav } from "@/components/hud-nav"

export function HudBar() {
  const nodes = getNodeSummaries()

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/95 md:bg-background/70 md:backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between gap-3 px-4 md:px-8">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Berris.dev — node map">
          <span className="relative flex size-7 items-center justify-center">
            <span className="absolute inset-0 rotate-45 rounded-[6px] border border-neon/60 transition-transform group-hover:rotate-[135deg]" />
            <span className="size-2 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">Berris<span className="text-cyan">.dev</span></span>
            <span className="hud-label text-[9px]">Node database</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <HudNav />
          <SearchPalette nodes={nodes} />
        </div>
      </div>
    </header>
  )
}
