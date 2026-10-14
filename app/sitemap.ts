import type { MetadataRoute } from "next"
import { getNodeSummaries } from "@/lib/nodes"
import { getAllProjects } from "@/lib/projects"
import { absoluteUrl, clusterSlug } from "@/lib/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const nodes = getNodeSummaries()
  const lastModified = (node: { date: string; updated: string | null }) => new Date(node.updated ?? node.date)
  const latest = nodes.reduce<Date | undefined>((max, n) => (!max || lastModified(n) > max ? lastModified(n) : max), undefined)

  // Each cluster is as fresh as its most recently changed node
  const clusters = new Map<string, Date>()
  nodes.forEach((node) => {
    node.tags.forEach((tag) => {
      const slug = clusterSlug(tag)
      const current = clusters.get(slug)
      if (!current || lastModified(node) > current) clusters.set(slug, lastModified(node))
    })
  })

  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/nodes/"), lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/projects/"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/about/"), changeFrequency: "monthly", priority: 0.6 },
    ...nodes.map((node) => ({
      url: absoluteUrl(`/nodes/${node.slug}/`),
      lastModified: lastModified(node),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getAllProjects().map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}/`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...Array.from(clusters, ([slug, date]) => ({
      url: absoluteUrl(`/clusters/${slug}/`),
      lastModified: date,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ]
}
