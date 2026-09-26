import { getAllNodeSlugs } from "@/lib/nodes"
import { LegacyRedirect } from "@/components/legacy-redirect"

// Old /blogs/[slug] URLs live on as static redirects to /nodes/[slug]

interface LegacyBlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllNodeSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: LegacyBlogPageProps) {
  const { slug } = await params
  return {
    title: "Moved",
    robots: { index: false },
    alternates: { canonical: `/nodes/${slug}` },
  }
}

export default async function LegacyBlogPage({ params }: LegacyBlogPageProps) {
  const { slug } = await params
  return <LegacyRedirect to={`/nodes/${slug}`} />
}
