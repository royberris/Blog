import Image from "next/image"

export function AuthorSection() {
  return (
    <section className="bg-muted/30 py-16 mt-16">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted">
            <Image src="/professional-headshot-of-a-developer.jpg" alt="Author profile picture" fill className="object-cover" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Your Name</h3>
            <p className="text-muted-foreground max-w-2xl text-pretty">
              Passionate developer specializing in .NET and Umbraco development. I love sharing knowledge about web
              development, best practices, and the latest technologies in the Microsoft ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <a
              href="mailto:your.email@example.com"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="https://twitter.com/yourusername"
              className="text-foreground/80 hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="https://github.com/yourusername"
              className="text-foreground/80 hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
