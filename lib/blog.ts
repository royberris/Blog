import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags?: string[]
  author?: string
}

const blogsDirectory = path.join(process.cwd(), "blogs")

export function getAllBlogSlugs() {
  try {
    const fileNames = fs.readdirSync(blogsDirectory)
    return fileNames.filter((name) => name.endsWith(".md")).map((name) => name.replace(/\.md$/, ""))
  } catch {
    return []
  }
}

export function getBlogBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(blogsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || content.slice(0, 150) + "...",
      content,
      tags: data.tags || [],
      author: data.author || "Anonymous",
    }
  } catch {
    return null
  }
}

export function getAllBlogs(): BlogPost[] {
  const slugs = getAllBlogSlugs()
  const blogs = slugs
    .map((slug) => getBlogBySlug(slug))
    .filter((blog): blog is BlogPost => blog !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return blogs
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
