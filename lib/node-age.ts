// Client-safe helpers for the home page's "last N years" window

export const DEFAULT_WINDOW_YEARS = 2

const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000

export function isWithinYears(date: string, years: number, now: Date): boolean {
  return now.getTime() - new Date(date).getTime() <= years * YEAR_MS
}

// Smallest whole number of years that covers every node, so the slider's last step means "all time"
export function maxWindowYears(dates: string[], now: Date): number {
  const oldest = Math.min(...dates.map((d) => new Date(d).getTime()))
  return Math.max(DEFAULT_WINDOW_YEARS, Math.ceil((now.getTime() - oldest) / YEAR_MS))
}
