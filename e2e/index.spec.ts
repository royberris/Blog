import { expect, test, type Page } from "@playwright/test"

const cards = (page: Page) => page.locator("main article")
const resultCount = (page: Page) => page.getByText(/^\d+ results?/)

test.describe("Index", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/nodes/")
  })

  test("lists every node", async ({ page }) => {
    await expect(page).toHaveTitle(/Index/)
    await expect(page.getByRole("heading", { level: 1, name: "Index" })).toBeVisible()

    const allChip = page.getByRole("toolbar", { name: "Filter by cluster" }).getByRole("button", { name: /^All/ })
    const total = Number((await allChip.textContent())?.match(/\d+/)?.[0])
    expect(total).toBeGreaterThan(0)

    await expect(cards(page)).toHaveCount(total)
    await expect(resultCount(page)).toHaveText(`${total} results`)
  })

  test("filters by search text and keeps it in the URL", async ({ page }) => {
    const title = (await cards(page).first().getByRole("heading").textContent())!

    await page.getByRole("searchbox", { name: "Filter nodes" }).fill(title)

    await expect(cards(page)).toHaveCount(1)
    await expect(cards(page).first()).toContainText(title)
    await expect(page).toHaveURL(/[?&]q=/)
  })

  test("filters by cluster", async ({ page }) => {
    const chip = page.getByRole("toolbar", { name: "Filter by cluster" }).getByRole("button").nth(1)
    const [, cluster, count] = (await chip.textContent())!.match(/^(.*?)\s*(\d+)$/)!

    await chip.click()

    await expect(page).toHaveURL(/[?&]cluster=/)
    await expect(cards(page)).toHaveCount(Number(count))
    await expect(resultCount(page)).toContainText(`in ${cluster}`)
    for (const card of await cards(page).all()) {
      await expect(card).toContainText(cluster, { ignoreCase: true })
    }

    await chip.click()
    await expect(page).not.toHaveURL(/cluster=/)
  })

  test("sorts by length", async ({ page }) => {
    await page.getByRole("group", { name: "Sort" }).getByRole("button", { name: "Longest" }).click()
    await expect(page).toHaveURL(/[?&]sort=length/)

    const minutes = (await cards(page).getByText(/\d+ min$/).allTextContents()).map((t) => Number(t.match(/(\d+) min$/)![1]))
    expect(minutes.length).toBeGreaterThan(1)
    expect(minutes).toEqual([...minutes].sort((a, b) => b - a))
  })

  test("applies filters from a shared link", async ({ page }) => {
    await page.goto("/nodes/?q=zzz-no-such-node")
    await expect(page.getByRole("searchbox", { name: "Filter nodes" })).toHaveValue("zzz-no-such-node")
    await expect(cards(page)).toHaveCount(0)
    await expect(resultCount(page)).toHaveText("0 results")
  })

  test("opens a node", async ({ page }) => {
    const card = cards(page).first()
    const title = (await card.getByRole("heading").textContent())!

    await card.getByRole("link").click()

    await expect(page).toHaveURL(/\/nodes\/[^/?]+\/?$/)
    await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText(title)
  })
})
