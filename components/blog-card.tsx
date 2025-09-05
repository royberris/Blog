import Link from "next/link"
import { formatDate, type BlogPost } from "@/lib/blog-data"

interface BlogCardProps {
  blog: BlogPost
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="group">
      <Link href={`/blogs/${blog.slug}`} className="block">
        <h2 className="text-2xl font-bold text-foreground group-hover:text-foreground/80 transition-colors mb-3 text-balance">
          {blog.title}
        </h2>
        <p className="text-foreground/70 leading-relaxed mb-4 text-pretty">{blog.excerpt}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={blog.date}>{formatDate(blog.date)}</time>
          {blog.tags && blog.tags.length > 0 && (
            <>
              <span>•</span>
              <span>{blog.tags.join(", ")}</span>
            </>
          )}
        </div>
      </Link>
    </article>
  )
}
