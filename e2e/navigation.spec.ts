import { expect, test } from "@playwright/test"

test.describe("Home", () => {
  test("shows the map and the latest nodes", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("region", { name: "Node map" })).toBeVisible()
    await expect(page.getByRole("heading", { level: 1 })).toContainText("software architecture")
    await expect(page.locator("#latest article").first()).toBeVisible()
  })

  test("opens a node from the latest list", async ({ page }) => {
    await page.goto("/")
    const link = page.locator("#latest article").first().getByRole("link")
    const title = (await link.textContent())!

    await link.click()

    await expect(page).toHaveURL(/\/nodes\/[^/]+\/$/)
    await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText(title)
  })

  test("links through to the full index", async ({ page }) => {
    await page.goto("/")
    await page.locator("#latest").getByRole("link", { name: /in the index/ }).click()

    await expect(page).toHaveURL(/\/nodes\/$/)
    await expect(page.getByRole("heading", { level: 1, name: "Index" })).toBeVisible()
  })
})

test.describe("Header navigation", () => {
  for (const [label, path, heading] of [
    ["Index", "/nodes/", "Index"],
    ["Projects", "/projects/", /Projects/],
    ["About", "/about/", /./],
  ] as const) {
    test(`goes to ${label}`, async ({ page }) => {
      await page.goto("/")
      const nav = page.getByRole("navigation", { name: "View" })

      await nav.getByRole("link", { name: label }).click()

      await expect(page).toHaveURL(new RegExp(`${path}$`))
      await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page")
      await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText(heading)
    })
  }
})

test.describe("Search palette", () => {
  test("finds a node and opens it", async ({ page }) => {
    await page.goto("/nodes/")
    const title = (await page.locator("main article").first().getByRole("heading").textContent())!

    await page.getByRole("button", { name: "Search nodes" }).click()
    const dialog = page.getByRole("dialog", { name: "Search nodes" })
    await dialog.getByPlaceholder("Query the database…").fill(title)
    await dialog.getByRole("option", { name: title }).first().click()

    await expect(page).toHaveURL(/\/nodes\/[^/]+\/$/)
    await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText(title)
  })
})

test.describe("Node page", () => {
  test("renders the article", async ({ page }) => {
    await page.goto("/nodes/designing-apis-for-ai-agents/")

    await expect(page).toHaveTitle(/Designing APIs for AI Agents/)
    await expect(page.getByRole("heading", { level: 1 }).first()).toContainText("Designing APIs for AI Agents")
    await expect(page.locator("article").first()).toContainText("TL;DR")
  })

  test("unknown pages show the 404", async ({ page }) => {
    const response = await page.goto("/nodes/does-not-exist/")
    expect(response?.status()).toBe(404)
  })
})
