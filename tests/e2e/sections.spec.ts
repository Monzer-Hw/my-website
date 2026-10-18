import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("home sections", () => {
  test("sections appear in the spec order", async ({ page }) => {
    await page.goto("/");
    const headings = await page.getByRole("heading", { level: 2 }).allTextContents();
    expect(headings).toEqual(["Projects.", "About.", "Experience.", "Stack.", "Let's talk."]);
  });

  test("every in-page link points to an element that exists", async ({ page }) => {
    await page.goto("/");
    const targets = await page.locator('a[href^="#"]').evaluateAll((links) =>
      [...new Set(links.map((a) => a.getAttribute("href")!.slice(1)))],
    );
    expect(targets.length).toBeGreaterThan(5);
    for (const id of targets) {
      await expect(page.locator(`[id="${id}"]`), `#${id}`).toHaveCount(1);
    }
  });

  test("each project shows its still, status and code link", async ({ page }) => {
    await page.goto("/");
    const projects = page.locator("#projects article");
    await expect(projects).toHaveCount(3);
    await expect(projects.first().getByRole("heading", { level: 3 })).toHaveText("Production RAG pipeline");
    await expect(
      projects.first().getByRole("button", { name: "Watch demo: Production RAG pipeline, 2 minutes 14 seconds" }),
    ).toBeVisible();
    await expect(
      projects.first().getByRole("link", { name: "Code for Production RAG pipeline on GitHub (opens in a new tab)" }),
    ).toBeVisible();
  });

  test("experience shows formatted dates, newest first", async ({ page }) => {
    await page.goto("/");
    const dates = await page.locator("#experience time").allTextContents();
    expect(dates).toEqual(["Mar 2025 – now", "Apr 2024 – Feb 2025", "Sep 2023 – Mar 2024"]);
  });

  for (const width of [360, 768, 1440]) {
    test(`never scrolls sideways at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  }

  test("the contact form explains each missing field", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("#contact form");
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(form.getByText("Enter your name.")).toBeVisible();
    await expect(form.getByText("Enter your email address.")).toBeVisible();
    await expect(form.getByText("Write a message of at least 10 characters.")).toBeVisible();
    await expect(form.getByText("Tick the box so I can use your details to reply.")).toBeVisible();
    await expect(form.getByLabel("Name")).toBeFocused();

    await form.getByLabel("Name").fill("Jane Doe");
    await form.getByLabel("Email").fill("jane@company");
    await expect(form.getByText("Enter an email address like jane@company.com.")).toBeVisible();
    await form.getByLabel("Email").fill("jane@company.com");
    await form.getByLabel("Message", { exact: true }).fill("Hello, I'd like to talk about a project.");
    await expect(form.getByText("40 / 2000")).toBeVisible();
  });

  test("the email copy button copies the address", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "clipboard permissions are Chromium-only");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.locator("#contact").getByRole("button", { name: "Copy" }).click();
    await expect(page.locator("#contact").getByRole("button", { name: "Copied" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("hello@example.com");
  });

  test("the full page has no detectable accessibility violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(results.violations).toEqual([]);
  });
});
