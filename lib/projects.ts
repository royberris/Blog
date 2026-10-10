import projectsData from "@/data/projects.json"

export interface ProjectFeature {
  title: string
  description: string
}

export interface ProjectSetting {
  name: string
  default: string
  description: string
}

export interface ProjectRequirements {
  laptop: string[]
  server: string[]
}

export interface ProjectItem {
  slug: string
  name: string
  repo: string
  githubUrl: string
  tagline: string
  category: string
  status: string
  version: string
  license: string
  language: string
  stars: number
  highlight: boolean
  relatedBlogSlug?: string
  relatedBlogTitle?: string
  description: string
  features: ProjectFeature[]
  techStack: string[]
  requirements: ProjectRequirements
  quickStart: string[]
  settings: ProjectSetting[]
}

export function getAllProjects(): ProjectItem[] {
  return projectsData as ProjectItem[]
}

export function getProjectBySlug(slug: string): ProjectItem | null {
  return (projectsData as ProjectItem[]).find((p) => p.slug === slug) ?? null
}

export function getAllProjectSlugs(): string[] {
  return (projectsData as ProjectItem[]).map((p) => p.slug)
}
