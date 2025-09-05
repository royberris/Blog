import Image from "next/image"

export function AuthorSection() {
  return (
    <section className="bg-muted/30 py-16 mt-16">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted">
            <Image src="/author.png" alt="Author profile picture" fill className="object-cover" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Roy Berris</h3>
            <p className="text-muted-foreground max-w-2xl text-pretty">
              As a .NET Software Architect, I specialize in designing and building scalable, high-performance applications. With a deep passion for clean code and robust architecture, I guide teams in leveraging the full potential of the Microsoft stack to solve complex business problems and deliver exceptional software solutions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <a
              href="https://github.com/royberris"
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
