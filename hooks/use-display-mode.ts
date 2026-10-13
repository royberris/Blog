"use client"

import { useSyncExternalStore } from "react"
import { DISPLAY_STORAGE_KEY, SIMPLE_DISPLAY_QUERY, type DisplayMode } from "@/lib/display-mode"

const readStored = (): DisplayMode | null => {
  try {
    const value = localStorage.getItem(DISPLAY_STORAGE_KEY)
    return value === "simple" || value === "full" ? value : null
  } catch {
    return null
  }
}

const systemMode = (): DisplayMode => (window.matchMedia(SIMPLE_DISPLAY_QUERY).matches ? "simple" : "full")

const apply = (mode: DisplayMode) => document.documentElement.setAttribute("data-display", mode)

// The data-display attribute on <html> is the single source of truth; the pre-paint script sets it first
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-display"] })

  // Follow the browser setting live, unless the reader picked a mode themselves
  const mq = window.matchMedia(SIMPLE_DISPLAY_QUERY)
  const onSystemChange = () => {
    if (!readStored()) apply(systemMode())
  }
  mq.addEventListener("change", onSystemChange)

  // Keep other open tabs in step
  const onStorage = (e: StorageEvent) => {
    if (e.key === DISPLAY_STORAGE_KEY) apply(readStored() ?? systemMode())
  }
  window.addEventListener("storage", onStorage)

  return () => {
    observer.disconnect()
    mq.removeEventListener("change", onSystemChange)
    window.removeEventListener("storage", onStorage)
  }
}

const getSnapshot = (): DisplayMode => (document.documentElement.getAttribute("data-display") === "simple" ? "simple" : "full")

// The static HTML is the full view; CSS hides the map before paint and hydration then drops it
const getServerSnapshot = (): DisplayMode => "full"

export function useDisplayMode(): DisplayMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function setDisplayMode(mode: DisplayMode) {
  try {
    // Picking what the browser already asks for goes back to following the browser
    if (mode === systemMode()) localStorage.removeItem(DISPLAY_STORAGE_KEY)
    else localStorage.setItem(DISPLAY_STORAGE_KEY, mode)
  } catch {
    // Storage blocked: the choice still applies to this page
  }
  apply(mode)
}
