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

const postsDirectory = path.join(process.cwd(), "blogs")

function getParsedPosts(): BlogPost[] {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, "");
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContents);

            return {
                slug,
                title: data.title,
                date: data.date,
                excerpt: data.excerpt,
                content,
                tags: data.tags,
                author: data.author,
            };
        });

    return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

let blogPosts: BlogPost[];

function getPosts(): BlogPost[] {
    if(!blogPosts) {
        blogPosts = getParsedPosts();
    }
    return blogPosts;
}


export function getAllBlogs(): BlogPost[] {
  return getPosts()
}

export function getBlogBySlug(slug: string): BlogPost | null {
  return getPosts().find((blog) => blog.slug === slug) || null
}

export function getAllBlogSlugs(): string[] {
  return getPosts().map((blog) => blog.slug)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
