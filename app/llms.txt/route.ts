import { NextResponse } from 'next/server'
import { getAllNodes } from '@/lib/nodes'
import tagsConfig from '@/data/tags.json'
import { getAllAuthors } from '@/lib/authors'

// Required for static export
export const dynamic = 'force-static'

interface TagConfig {
  fullName: string
  description: string
}

function generateLlmsTxtContent(blogs: any[]): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://berris.dev"
  
  let content = `# Berris.dev - Technical Knowledge Base

Berris.dev is a mapped database of posts ("nodes") on software architecture, API design and AI, grouped into topic clusters.

## Authors
${getAllAuthors().map(a => `- **${a.name}** (${a.role}): ${a.bio}`).join('\n')}

## Expertise Areas & Related Content

`

  // Group blogs by tag and show all blogs per topic
  const tagGroups = new Map<string, any[]>()
  
  blogs.forEach(blog => {
    if (blog.tags) {
      blog.tags.forEach((tag: string) => {
        const tagConfig = (tagsConfig as Record<string, TagConfig>)[tag]
        const displayName = tagConfig?.fullName || tag
        
        if (!tagGroups.has(displayName)) {
          tagGroups.set(displayName, [])
        }
        tagGroups.get(displayName)!.push(blog)
      })
    }
  })
  
  // Sort tags alphabetically and output each with all related blogs
  Array.from(tagGroups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([tagName, relatedBlogs]) => {
      const tagConfig = Object.values(tagsConfig).find(config => config.fullName === tagName)
      
      content += `### ${tagName}\n`
      if (tagConfig) {
        content += `${tagConfig.description}\n\n`
      }
      
      content += `**Related Posts:**\n`
      relatedBlogs.forEach(blog => {
        content += `- [${blog.title}](${baseUrl}/nodes/${blog.slug}) (${blog.date})\n`
        content += `  ${blog.excerpt}\n\n`
      })
    })
  
  content += `## All Nodes (Chronological)

`
  
  blogs.forEach(blog => {
    const tagsList = blog.tags ? blog.tags.join(', ') : 'No tags'
    content += `### [${blog.title}](${baseUrl}/nodes/${blog.slug})
**Published:** ${blog.date}  
**Author:** ${blog.author || 'Unknown'}  
**Topics:** ${tagsList}  
**Summary:** ${blog.excerpt}

`
  })
  
  content += `## Content Statistics
- **Total Nodes:** ${blogs.length}
- **Topics Covered:** ${tagGroups.size}
- **Latest Post:** ${blogs[0]?.date || 'N/A'}
- **Content Focus:** Software Architecture, API Design, Development Practices

## How to Use This Content
Berris.dev focuses on practical software architecture insights, real-world implementation experiences, and team collaboration strategies. Each post includes specific examples and actionable recommendations based on the authors' professional experience.`

  return content
}

export async function GET() {
  try {
    const blogs = getAllNodes()
    
    // Generate the llms.txt content
    const llmsTxtContent = generateLlmsTxtContent(blogs)
    
    return new NextResponse(llmsTxtContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating llms.txt:', error)
    return new NextResponse('Error generating llms.txt', { status: 500 })
  }
}