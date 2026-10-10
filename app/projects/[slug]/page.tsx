import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Box, CheckCircle2, ChevronRight, Download, ExternalLink, FileCode, GitFork, Laptop, Server, Settings, ShieldCheck, Terminal } from "lucide-react"
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/projects"
import { JsonLd } from "@/components/json-ld"
import { CodeBlock } from "@/components/code-block"
import { AUTHOR, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site"

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return { title: "Project not found", robots: { index: false } }
  }

  const url = `/projects/${slug}/`

  return {
    title: `${project.name} · ${project.category}`,
    description: project.tagline,
    keywords: [project.name, project.category, ...project.techStack],
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      title: `${project.name} - ${project.tagline}`,
      description: project.description,
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} · ${SITE_NAME}`,
      description: project.tagline,
      images: ["/og.png"],
    },
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const pageUrl = absoluteUrl(`/projects/${slug}/`)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#software`,
        name: project.name,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Linux, macOS, Windows",
        description: project.description,
        url: pageUrl,
        downloadUrl: `${project.githubUrl}/releases`,
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
        softwareVersion: project.version,
        license: project.license,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Projects", item: absoluteUrl("/projects/") },
          { "@type": "ListItem", position: 3, name: project.name, item: pageUrl },
        ],
      },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="min-h-screen pt-14">
        <header className="hud-grid border-b border-border/60">
          <div className="mx-auto max-w-4xl px-4 pb-10 pt-8 md:px-8 md:pb-14 md:pt-12">
            <Link href="/projects/" className="hud-label inline-flex items-center gap-2 hover:text-foreground">
              <ArrowLeft className="size-3.5" />
              Back to projects catalog
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="hud-label normal-case text-cyan">{project.category}</span>
              <span className="hud-label">·</span>
              <span className="hud-label">v{project.version}</span>
              <span className="hud-label">·</span>
              <span className="hud-label">{project.license} License</span>
              <span className="hud-label">·</span>
              <span className="hud-label text-foreground/80">by {AUTHOR.name}</span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-balance neon-text md:text-5xl">
              {project.name}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-foreground/80 text-pretty">
              {project.tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hud-chip bg-cyan/15 text-cyan border-cyan/40 hover:bg-cyan/25"
              >
                GitHub Repository
                <ExternalLink className="size-3" />
              </a>

              <a
                href={`${project.githubUrl}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className="hud-chip hover:border-cyan hover:text-cyan"
              >
                Releases & VSIX
                <Download className="size-3" />
              </a>

              {project.relatedBlogSlug && (
                <Link
                  href={`/nodes/${project.relatedBlogSlug}/`}
                  className="hud-chip hover:border-neon hover:text-neon"
                >
                  Read Architecture Post
                  <ChevronRight className="size-3" />
                </Link>
              )}
            </div>
          </div>
        </header>

        <article className="mx-auto max-w-4xl space-y-12 px-4 py-10 md:px-8 md:py-14 leading-relaxed text-foreground/85">
          {/* Overview */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Overview & Architecture
            </h2>
            <p className="text-foreground/80 leading-relaxed text-pretty text-base md:text-lg">
              {project.description}
            </p>

            {project.relatedBlogSlug && (
              <div className="hud-panel p-5 mt-6 border-l-4 border-l-cyan">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="hud-label text-cyan">// deep-dive blog post</span>
                    <h3 className="text-base font-semibold text-foreground mt-0.5">
                      {project.relatedBlogTitle ?? "Managing AI Agents on a Remote Devbox"}
                    </h3>
                    <p className="text-xs text-foreground/70 mt-1">
                      Read about the design decisions, trade-offs, and daily workflow that inspired this extension.
                    </p>
                  </div>
                  <Link
                    href={`/nodes/${project.relatedBlogSlug}/`}
                    className="hud-chip shrink-0 text-cyan border-cyan/40 hover:bg-cyan/10"
                  >
                    Read article
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* Key Features */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              What it does
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.features.map((feature, idx) => (
                <div key={idx} className="hud-panel p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-cyan shrink-0" />
                    <h3 className="font-semibold text-foreground text-sm">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/75 text-pretty">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Requirements & Installation */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Prerequisites & Environment
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="hud-panel p-5 space-y-3">
                <div className="flex items-center gap-2 text-cyan">
                  <Laptop className="size-4" />
                  <h3 className="hud-label text-cyan">On your laptop</h3>
                </div>
                <ul className="space-y-2 text-sm text-foreground/80">
                  {project.requirements.laptop.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-cyan font-mono text-xs">✔</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hud-panel p-5 space-y-3">
                <div className="flex items-center gap-2 text-cyan">
                  <Server className="size-4" />
                  <h3 className="hud-label text-cyan">On the remote server</h3>
                </div>
                <ul className="space-y-2 text-sm text-foreground/80">
                  {project.requirements.server.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-cyan font-mono text-xs">✔</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Quick Setup instructions */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Quick start
            </h2>
            <ol className="space-y-3 text-sm leading-relaxed">
              {project.quickStart.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10 font-mono text-xs font-semibold text-cyan">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 text-foreground/85">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6">
              <p className="hud-label text-cyan mb-2">// server CLI installation snippet</p>
              <CodeBlock language="bash">
{`# Install tmux and git
sudo apt update && sudo apt install -y tmux git

# Claude Code
curl -fsSL https://claude.ai/install.sh | bash
claude # log in once

# Codex
npm install -g @openai/codex
codex login

# Antigravity CLI
curl -fsSL https://antigravity.google/cli/install.sh | bash
agy # log in once`}
              </CodeBlock>
            </div>
          </section>

          {/* Key Settings Table */}
          {project.settings.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Configuration settings
              </h2>
              <p className="text-sm text-foreground/75">
                All settings use machine scope (saved per remote connection in VS Code Remote Settings):
              </p>
              <div className="overflow-x-auto rounded-lg border border-border/70 bg-card/60">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-border/80 bg-muted/40 text-muted-foreground uppercase">
                    <tr>
                      <th className="p-3">Setting</th>
                      <th className="p-3">Default</th>
                      <th className="p-3 font-sans normal-case">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-foreground/80">
                    {project.settings.map((s) => (
                      <tr key={s.name} className="hover:bg-muted/20">
                        <td className="p-3 text-cyan font-semibold">{s.name}</td>
                        <td className="p-3 text-muted-foreground">{s.default}</td>
                        <td className="p-3 font-sans text-foreground/70">{s.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Links and Actions */}
          <section className="hud-panel p-6 sm:p-8 space-y-4">
            <h2 className="hud-label text-foreground">// repository resources</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hud-chip hover:border-cyan hover:text-cyan"
              >
                GitHub Source
                <ExternalLink className="size-3" />
              </a>
              <a
                href={`${project.githubUrl}/blob/main/README.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="hud-chip hover:border-cyan hover:text-cyan"
              >
                Full README Documentation
                <FileCode className="size-3" />
              </a>
              <a
                href={`${project.githubUrl}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className="hud-chip hover:border-cyan hover:text-cyan"
              >
                Download .VSIX
                <Download className="size-3" />
              </a>
            </div>
          </section>
        </article>
      </main>
    </>
  )
}
