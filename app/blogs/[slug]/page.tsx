import type { Metadata } from "next"
import { getAllNodeSlugs } from "@/lib/nodes"
import { LegacyRedirect, legacyRedirectMetadata } from "@/components/legacy-redirect"
import legacyRedirects from "@/data/legacy-redirects.json"

// Old /blogs/[slug] URLs live on as static redirect stubs: every current node plus the
// historic slugs in data/legacy-redirects.json (posts from the old site, renamed slugs)

interface LegacyBlogPageProps {
  params: Promise<{ slug: string }>
}

function redirectMap(): Record<string, string> {
  const current = Object.fromEntries(getAllNodeSlugs().map((slug) => [slug, `/nodes/${slug}/`]))
  return { ...current, ...(legacyRedirects as Record<string, string>) }
}

function targetFor(slug: string): string {
  return redirectMap()[slug] ?? "/nodes/"
}

export const dynamicParams = false

export async function generateStaticParams() {
  return Object.keys(redirectMap()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: LegacyBlogPageProps): Promise<Metadata> {
  const { slug } = await params
  return legacyRedirectMetadata(targetFor(slug))
}

export default async function LegacyBlogPage({ params }: LegacyBlogPageProps) {
  const { slug } = await params
  return <LegacyRedirect to={targetFor(slug)} />
}
