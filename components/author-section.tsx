import Image from "next/image"
import Link from "next/link"
import { getAuthor } from "@/lib/authors"

export function AuthorSection({ name }: { name?: string }) {
  const author = getAuthor(name)
  if (!author) return null

  return (
    <section className="mt-16 border-t border-border/60 py-14">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="hud-panel flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:items-start sm:text-left">
          {author.avatar && (
            <Link href="/about/" aria-label={`About ${author.name}`} className="relative size-20 shrink-0 overflow-hidden rounded-full ring-1 ring-neon/50 shadow-[0_0_30px_-6px_var(--neon)] transition-shadow hover:shadow-[0_0_36px_-4px_var(--neon)]">
              <Image src={author.avatar} alt={`${author.name} profile picture`} fill className="object-cover" />
            </Link>
          )}

          <div className="space-y-2">
            <p className="hud-label text-cyan">// author · {author.role}</p>
            <h3 className="text-xl font-semibold text-foreground">
              <Link href="/about/" className="hover:text-cyan">{author.name}</Link>
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{author.bio}</p>
            <div className="flex flex-wrap justify-center gap-2 pt-2 sm:justify-start">
              <Link href="/about/" className="hud-chip hover:border-cyan hover:text-cyan">
                About
              </Link>
              {author.github && (
                <a
                  href={author.github}
                  className="hud-chip hover:border-cyan hover:text-cyan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
