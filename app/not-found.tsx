import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, List } from "lucide-react"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="hud-grid flex min-h-screen items-center justify-center px-4 pt-14">
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <p className="hud-label text-cyan">// 404</p>
          <h1 className="text-4xl font-semibold tracking-tight neon-text">Page not found</h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="hud-label inline-flex items-center gap-2 hover:text-foreground">
            <ArrowLeft className="size-3.5" />
            Back to map
          </Link>
          <Link href="/nodes/" className="hud-label inline-flex items-center gap-2 hover:text-foreground">
            <List className="size-3.5" />
            Browse the index
          </Link>
        </div>
      </div>
    </main>
  )
}
