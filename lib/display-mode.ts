// Simple view: black, white and one primary colour, no map, no glow.
// Shared by the pre-paint script in the root layout and the client hook (no React here)

export type DisplayMode = "full" | "simple"

export const DISPLAY_STORAGE_KEY = "berris:display"

// Browser accessibility settings that ask for a plainer page
export const SIMPLE_DISPLAY_QUERY = "(prefers-contrast: more), (forced-colors: active)"

// Mermaid needs literal colours; keep in sync with the html[data-display="simple"] tokens in globals.css
export const SIMPLE_PALETTE = { background: "#ffffff", foreground: "#000000", primary: "#5b21b6" } as const

// Runs in <head> before first paint, so a simple-view reader never sees (or renders) the map
export const displayModeScript = `(function(){try{var s=null;try{s=localStorage.getItem(${JSON.stringify(DISPLAY_STORAGE_KEY)})}catch(e){}var m=s==="simple"||s==="full"?s:(window.matchMedia&&matchMedia(${JSON.stringify(SIMPLE_DISPLAY_QUERY)}).matches?"simple":"full");document.documentElement.setAttribute("data-display",m)}catch(e){}})()`
