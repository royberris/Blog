import fs from "fs"
import path from "path"
import matter from "gray-matter"
import tagsConfig from "@/data/tags.json"

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags?: string[]
  author?: string
  invalidTags?: string[] // For tracking invalid tags during development
}

const postsDirectory = path.join(process.cwd(), "blogs")

function validateTags(tags: string[] | undefined, fileName: string): { validTags: string[], invalidTags: string[] } {
  if (!tags || !Array.isArray(tags)) {
    return { validTags: [], invalidTags: [] }
  }

  const validTags: string[] = []
  const invalidTags: string[] = []
  const knownTags = Object.keys(tagsConfig)

  tags.forEach(tag => {
    if (knownTags.includes(tag)) {
      validTags.push(tag)
    } else {
      invalidTags.push(tag)
      console.warn(`⚠️  Invalid tag "${tag}" found in ${fileName}. Available tags: ${knownTags.join(', ')}`)
    }
  })

  return { validTags, invalidTags }
}

function getParsedPosts(): BlogPost[] {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, "");
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContents);

            // Validate tags against tags.json
            const { validTags, invalidTags } = validateTags(data.tags, fileName)

            const blogPost: BlogPost = {
                slug,
                title: data.title,
                date: data.date,
                excerpt: data.excerpt,
                content,
                tags: validTags, // Only include valid tags
                author: data.author,
            }

            // In development, include invalid tags for debugging
            if (process.env.NODE_ENV === 'development' && invalidTags.length > 0) {
              blogPost.invalidTags = invalidTags
            }

            return blogPost;
        });

    return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllBlogs(): BlogPost[] {
  return getParsedPosts()
}

export function getBlogBySlug(slug: string): BlogPost | null {
  return getParsedPosts().find((blog) => blog.slug === slug) || null
}

export function getAllBlogSlugs(): string[] {
  return getParsedPosts().map((blog) => blog.slug)
}

export function getAvailableTags(): string[] {
  return Object.keys(tagsConfig).sort()
}

export function getTagConfig(tag: string) {
  return tagsConfig[tag as keyof typeof tagsConfig] || null
}

export function validateBlogTags(): { blog: string, invalidTags: string[] }[] {
  const blogs = getParsedPosts()
  const issues: { blog: string, invalidTags: string[] }[] = []
  
  blogs.forEach(blog => {
    if (blog.invalidTags && blog.invalidTags.length > 0) {
      issues.push({
        blog: blog.slug,
        invalidTags: blog.invalidTags
      })
    }
  })
  
  return issues
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
