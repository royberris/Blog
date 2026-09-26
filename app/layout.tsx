import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { HudBar } from "@/components/hud-bar"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Berris.dev",
    template: "%s · Berris.dev",
  },
  description: "Berris.dev is a mapped database of notes on software architecture, API design and AI.",
}

export const viewport: Viewport = {
  themeColor: "#0d0b1a",
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <HudBar />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
