import { Header } from "@/components/header"
import { BlogCard } from "@/components/blog-card"
import { AuthorSection } from "@/components/author-section"
import { getAllBlogs } from "@/lib/blog-data"
import Link from "next/link"

export default function BlogsPage() {
  const blogs = getAllBlogs()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12 md:px-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground">{blogs.length} blogs</p>
        </div>

        <div className="space-y-12">
          {blogs.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      </main>

      <AuthorSection />
    </div>
  )
}
