// Site-wide constants shared by metadata, structured data, sitemap and llms.txt

export const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "https://berris.dev").replace(/\/$/, "")
export const SITE_NAME = "Berris.dev"
export const SITE_DESCRIPTION =
  "Berris.dev is Roy Berris's knowledge base on software architecture, API design, AI agents and .NET, written from hands-on experience as a software architect."

export const AUTHOR = {
  name: "Roy Berris",
  jobTitle: "Software Architect",
  worksFor: { name: "New Orange", url: "https://neworange.agency" },
  url: `${SITE_URL}/about/`,
  image: `${SITE_URL}/author.png`,
  sameAs: [
    "https://github.com/royberris",
    "https://www.linkedin.com/in/roy-berris/",
    "https://sessionize.com/roy-berris",
    "https://www.youtube.com/channel/UCGWLWa8GcCznhLxpfC8hbWQ",
  ],
}

// Absolute URL for a site path; trailingSlash is on, so page paths end in "/"
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

// URL segment for a cluster (tag) page, e.g. "API Design" -> "api-design"
const CLUSTER_SLUG_OVERRIDES: Record<string, string> = { "C#": "csharp", ".NET": "dotnet" }

export function clusterSlug(tag: string): string {
  if (CLUSTER_SLUG_OVERRIDES[tag]) return CLUSTER_SLUG_OVERRIDES[tag]
  return tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}
