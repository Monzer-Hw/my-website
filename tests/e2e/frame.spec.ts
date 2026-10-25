import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 900;

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(results.violations).toEqual([]);
}

test.describe("page frame", () => {
  test("desktop shows section links and hides the menu button", async ({ page }) => {
    await page.goto("/");
    test.skip(!isDesktop(page), "desktop layout only");
    const nav = page.getByRole("navigation", { name: "Main", exact: true });
    await expect(nav.getByRole("link", { name: "Projects" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
    await expect(page.getByRole("link", { name: /GitHub/ }).first()).toBeVisible();
  });

  test("below 900px the menu opens, closes with Escape and on link click", async ({ page }) => {
    await page.goto("/");
    test.skip(isDesktop(page), "mobile layout only");
    await expect(page.getByRole("navigation", { name: "Main", exact: true })).toBeHidden();

    const button = page.getByRole("button", { name: "Open menu" });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();

    const menu = page.getByRole("navigation", { name: "Main menu" });
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await expect(menu.getByRole("link", { name: "Contact" })).toBeVisible();
    await expect(menu.getByRole("link", { name: /LinkedIn/ })).toBeVisible();
    await expectNoAxeViolations(page);

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

    await page.getByRole("button", { name: "Open menu" }).click();
    await menu.getByRole("link", { name: "About" }).click();
    await expect(menu).toBeHidden();
  });

  test("skip link is the first tab stop and moves focus to the content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("keyboard focus is visible", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    // Polled: links with `transition-colors` fade the outline color in over 0.2s.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const s = getComputedStyle(document.activeElement as Element);
          return { style: s.outlineStyle, width: s.outlineWidth, color: s.outlineColor };
        }),
      )
      .toEqual({ style: "solid", width: "2px", color: "rgb(47, 73, 209)" });
  });

  test("loads nothing from other sites (font is self-hosted)", async ({ page, baseURL }) => {
    const external: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (!url.startsWith(baseURL!) && !url.startsWith("data:")) external.push(url);
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(external).toEqual([]);
  });

  test("footer links to the legal pages", async ({ page }) => {
    await page.goto("/");
    const legal = page.getByRole("navigation", { name: "Legal" });
    await expect(legal.getByRole("link", { name: "Impressum" })).toHaveAttribute("href", "/impressum");
    await expect(legal.getByRole("link", { name: "Datenschutz" })).toHaveAttribute("href", "/datenschutz");
  });

  test("has no detectable accessibility violations", async ({ page }) => {
    await page.goto("/");
    await expectNoAxeViolations(page);
  });
});
