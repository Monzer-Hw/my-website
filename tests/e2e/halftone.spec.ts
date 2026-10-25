import { expect, test, type Page } from "@playwright/test";

// The hero background is the WebGL dot sphere, or the 2D halftone ring where WebGL is missing.
const bg = (page: Page) => page.locator("section[aria-labelledby='name'] [data-hero-bg]");

test.describe("hero background", () => {
  test("renders the dot sphere and keeps animating while the hero is visible", async ({ page }) => {
    await page.goto("/");
    await expect(bg(page)).toHaveAttribute("data-hero-bg", "sphere");
    await expect(bg(page)).toHaveAttribute("data-state", "running");
    await expect(bg(page)).toHaveAttribute("data-frames", /\d+/, { timeout: 10_000 });
    const first = Number(await bg(page).getAttribute("data-frames"));
    await expect.poll(async () => Number(await bg(page).getAttribute("data-frames"))).toBeGreaterThan(first);
  });

  test("stays still for visitors who prefer reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(bg(page)).toHaveAttribute("data-state", "static");
  });

  test("pauses when the hero is scrolled out of view, resumes when back", async ({ page }) => {
    await page.goto("/");
    await expect(bg(page)).toHaveAttribute("data-state", "running");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(bg(page)).toHaveAttribute("data-state", "paused");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(bg(page)).toHaveAttribute("data-state", "running");
  });

  test("pauses while the tab is hidden", async ({ page }) => {
    await page.goto("/");
    await expect(bg(page)).toHaveAttribute("data-state", "running");
    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(bg(page)).toHaveAttribute("data-state", "paused");
  });

  test("falls back to the halftone ring without WebGL", async ({ page }) => {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      // @ts-expect-error -- simulating a browser without WebGL
      HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
        if (type === "webgl" || type === "webgl2") return null;
        return original.call(this, type, ...rest);
      };
    });
    await page.goto("/");
    await expect(bg(page)).toHaveAttribute("data-hero-bg", "ring");
    await expect(bg(page)).toHaveAttribute("data-state", "running");
  });
});

test.describe("hero intro", () => {
  const intro = (page: Page) => page.locator("section[aria-labelledby='name'] p[data-state]");
  const sentence =
    "AI engineer building retrieval systems, LLM pipelines and automations that keep working after the demo.";

  test("reveals the text from dots, then leaves plain text", async ({ page }) => {
    await page.goto("/");
    await expect(intro(page)).toHaveAttribute("data-state", "animating");
    await expect(intro(page).locator("canvas")).toHaveCount(1);
    await expect(intro(page)).toHaveAttribute("data-state", "done", { timeout: 6_000 });
    await expect(intro(page).locator("canvas")).toHaveCount(0);
    const hidden = await intro(page).locator("[data-c]").evaluateAll((els) => els.filter((e) => e.style.opacity !== "").length);
    expect(hidden).toBe(0);
  });

  test("screen readers get the whole sentence at once", async ({ page }) => {
    await page.goto("/");
    await expect(intro(page).locator(".sr-only")).toHaveText(sentence);
    await expect(intro(page).locator('[aria-hidden="true"]').first()).toBeAttached();
  });

  test("is skipped for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(intro(page)).toHaveAttribute("data-state", "static");
    await expect(intro(page).locator("canvas")).toHaveCount(0);
  });
});
