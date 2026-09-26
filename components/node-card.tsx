import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { NodeSummary } from "@/lib/graph-types"

export function NodeCard({ node }: { node: NodeSummary }) {
  return (
    <article className="group relative">
      <Link
        href={`/nodes/${node.slug}`}
        className="hud-panel flex h-full flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-neon/60 hover:shadow-[0_0_40px_-12px_var(--neon)] focus-visible:border-cyan"
      >
        <div className="flex items-center justify-between">
          <span className="hud-label normal-case text-cyan">///{node.code}</span>
          <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold leading-snug text-balance md:text-xl">{node.title}</h2>
          <p className="line-clamp-3 text-sm leading-relaxed text-foreground/65 text-pretty">{node.excerpt}</p>
        </div>

        <div className="mt-auto space-y-3 border-t border-border/60 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {node.tags.map((tag) => (
              <span key={tag} className="rounded-sm bg-neon/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/75">
                {tag}
              </span>
            ))}
          </div>
          <p className="hud-label">
            {node.author && <>{node.author} · </>}<time dateTime={node.date}>{node.date}</time> · {node.readingTime} min
          </p>
        </div>
      </Link>
    </article>
  )
}
