import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { JsonLd } from "@/components/json-ld"
import { AUTHOR, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site"

const description =
  "Roy Berris is a software architect at New Orange in the Netherlands, working on software architecture, API design, ADRs, .NET and Umbraco. This is who writes Berris.dev."

export const metadata: Metadata = {
  title: "About Roy Berris",
  description,
  alternates: {
    canonical: "/about/",
    types: { "text/plain": [{ url: "/llms.txt", title: "LLM-friendly site index" }] },
  },
  openGraph: {
    type: "profile",
    url: "/about/",
    siteName: SITE_NAME,
    title: `About ${AUTHOR.name}`,
    description,
    firstName: "Roy",
    lastName: "Berris",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${AUTHOR.name}`,
    description,
    images: ["/og.png"],
  },
}

const links = [
  { label: "GitHub", match: "github.com" },
  { label: "LinkedIn", match: "linkedin.com" },
  { label: "Sessionize", match: "sessionize.com" },
  { label: "YouTube", match: "youtube.com" },
].map(({ label, match }) => ({ label, href: AUTHOR.sameAs.find((u) => u.includes(match))! }))

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about/#profilepage`,
  url: absoluteUrl("/about/"),
  name: `About ${AUTHOR.name}`,
  description,
  inLanguage: "en",
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: AUTHOR.name,
    url: AUTHOR.url,
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-14">
      <JsonLd data={jsonLd} />

      <header className="hud-grid border-b border-border/60">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pb-10 pt-8 sm:flex-row sm:items-center md:px-8 md:pb-14 md:pt-12">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full ring-1 ring-neon/50 shadow-[0_0_30px_-6px_var(--neon)]">
            <Image src="/author.png" alt={`${AUTHOR.name} profile picture`} fill priority className="object-cover" />
          </div>
          <div>
            <p className="hud-label text-cyan">// author · {AUTHOR.jobTitle}</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-balance neon-text md:text-5xl">
              About {AUTHOR.name}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-foreground/70 text-pretty">
              I&apos;m a software architect at{" "}
              <a href={AUTHOR.worksFor.url} className="text-cyan hover:underline" target="_blank" rel="noopener noreferrer">
                {AUTHOR.worksFor.name}
              </a>{" "}
              in the Netherlands. I write about the decisions behind my work here on {SITE_NAME}.
            </p>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl space-y-10 px-4 py-10 leading-relaxed text-foreground/85 md:px-8 md:py-14">
        <section aria-labelledby="work-heading" className="space-y-3">
          <h2 id="work-heading" className="text-2xl font-semibold tracking-tight text-foreground">What I work on</h2>
          <p>
            My focus is software architecture and API design. That includes designing APIs that AI agents can use, not
            only human developers. When a design decision matters, I document it in an Architecture Decision Record (ADR),
            so the context and the alternatives are still there later.
          </p>
          <p>
            Most of my hands-on work is in .NET and Umbraco, including multi-site Umbraco solutions. Before New Orange, I
            was a software engineer at iO.
          </p>
        </section>

        <section aria-labelledby="speaking-heading" className="space-y-3">
          <h2 id="speaking-heading" className="text-2xl font-semibold tracking-tight text-foreground">Speaking</h2>
          <p>
            I also talk about this work on stage. I spoke at DF23, the Dutch Umbraco community conference. My sessions are
            listed on my{" "}
            <a href="https://sessionize.com/s/roy-berris/" className="text-cyan hover:underline" target="_blank" rel="noopener noreferrer">
              Sessionize profile
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="site-heading" className="space-y-3">
          <h2 id="site-heading" className="text-2xl font-semibold tracking-tight text-foreground">What {SITE_NAME} is</h2>
          <p>
            {SITE_NAME} is a mapped database, not a classic blog. Every post is a node, and nodes are grouped into clusters
            such as API Design, Software Architecture and AI Agents. The{" "}
            <Link href="/" className="text-cyan hover:underline">map</Link> shows how nodes connect, and the{" "}
            <Link href="/nodes/" className="text-cyan hover:underline">index</Link> lists all of them.
          </p>
        </section>

        <section aria-labelledby="writing-heading" className="space-y-3">
          <h2 id="writing-heading" className="text-2xl font-semibold tracking-tight text-foreground">How I write</h2>
          <p>
            I use AI as a writing partner, not a ghostwriter. I bring the experience, the opinions and the technical
            claims. AI helps with structure and readability. I review every post and I own every technical claim on this
            site. I explain the full process in{" "}
            <Link href="/nodes/ai-assisted-blogging/" className="text-cyan hover:underline">AI-Assisted Blogging</Link>.
          </p>
        </section>

        <section aria-labelledby="links-heading" className="hud-panel space-y-4 p-6">
          <h2 id="links-heading" className="hud-label text-foreground">// elsewhere</h2>
          <ul className="flex flex-wrap gap-2">
            {links.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="hud-chip hover:border-cyan hover:text-cyan" target="_blank" rel="me noopener noreferrer">
                  {label}
                  <ArrowUpRight className="size-3" />
                </a>
              </li>
            ))}
          </ul>
          <p className="hud-label normal-case tracking-normal">
            For AI tools: <a href="/llms.txt" className="text-cyan hover:underline">/llms.txt</a> ·{" "}
            <a href="/llms-full.txt" className="text-cyan hover:underline">/llms-full.txt</a>
          </p>
        </section>
      </article>
    </main>
  )
}
