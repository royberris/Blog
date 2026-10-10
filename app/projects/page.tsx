import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Box, Code, ExternalLink, GitBranch, Terminal } from "lucide-react"
import { getAllProjects } from "@/lib/projects"
import { JsonLd } from "@/components/json-ld"
import { AUTHOR, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Projects & Packages",
  description:
    "Open-source packages, developer tools, and extensions built by Roy Berris, focusing on AI coding agents, remote development, and developer ergonomics.",
  alternates: { canonical: "/projects/" },
  openGraph: {
    type: "website",
    url: "/projects/",
    siteName: SITE_NAME,
    title: `Projects & Packages · ${SITE_NAME}`,
    description:
      "Open-source packages, developer tools, and extensions built by Roy Berris.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects & Packages · ${SITE_NAME}`,
    description:
      "Open-source packages, developer tools, and extensions built by Roy Berris.",
    images: ["/og.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/projects/#collection`,
  url: absoluteUrl("/projects/"),
  name: `Projects & Packages · ${SITE_NAME}`,
  description:
    "Open-source tools, packages, and extensions built by Roy Berris.",
  inLanguage: "en",
  author: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: AUTHOR.name,
    url: AUTHOR.url,
  },
}

export default function ProjectsIndexPage() {
  const projects = getAllProjects()

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="hud-grid min-h-screen pt-14">
        <div className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
          <header className="py-8 md:py-12">
            <p className="hud-label text-cyan">// ecosystem · open source</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight neon-text md:text-5xl">
              Projects & Packages
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground text-pretty">
              Tools, VS Code extensions, and developer utilities I&apos;ve built and maintain. Designed to solve practical problems in AI-assisted workflows, remote devboxes, and software architecture.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project.slug} className="group relative flex flex-col">
                <div className="hud-panel flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neon/60 hover:shadow-[0_0_40px_-12px_var(--neon)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-9 items-center justify-center rounded-lg border border-cyan/40 bg-cyan/10 text-cyan">
                        <Box className="size-5" />
                      </div>
                      <div>
                        <span className="hud-label text-[10px] text-cyan">
                          {project.category} · v{project.version}
                        </span>
                        <h2 className="text-xl font-semibold leading-tight text-foreground group-hover:text-cyan transition-colors">
                          <Link href={`/projects/${project.slug}/`} className="focus:outline-none">
                            {project.name}
                          </Link>
                        </h2>
                      </div>
                    </div>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-border/80 bg-background/50 p-2 text-muted-foreground transition-colors hover:border-cyan hover:text-cyan"
                      aria-label={`${project.name} on GitHub`}
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-foreground/75 text-pretty">
                    {project.tagline}
                  </p>

                  <div className="mt-5 space-y-2.5 border-t border-border/60 pt-4">
                    <p className="hud-label text-[10px]">Key highlights</p>
                    <ul className="space-y-1.5 text-xs text-foreground/70">
                      {project.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan font-mono select-none">›</span>
                          <span><strong className="text-foreground/90 font-medium">{feat.title}:</strong> {feat.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="rounded-sm bg-neon/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/75">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/60">
                    <Link
                      href={`/projects/${project.slug}/`}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan hover:underline"
                    >
                      View project details
                      <ArrowUpRight className="size-3.5" />
                    </Link>

                    {project.relatedBlogSlug && (
                      <Link
                        href={`/nodes/${project.relatedBlogSlug}/`}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Read blog post →
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-16 hud-panel p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="hud-label text-cyan">// contributions & source</p>
                <h3 className="mt-1 text-xl font-semibold">Looking for more code or repos?</h3>
                <p className="mt-1 text-sm text-foreground/70">
                  All open-source experiments, personal projects, and code samples live on my GitHub profile.
                </p>
              </div>
              <a
                href="https://github.com/royberris"
                target="_blank"
                rel="noopener noreferrer"
                className="hud-chip self-start hover:border-cyan hover:text-cyan sm:self-auto"
              >
                github.com/royberris
                <ArrowUpRight className="size-3" />
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
