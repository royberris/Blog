import { defineConfig, devices } from "@playwright/test"

const PORT = 4173

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // The site is a static export, so test the built output the way GitHub Pages serves it
  webServer: {
    command: `pnpm exec serve out --listen ${PORT} --no-clipboard`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
})
