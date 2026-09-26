"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-14 z-40 h-0.5 bg-transparent" aria-hidden>
      <div
        className="h-full origin-left bg-gradient-to-r from-neon to-cyan shadow-[0_0_10px_var(--cyan)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
