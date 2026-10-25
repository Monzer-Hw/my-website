import { expect, test } from "@playwright/test";
import { dialogName, expectNoAxeViolations, projectsWithVideo, stillName } from "./helpers";

const videos = projectsWithVideo();
const first = videos[0];
// A different project's "Watch demo" link when there is one; the same project if only one has a video.
const other = videos[1] ?? videos[0];
const STILL = stillName(first);
const DIALOG = dialogName(first);

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
    await expect(page.getByRole("dialog", { name: DIALOG })).toBeVisible();
    await expect.poll(() => videoRequests.some((u) => u.endsWith(first.links.video.src))).toBe(true);
    expect(external).toEqual([]);
  });

  test("a video that fails to load shows a clear message instead of a broken player", async ({ page }) => {
    // Fail the request on purpose, so this does not depend on whether the file exists.
    await page.route("**/videos/*.mp4", (route) => route.fulfill({ status: 404 }));
    await page.goto("/");
    await page.getByRole("button", { name: STILL }).click();
    const dialog = page.getByRole("dialog", { name: DIALOG });
    await expect(dialog.getByRole("status")).toHaveText(/isn't available yet/);
  });

  test("the video has an English captions track", async ({ page }) => {
    // Hold the video request open so the player stays up whether or not the file exists.
    await page.route("**/videos/*.mp4", () => {});
    await page.goto("/");
    await page.getByRole("button", { name: STILL }).click();
    const track = page.locator('dialog[open] video track[kind="captions"]');
    await expect(track).toHaveAttribute("srclang", "en");
    await expect(track).toHaveAttribute("src", first.links.video.captions);
    await expect(page.locator("dialog[open] video")).toHaveAttribute("controls", "");
  });

  test("Escape closes the video and returns focus to the still", async ({ page }) => {
    await page.goto("/");
    const still = page.getByRole("button", { name: STILL });
    await still.click();
    const dialog = page.getByRole("dialog", { name: DIALOG });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(still).toBeFocused();
    await expect(page.locator("video")).toHaveCount(0);
  });

  test("the Watch demo link opens the same video, and the close button closes it", async ({ page }) => {
    await page.goto("/");
    const watch = page.locator(`#${other.id}`).getByRole("button", { name: `Watch demo of ${other.title}`, exact: true });
    await watch.click();
    const dialog = page.getByRole("dialog", { name: dialogName(other) });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close video" }).click();
    await expect(dialog).toBeHidden();
    await expect(watch).toBeFocused();
  });

  test("clicking the backdrop closes the video", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: STILL }).click();
    const dialog = page.getByRole("dialog", { name: DIALOG });
    await expect(dialog).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(dialog).toBeHidden();
  });

  test("the open video has no detectable accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: STILL }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expectNoAxeViolations(page);
  });
});
