import { expect, test, type Page } from "@playwright/test";

const ring = (page: Page) => page.locator("section[aria-labelledby='name'] canvas");
const snapshot = (page: Page) => ring(page).evaluate((c: HTMLCanvasElement) => c.toDataURL());

test.describe("halftone ring loop", () => {
  test("runs and changes over time while the hero is visible", async ({ page }) => {
    await page.goto("/");
    await expect(ring(page)).toHaveAttribute("data-state", "running");
    const first = await snapshot(page);
    await page.waitForTimeout(700);
    expect(await snapshot(page)).not.toBe(first);
  });

  test("stays still for visitors who prefer reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(ring(page)).toHaveAttribute("data-state", "static");
    const first = await snapshot(page);
    await page.waitForTimeout(700);
    expect(await snapshot(page)).toBe(first);
  });

  test("pauses when the hero is scrolled out of view, resumes when back", async ({ page }) => {
    await page.goto("/");
    await expect(ring(page)).toHaveAttribute("data-state", "running");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(ring(page)).toHaveAttribute("data-state", "paused");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(ring(page)).toHaveAttribute("data-state", "running");
  });

  test("pauses while the tab is hidden", async ({ page }) => {
    await page.goto("/");
    await expect(ring(page)).toHaveAttribute("data-state", "running");
    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(ring(page)).toHaveAttribute("data-state", "paused");
  });

  for (const variant of ["orbit", "breathe", "wave"]) {
    test(`prototype "${variant}" runs`, async ({ page }) => {
      await page.goto(`/?ring=${variant}`);
      await expect(ring(page)).toHaveAttribute("data-variant", variant);
      await expect(ring(page)).toHaveAttribute("data-state", "running");
    });
  }

  // Spec 4.7: the loop must not drop the page below 60 fps on a mid-range phone. The phone
  // layout runs with the CPU slowed 4x to stand in for one; desktop runs at full speed.
  test("draws each frame well within the 60 fps budget", async ({ page }, info) => {
    if (info.project.name === "mobile") {
      const cdp = await page.context().newCDPSession(page);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    }
    await page.goto("/");
    await expect(ring(page)).toHaveAttribute("data-draw-ms", /\d/, { timeout: 10_000 });
    await page.waitForTimeout(1500);
    const ms = Number(await ring(page).getAttribute("data-draw-ms"));
    // 16.7 ms is a whole frame at 60 fps; drawing must leave most of it for the browser.
    expect(ms).toBeLessThan(8);
  });
});
