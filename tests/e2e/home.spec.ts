import { expect, test } from "@playwright/test";
import { content } from "@/content";

test.describe("home page", () => {
  test("renders the main heading in English", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    // The intro sentence is the heading; its name comes from the screen-reader copy.
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(content.profile.intro);
  });
});
