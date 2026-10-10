import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { JsonLd } from "@/components/json-ld"
import { AUTHOR, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site"

const description =
  "Roy Berris is a software architect at New Orange in the Netherlands, translating between business and technology through solution architecture, DDD, API design, .NET and Next.js."

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

const roles = [
  { title: "Design", body: "Solution design for clients, from scoping and estimates to advice on technology choices." },
  { title: "Lead", body: "Guiding development teams as a tech lead, with reviews and shared standards." },
  { title: "Build", body: "Still hands-on, mostly in .NET and Next.js." },
]

const systems = [
  "Websites & CMS platforms",
  "Integrations & APIs",
  "Legacy modernization",
  "Custom business apps",
]

const principles = [
  {
    title: "Truth lives in one place",
    body: "The business confirms one description of the domain, and everything technical is derived from it. A problem found further down goes back up to be decided there, never patched below.",
  },
  {
    title: "Evidence is not a specification",
    body: "A sketch is not the truth, and what a system does today is not automatically what it should do. I don't invent names for things the business hasn't named.",
  },
  {
    title: "Precise language",
    body: "Vague words turn into vague code. I once opened a pull request only to fix one wrong word in an ADR. The part the business confirms stays in their language, often Dutch.",
  },
  {
    title: "Clean boundaries",
    body: "An external system gets no bounded context of its own, a legacy landscape is described from the outside, and dependencies run one way.",
  },
  {
    title: "Reliable AI, not only fast AI",
    body: "I use AI agents a lot, with guardrails. The agent that just wrote something is the worst one to check it, so every step gets a fresh one.",
  },
  {
    title: "Someone lives with the decision",
    body: "A decision isn't done when it merges. I think about the teams that consume a contract and write the consequences down in an ADR.",
  },
]

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
              in the Netherlands. I translate between what the business means and what the software does.
            </p>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl space-y-14 px-4 py-10 leading-relaxed text-foreground/85 md:px-8 md:py-14">
        <section aria-labelledby="work-heading" className="space-y-5">
          <h2 id="work-heading" className="text-2xl font-semibold tracking-tight text-foreground">What I do</h2>
          <p>
            The business knows what it means, and the software has to match that exactly. My job is to close that gap, in
            both directions. I do that in three ways:
          </p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {roles.map(({ title, body }) => (
              <li key={title} className="hud-panel p-4">
                <p className="hud-label text-cyan">// {title}</p>
                <p className="mt-2 text-sm">{body}</p>
              </li>
            ))}
          </ul>
          <p>
            I approach every system with solution architecture and Domain-Driven Design (DDD). Cloud and AI tooling
            I work with from the architecture side: I decide how they fit together. The systems I work on:
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Systems I work on">
            {systems.map((s) => (
              <li key={s} className="hud-chip">{s}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="like-heading" className="space-y-3">
          <h2 id="like-heading" className="text-2xl font-semibold tracking-tight text-foreground">How I work</h2>
          <p>
            I started tinkering with computers as a kid and never stopped. I still want to know how something works before
            I trust it.
          </p>
          <p>
            I ask &quot;why&quot; a lot, I say what I think, and I keep it short. I&apos;m pragmatic: a design that ships
            and holds up beats a perfect one on paper. And I like teaching, because explaining a decision is the best test
            of whether I understand it.
          </p>
        </section>

        <section aria-labelledby="principles-heading" className="space-y-5">
          <h2 id="principles-heading" className="text-2xl font-semibold tracking-tight text-foreground">What I stand for</h2>
          <p>I&apos;m relaxed about most things. These are the few I&apos;m strict about.</p>
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {principles.map(({ title, body }) => (
              <div key={title} className="border-l border-neon/40 pl-4">
                <dt className="font-semibold text-foreground">{title}</dt>
                <dd className="mt-1 text-sm">{body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="speaking-heading" className="space-y-3">
          <h2 id="speaking-heading" className="text-2xl font-semibold tracking-tight text-foreground">Speaking and writing</h2>
          <p>
            I speak about this work at events like DF23, the Dutch Umbraco community conference, and{" "}
            <Link href="/nodes/going-headless-with-mvc/" className="text-cyan hover:underline">Umbraco Community Day 2023</Link>.
            All my sessions are on{" "}
            <a href="https://sessionize.com/roy-berris" className="text-cyan hover:underline" target="_blank" rel="noopener noreferrer">
              Sessionize
            </a>
            .
          </p>
          <p>
            {SITE_NAME} is where I write it down. It&apos;s a mapped database rather than a classic blog: every post is a
            node, grouped into clusters. Browse the <Link href="/" className="text-cyan hover:underline">map</Link>, the{" "}
            <Link href="/nodes/" className="text-cyan hover:underline">index</Link>, or check out open-source tools in the{" "}
            <Link href="/projects/" className="text-cyan hover:underline">projects catalog</Link>. I use AI as a writing partner, not a
            ghostwriter, and I own every technical claim. More on that in{" "}
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
