import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { HudBar } from "@/components/hud-bar"
import { JsonLd } from "@/components/json-ld"
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · Roy Berris on software architecture, API design and AI`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
  creator: AUTHOR.name,
  publisher: AUTHOR.name,
  // No site-wide canonical: it would be inherited by every page that forgets its own
  alternates: {
    types: {
      "text/plain": [{ url: "/llms.txt", title: "LLM-friendly site index" }],
      "application/rss+xml": [{ url: "/rss.xml", title: "Berris.dev RSS" }],
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#0d0b1a",
  viewportFit: "cover",
}

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      author: { "@id": `${SITE_URL}/#person` },
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: AUTHOR.name,
      url: AUTHOR.url,
      image: AUTHOR.image,
      jobTitle: AUTHOR.jobTitle,
      worksFor: { "@type": "Organization", name: AUTHOR.worksFor.name, url: AUTHOR.worksFor.url },
      sameAs: AUTHOR.sameAs,
      knowsAbout: ["Software architecture", "API design", "AI agents", ".NET", "Umbraco"],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <JsonLd data={siteJsonLd} />
        <HudBar />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
