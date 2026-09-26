"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, UserRound, Waypoints } from "lucide-react"
import { cn } from "@/lib/utils"

const views = [
  { href: "/", label: "Map", icon: Waypoints, match: (p: string) => p === "/" },
  { href: "/nodes/", label: "Index", icon: LayoutGrid, match: (p: string) => p.startsWith("/nodes") },
  { href: "/about/", label: "About", icon: UserRound, match: (p: string) => p.startsWith("/about") },
]

export function HudNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="View" className="flex h-9 items-center rounded-full border border-border bg-card/40 p-0.5">
      {views.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-full px-3 font-mono text-[11px] uppercase tracking-wider transition-colors",
              active ? "bg-neon/20 text-foreground shadow-[0_0_14px_-4px_var(--neon)]" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            <span className="sr-only sm:not-sr-only">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
