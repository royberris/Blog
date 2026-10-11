import { expect, test, type Page } from "@playwright/test"

const NODE_WITH_EXTRAS = "/nodes/designing-apis-for-ai-agents/" // has code blocks and a mermaid diagram

const LIGHT = { background: [255, 255, 255], foreground: [0, 0, 0], primary: [0x5b, 0x21, 0xb6] }

const toggle = (page: Page) => page.getByRole("button", { name: "Simple view" })
const display = (page: Page) => page.locator("html")
const mapRegion = (page: Page) => page.getByRole("region", { name: "Node map" })
// The interactive map nodes are SVG groups labelled "Node …" / "Cluster …"
const mapNodes = (page: Page) => page.locator("svg g[role=button]")

async function expectSimple(page: Page) {
  await expect(display(page)).toHaveAttribute("data-display", "simple")
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "true")
}

async function expectFull(page: Page) {
  await expect(display(page)).toHaveAttribute("data-display", "full")
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "false")
}

// Every painted colour on the page, normalised to rgba through a canvas so oklch/color-mix values compare too
async function paintedColours(page: Page) {
  return page.evaluate(() => {
    const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!
    const rgba = (css: string) => {
      ctx.clearRect(0, 0, 1, 1)
      ctx.fillStyle = "#010203"
      ctx.fillStyle = css
      if (ctx.fillStyle === "#010203" && css !== "#010203") return null
      ctx.fillRect(0, 0, 1, 1)
      return Array.from(ctx.getImageData(0, 0, 1, 1).data)
    }
    const found: { colour: number[]; prop: string; where: string }[] = []
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) continue
      const style = getComputedStyle(el)
      if (style.visibility === "hidden" || style.opacity === "0") continue
      const props = ["color", "background-color"]
      for (const side of ["top", "right", "bottom", "left"]) {
        if (parseFloat(style.getPropertyValue(`border-${side}-width`)) > 0) props.push(`border-${side}-color`)
      }
      if (el instanceof SVGElement) props.push("fill", "stroke")
      for (const prop of props) {
        const value = style.getPropertyValue(prop)
        if (!value || value === "none" || value.startsWith("url(")) continue
        const colour = rgba(value)
        // Near-invisible tints don't read as a colour of their own
        if (colour && colour[3] > 40) found.push({ colour, prop, where: `${el.tagName.toLowerCase()}.${String(el.getAttribute("class") ?? "").slice(0, 60)}` })
      }
      if (style.backgroundImage !== "none" && !style.backgroundImage.startsWith("url(")) {
        found.push({ colour: [-1, -1, -1, 255], prop: `background-image: ${style.backgroundImage.slice(0, 60)}`, where: el.tagName.toLowerCase() })
      }
    }
    return found
  })
}

async function expectOnlyPalette(page: Page, palette: typeof LIGHT) {
  const allowed = Object.values(palette)
  const close = (a: number[], b: number[]) => a.every((v, i) => Math.abs(v - b[i]) <= 8)
  const offPalette = (await paintedColours(page)).filter(({ colour }) => !allowed.some((c) => close(colour.slice(0, 3), c)))
  expect(offPalette, "only black, white and the primary colour are painted").toEqual([])
}

async function expectNoEffects(page: Page) {
  const effects = await page.evaluate(() =>
    Array.from(document.querySelectorAll("*"))
      .map((el) => getComputedStyle(el))
      .filter((s) => s.boxShadow !== "none" || s.textShadow !== "none" || (s.backdropFilter && s.backdropFilter !== "none") || s.animationName !== "none")
      .length,
  )
  expect(effects, "no glow, blur or animation").toBe(0)
  const diagramShadows = await page.locator(".mermaid-host svg *").evaluateAll((els) => els.filter((el) => getComputedStyle(el).filter !== "none").length)
  expect(diagramShadows, "no drop shadows in diagrams").toBe(0)
  const ambient = await page.evaluate(() => getComputedStyle(document.body, "::before").display)
  expect(ambient).toBe("none")
}

test.describe("Full view (default)", () => {
  test("shows the futuristic map with its nodes", async ({ page }) => {
    await page.goto("/")

    await expectFull(page)
    await expect(mapRegion(page)).toBeVisible()
    await expect(mapNodes(page).first()).toBeAttached()
    expect(await mapNodes(page).count()).toBeGreaterThan(1)
  })

  test("shows the connected-nodes graph on a node page", async ({ page }) => {
    await page.goto(NODE_WITH_EXTRAS)

    await expectFull(page)
    await expect(page.locator("section[aria-labelledby=connected-heading] svg g[role=button]").first()).toBeAttached()
    await expect(page.getByRole("list", { name: "Connected nodes" })).toBeHidden()
  })
})

test.describe("Browser accessibility settings", () => {
  test.describe("prefers-contrast: more", () => {
    test.use({ contrast: "more" })

    test("switches to the simple view without the map", async ({ page }) => {
      await page.goto("/")

      await expectSimple(page)
      await expect(mapRegion(page)).toBeHidden()
      await expect(mapNodes(page)).toHaveCount(0)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      await expect(page.locator("#latest article").first()).toBeVisible()
      await expect(page.locator("#latest article").first()).toBeInViewport()
    })

    test("applies before first paint, so the map never shows", async ({ page }) => {
      // Without JavaScript only the pre-paint script could have run; here nothing hydrates at all
      await page.route(/\/_next\/static\/.*\.js(\?|$)/, (route) => route.abort())
      await page.goto("/")

      await expect(display(page)).toHaveAttribute("data-display", "simple")
      await expect(mapRegion(page)).toBeHidden()
    })

    test("uses only black, white and one primary colour", async ({ page }) => {
      for (const path of ["/", "/nodes/", NODE_WITH_EXTRAS, "/about/"]) {
        await page.goto(path)
        await expectSimple(page)
        if (path === NODE_WITH_EXTRAS) await expect(page.locator(".hud-panel svg[id^=mermaid]")).toBeVisible()
        await expectOnlyPalette(page, LIGHT)
        await expectNoEffects(page)
      }
    })

    test("stays black on white even when the browser prefers dark", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "dark" })
      await page.goto(NODE_WITH_EXTRAS)

      await expectSimple(page)
      await expect(page.locator(".hud-panel svg[id^=mermaid]")).toBeVisible()
      await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)")
      await expectOnlyPalette(page, LIGHT)
    })

    test("shows connections as a list on a node page", async ({ page }) => {
      await page.goto(NODE_WITH_EXTRAS)

      await expectSimple(page)
      await expect(page.locator("section[aria-labelledby=connected-heading] svg g[role=button]")).toHaveCount(0)
      const list = page.getByRole("list", { name: "Connected nodes" })
      await expect(list).toBeVisible()

      const link = list.getByRole("link").filter({ hasNotText: /^Cluster:/ }).first()
      const title = (await link.textContent())!
      await link.click()
      await expect(page).toHaveURL(/\/nodes\/[^/]+\/$/)
      await expect(page.getByRole("heading", { level: 1 }).first()).toContainText(title.replace(/…$/, ""))
    })

    test("the toggle can switch back to the full view, and that sticks", async ({ page }) => {
      await page.goto("/")
      await expectSimple(page)

      await toggle(page).click()
      await expectFull(page)
      await expect(mapRegion(page)).toBeVisible()
      await expect(mapNodes(page).first()).toBeAttached()

      await page.reload()
      await expectFull(page)
      await expect(mapRegion(page)).toBeVisible()
    })
  })

  test.describe("forced-colors: active", () => {
    test.use({ forcedColors: "active" })

    test("switches to the simple view without the map", async ({ page }) => {
      await page.goto("/")

      await expectSimple(page)
      await expect(mapRegion(page)).toBeHidden()
      await expect(mapNodes(page)).toHaveCount(0)
    })
  })

  test("follows the setting live while the page is open", async ({ page }) => {
    await page.goto("/")
    await expectFull(page)

    await page.emulateMedia({ contrast: "more" })
    await expectSimple(page)
    await expect(mapRegion(page)).toBeHidden()

    await page.emulateMedia({ contrast: "no-preference" })
    await expectFull(page)
    await expect(mapRegion(page)).toBeVisible()
  })
})

test.describe("Manual toggle", () => {
  test("sits in the top right corner of the header", async ({ page }) => {
    await page.goto("/")
    const box = (await toggle(page).boundingBox())!
    const viewport = page.viewportSize()!

    expect(box.y).toBeLessThan(56)
    expect(viewport.width - (box.x + box.width)).toBeLessThan(40)
  })

  test("turns the map off and on", async ({ page }) => {
    await page.goto("/")
    await expectFull(page)

    await toggle(page).click()
    await expectSimple(page)
    await expect(mapRegion(page)).toBeHidden()
    await expect(mapNodes(page)).toHaveCount(0)
    await expect(page.locator("#latest article").first()).toBeInViewport()
    await expectOnlyPalette(page, LIGHT)
    await expectNoEffects(page)

    await toggle(page).click()
    await expectFull(page)
    await expect(mapRegion(page)).toBeVisible()
    await expect(mapNodes(page).first()).toBeAttached()
  })

  test("is remembered across reloads and pages", async ({ page }) => {
    await page.goto("/")
    await toggle(page).click()
    await expectSimple(page)

    await page.reload()
    await expectSimple(page)
    await expect(mapRegion(page)).toBeHidden()

    await page.getByRole("navigation", { name: "View" }).getByRole("link", { name: "Index" }).click()
    await expect(page).toHaveURL(/\/nodes\/$/)
    await expectSimple(page)

    await page.goto(NODE_WITH_EXTRAS)
    await expectSimple(page)
    await expect(page.getByRole("list", { name: "Connected nodes" })).toBeVisible()
  })

  test("keeps the header and index filter bar opaque, so content never shows through", async ({ page }) => {
    await page.goto("/nodes/")
    await toggle(page).click()

    await expect(page.locator("body > header")).toHaveCSS("background-color", "rgb(255, 255, 255)")
    await expect(page.locator("main .sticky").first()).toHaveCSS("background-color", "rgb(255, 255, 255)")
  })

  test("is keyboard operable", async ({ page }) => {
    await page.goto("/nodes/")
    await toggle(page).focus()
    await page.keyboard.press("Enter")
    await expectSimple(page)
    await page.keyboard.press("Space")
    await expectFull(page)
  })

  test("keeps search reachable on the home page without the map", async ({ page }) => {
    await page.goto("/")
    await toggle(page).click()

    const title = (await page.locator("#latest article").first().getByRole("heading").textContent())!
    await page.getByRole("button", { name: "Search nodes" }).click()
    const dialog = page.getByRole("dialog", { name: "Search nodes" })
    await dialog.getByPlaceholder("Query the database…").fill(title)
    await dialog.getByRole("option", { name: title }).first().click()

    await expect(page).toHaveURL(/\/nodes\/[^/]+\/$/)
    await expectSimple(page)
  })
})

// Crawlers get the static HTML: simple view must not change what they index
test.describe("SEO is unaffected", () => {
  for (const [path, canonical] of [
    ["/", "/"],
    ["/nodes/", "/nodes/"],
    [NODE_WITH_EXTRAS, NODE_WITH_EXTRAS],
  ] as const) {
    test(`static HTML of ${path} is the full, indexable page`, async ({ request }) => {
      const html = await (await request.get(path)).text()

      expect(html).not.toMatch(/<html[^>]*data-display=/) // the mode is set client-side only
      expect(html).toMatch(/<title>[^<]+<\/title>/)
      expect(html).toMatch(/<meta name="description" content="[^"]+"/)
      const href = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
      expect(href).toMatch(/^https:\/\//)
      expect(new URL(href!).pathname).toBe(canonical)
      expect(html).not.toMatch(/<meta name="robots" content="[^"]*noindex/)
      expect(html).toContain('application/ld+json')
      expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
      if (path === "/") expect(html).toContain('aria-label="Node map"')
    })
  }

  test("simple view keeps the same title, h1 and structured data", async ({ page, browser }) => {
    await page.goto(NODE_WITH_EXTRAS)
    const full = {
      title: await page.title(),
      h1: await page.getByRole("heading", { level: 1 }).first().textContent(),
      jsonLd: await page.locator('script[type="application/ld+json"]').count(),
    }

    const context = await browser.newContext({ contrast: "more" })
    const simplePage = await context.newPage()
    await simplePage.goto(new URL(NODE_WITH_EXTRAS, page.url()).toString())
    await expectSimple(simplePage)
    expect(await simplePage.title()).toBe(full.title)
    await expect(simplePage.getByRole("heading", { level: 1 }).first()).toHaveText(full.h1!)
    await expect(simplePage.locator('script[type="application/ld+json"]')).toHaveCount(full.jsonLd)
    await context.close()
  })
})
