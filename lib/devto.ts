import devtoArticles from "@/data/devto-articles.json"

export interface DevtoArticle {
  id: number
  url: string
}

// Written by scripts/crosspost-devto.js; only published cross-posts have an entry
const articles = devtoArticles as Record<string, DevtoArticle | undefined>

export function getDevtoArticle(slug: string): DevtoArticle | null {
  const article = articles[slug]
  // The url becomes an href, so only accept real dev.to article links
  if (!article || !Number.isInteger(article.id) || !/^https:\/\/dev\.to\//.test(article.url)) return null
  return article
}
