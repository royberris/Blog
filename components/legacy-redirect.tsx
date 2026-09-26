import Link from "next/link"

// Static-export friendly redirect: meta refresh for crawlers/no-JS, location.replace for everyone else
export function LegacyRedirect({ to }: { to: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 pt-14">
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <script dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(to)})` }} />
      <p className="hud-label">
        Relocated → <Link href={to} className="text-cyan underline underline-offset-4">{to}</Link>
      </p>
    </main>
  )
}
