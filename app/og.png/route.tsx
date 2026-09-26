import { renderOgCard } from "@/components/og-card"
import { SITE_DESCRIPTION } from "@/lib/site"

export const dynamic = "force-static"

export function GET() {
  return renderOgCard({
    eyebrow: "// knowledge map",
    title: "Notes on software architecture, API design and AI agents",
    subtitle: SITE_DESCRIPTION,
  })
}
