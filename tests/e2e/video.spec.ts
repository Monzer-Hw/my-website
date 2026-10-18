import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const STILL = "Watch demo: Production RAG pipeline, 2 minutes 14 seconds";

test.describe("project videos", () => {
  test("nothing video-related loads before play, then the video loads on click", async ({ page, baseURL }) => {
    const videoRequests: string[] = [];
    const external: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (url.includes("/videos/")) videoRequests.push(url);
      if (!url.startsWith(baseURL!) && !url.startsWith("data:")) external.push(url);
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(videoRequests).toEqual([]);

    await page.getByRole("button", { name: STILL }).click();
    await expect(page.getByRole("dialog", { name: "Production RAG pipeline: demo video" })).toBeVisible();
    await expect.poll(() => videoRequests.some((u) => u.endsWith("/videos/rag-pipeline.mp4"))).toBe(true);
    expect(external).toEqual([]);
  });

  test("a missing video file shows a clear message instead of a broken player", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: STILL }).click();
    const dialog = page.getByRole("dialog", { name: "Production RAG pipeline: demo video" });
    await expect(dialog.getByRole("status")).toHaveText(/isn't available yet/);
  });

  test("the video has an English captions track", async ({ page }) => {
    // Hold the video request open so the player stays up (the placeholder file doesn't exist yet).
    await page.route("**/videos/*.mp4", () => {});
    await page.goto("/");
    await page.getByRole("button", { name: STILL }).click();
    const track = page.locator('dialog[open] video track[kind="captions"]');
    await expect(track).toHaveAttribute("srclang", "en");
    await expect(track).toHaveAttribute("src", "/videos/rag-pipeline.vtt");
    await expect(page.locator("dialog[open] video")).toHaveAttribute("controls", "");
  });

  test("Escape closes the video and returns focus to the still", async ({ page }) => {
    await page.goto("/");
    const still = page.getByRole("button", { name: STILL });
    await still.click();
    const dialog = page.getByRole("dialog", { name: "Production RAG pipeline: demo video" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(still).toBeFocused();
    await expect(page.locator("video")).toHaveCount(0);
  });

  test("the Watch demo link opens the same video, and the close button closes it", async ({ page }) => {
    await page.goto("/");
    const watch = page.locator("#sudoku-solver").getByRole("button", { name: "Watch demo of Sudoku solver", exact: true });
    await watch.click();
    const dialog = page.getByRole("dialog", { name: "Sudoku solver: demo video" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close video" }).click();
    await expect(dialog).toBeHidden();
    await expect(watch).toBeFocused();
  });

  test("clicking the backdrop closes the video", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: STILL }).click();
    const dialog = page.getByRole("dialog", { name: "Production RAG pipeline: demo video" });
    await expect(dialog).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(dialog).toBeHidden();
  });

  test("the open video has no detectable accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: STILL }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(results.violations).toEqual([]);
  });
});
