"use client"

import type { ReactNode } from "react"
import { useDisplayMode } from "@/hooks/use-display-mode"

// Unmounts heavy visuals (the node map) in simple view, so the browser doesn't run or render them
export function FullDisplayOnly({ children }: { children: ReactNode }) {
  return useDisplayMode() === "full" ? children : null
}
