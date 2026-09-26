import type { MetadataRoute } from "next"
import { SITE_URL, absoluteUrl } from "@/lib/site"

export const dynamic = "force-static"

// Search and AI crawlers are welcome; named explicitly so a future blanket rule can't shut them out
const AI_AND_SEARCH_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  }
}
