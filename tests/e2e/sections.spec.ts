import { expect, test } from "@playwright/test";
import { content } from "@/content";
import { formatRange } from "@/lib/dates";
import { expectNoAxeViolations, projectsWithVideo, stillName } from "./helpers";

test.describe("home sections", () => {
  test("sections appear in the spec order", async ({ page }) => {
    await page.goto("/");
    const headings = await page.getByRole("heading", { level: 2 }).allTextContents();
    expect(headings).toEqual(["Projects.", "About.", "Experience.", "Stack.", "Let's talk."]);
  });

  test("every in-page link points to an element that exists", async ({ page }) => {
    await page.goto("/");
    // Section links are "#id" in the page and "/#id" in the header (so they work from any page).
    const targets = await page.locator('a[href^="#"], a[href^="/#"]').evaluateAll((links) =>
      [...new Set(links.map((a) => a.getAttribute("href")!.replace(/^\/?#/, "")))],
    );
    expect(targets.length).toBeGreaterThan(5);
    for (const id of targets) {
      await expect(page.locator(`[id="${id}"]`), `#${id}`).toHaveCount(1);
    }
  });

  test("each project shows its title, still and code link", async ({ page }) => {
    await page.goto("/");
    const projects = page.locator("#projects article");
    await expect(projects).toHaveCount(content.projects.length);
    await expect(projects.first().getByRole("heading", { level: 3 })).toHaveText(content.projects[0].title);

    // A project that has both a video and a code link, so neither assertion can be skipped.
    const project = projectsWithVideo().find((p) => p.links.code);
    if (!project) throw new Error("content has no project with both a demo video and a code link");
    const row = page.locator(`#${project.id}`);
    await expect(row.getByRole("button", { name: stillName(project) })).toBeVisible();
    await expect(
      row.getByRole("link", { name: `Code for ${project.title} on GitHub (opens in a new tab)` }),
    ).toBeVisible();
  });

  test("experience shows formatted dates, newest first", async ({ page }) => {
    await page.goto("/");
    const dates = await page.locator("#experience time").allTextContents();
    expect(dates).toEqual(
      content.experience.map((job) => formatRange(job.start, job.end, content.sections.experience.present)),
    );

    // Newest first, checked on the rendered start dates (YYYY-MM sorts as text), not on content order.
    const starts = await page.locator("#experience time").evaluateAll((els) => els.map((e) => e.getAttribute("datetime")));
    expect(starts.length).toBeGreaterThan(0);
    expect(starts).toEqual([...starts].sort().reverse());
  });

  // Sets its own viewport, so one Playwright project is enough.
  for (const width of [360, 768, 1440]) {
    test(`never scrolls sideways at ${width}px`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop", "sets its own viewport; runs once");
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      // The hero intro adds and removes its own canvas: measure once it has finished.
      await expect(page.locator("section[aria-labelledby='name'] h1[data-state]")).toHaveAttribute(
        "data-state",
        "done",
        { timeout: 10_000 },
      );
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
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(content.profile.email);
  });

  test("the full page has no detectable accessibility violations", async ({ page }) => {
    await page.goto("/");
    await expectNoAxeViolations(page);
  });
});
