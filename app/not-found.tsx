import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <h2 className="text-xl text-muted-foreground">Blog post not found</h2>
          <p className="text-muted-foreground max-w-md">
            The blog post you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blogs
        </Link>
      </div>
    </div>
  )
}
