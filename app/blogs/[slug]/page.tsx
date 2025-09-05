import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getBlogBySlug, getAllBlogSlugs, formatDate } from "@/lib/blog-data"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { AuthorSection } from "@/components/author-section"
import { Header } from "@/components/header"

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const blog = getBlogBySlug(slug)

  if (!blog) {
    return {
      title: "Blog Not Found",
    }
  }

  return {
    title: `${blog.title} - Blog`,
    description: blog.excerpt,
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const blog = getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title={blog.title} subtitle={`Published on ${formatDate(blog.date)}`} />

      <main className="max-w-4xl mx-auto px-6 py-12 md:px-12">
        <div className="mb-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blogs
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-muted-foreground">
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex gap-2">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="bg-muted px-2 py-1 rounded-md text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <MarkdownRenderer content={blog.content} />
        </article>

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all blogs
          </Link>
        </div>
      </main>

      <AuthorSection />
    </div>
  )
}
