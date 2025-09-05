import Link from "next/link"

export function Navigation() {
  return (
    <nav className="bg-white border-b border-border px-6 py-4 md:px-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
            Home
          </Link>
          <Link href="/blogs" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
            Blogs
          </Link>
        </div>
      </div>
    </nav>
  )
}
