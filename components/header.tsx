import Link from "next/link"

interface HeaderProps {
  title?: string
  subtitle?: string
  showNavigation?: boolean
}

export function Header({
  title = "Blogs",
  subtitle = "Check out my .NET and Umbraco related blogs.",
  showNavigation = true,
}: HeaderProps) {
  return (
    <header
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#7c3aed",
        minHeight: "400px",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(147, 51, 234, 0.2), transparent)",
        }}
      />

      <div className="relative z-10">
        {showNavigation && (
          <nav className="flex items-center justify-between px-6 py-4 md:px-12">
            <div className="flex items-center space-x-8">
              <Link href="/" className="font-medium transition-colors hover:opacity-80" style={{ color: "#ffffff" }}>
                Home
              </Link>
              <Link
                href="/blogs"
                className="font-medium transition-colors hover:opacity-80"
                style={{ color: "#ffffff" }}
              >
                Blogs
              </Link>
            </div>
          </nav>
        )}

        <div className="px-6 pb-16 pt-8 md:px-12 md:pb-24 md:pt-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance" style={{ color: "#ffffff" }}>
            {title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-pretty" style={{ color: "#ffffff", opacity: 0.95 }}>
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  )
}
