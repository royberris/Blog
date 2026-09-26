import Link from "next/link"
import { absoluteUrl } from "@/lib/site"

// Static-export friendly redirect: meta refresh for crawlers/no-JS, location.replace for everyone else.
// The canonical <link> goes in the page metadata (legacyRedirectMetadata) so it lands in <head>.
export function LegacyRedirect({ to }: { to: string }) {
  const target = withTrailingSlash(to)
  const url = absoluteUrl(target)
  return (
    <main className="flex min-h-screen items-center justify-center px-4 pt-14">
      <meta httpEquiv="refresh" content={`0;url=${url}`} />
      <script dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(url)})` }} />
      <p className="hud-label">
        Relocated → <Link href={target} className="text-cyan underline underline-offset-4">{target}</Link>
      </p>
    </main>
  )
}

export function legacyRedirectMetadata(to: string) {
  return {
    title: "Moved",
    robots: { index: false, follow: true },
    alternates: { canonical: absoluteUrl(withTrailingSlash(to)) },
  }
}

function withTrailingSlash(path: string): string {
  const [pathname, rest = ""] = path.split(/(?=[?#])/)
  return `${pathname.endsWith("/") ? pathname : `${pathname}/`}${rest}`
}
