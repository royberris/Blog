import devtoArticles from "@/data/devto-articles.json"

export interface DevtoArticle {
  id: number
  url: string
  mock?: boolean // Development only: the discussion shows fixture data instead of calling dev.to
}

// Written by scripts/crosspost-devto.js; only published cross-posts have an entry
const articles = devtoArticles as Record<string, DevtoArticle | undefined>

export function getDevtoArticle(slug: string, crossPosted: boolean): DevtoArticle | null {
  const article = articles[slug]
  // The url becomes an href, so only accept real dev.to article links
  if (article && Number.isInteger(article.id) && /^https:\/\/dev\.to\//.test(article.url)) return article

  // `pnpm dev` has no synced articles, so cross-posted nodes get a mock discussion
  if (process.env.NODE_ENV === "development" && crossPosted) {
    return { id: 0, url: "https://dev.to/royberris", mock: true }
  }
  return null
}
