import fs from "fs"
import path from "path"
import { ImageResponse } from "next/og"
import { AUTHOR, SITE_NAME } from "@/lib/site"

export const OG_SIZE = { width: 1200, height: 630 }

const fontDir = path.join(process.cwd(), "node_modules/geist/dist/fonts")
const font = (file: string) => fs.readFileSync(path.join(fontDir, file))

interface OgCardProps {
  eyebrow: string
  title: string
  subtitle?: string
  tags?: string[]
}

// Shared 1200x630 social card in the HUD style, rendered to PNG at build time
export function renderOgCard({ eyebrow, title, subtitle, tags = [] }: OgCardProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0d0b1a",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(139,92,246,0.35), transparent 45%), radial-gradient(circle at 10% 100%, rgba(103,232,249,0.18), transparent 40%)",
          color: "#f1f0f7",
          fontFamily: "Geist",
          border: "2px solid rgba(139,92,246,0.45)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 28,
                height: 28,
                border: "3px solid #8b5cf6",
                borderRadius: 6,
                transform: "rotate(45deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 8, background: "#67e8f9" }} />
            </div>
            <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>{SITE_NAME}</span>
          </div>
          <span style={{ fontFamily: "Geist Mono", fontSize: 24, color: "#67e8f9" }}>{eyebrow}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: title.length > 70 ? 56 : 68,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              textShadow: "0 0 32px rgba(139,92,246,0.6)",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 28, lineHeight: 1.4, color: "rgba(241,240,247,0.7)" }}>
              {subtitle.length > 150 ? `${subtitle.slice(0, 147)}...` : subtitle}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 26, color: "rgba(241,240,247,0.85)" }}>
            {`${AUTHOR.name} · ${AUTHOR.jobTitle}`}
          </span>
          <div style={{ display: "flex", gap: 12 }}>
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "Geist Mono",
                  fontSize: 20,
                  padding: "6px 14px",
                  border: "1px solid rgba(103,232,249,0.5)",
                  borderRadius: 999,
                  color: "#67e8f9",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: font("geist-sans/Geist-Regular.ttf"), weight: 400, style: "normal" },
        { name: "Geist", data: font("geist-sans/Geist-SemiBold.ttf"), weight: 600, style: "normal" },
        { name: "Geist Mono", data: font("geist-mono/GeistMono-Regular.ttf"), weight: 400, style: "normal" },
      ],
    },
  )
}
