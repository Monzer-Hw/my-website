import { expect, test } from "@playwright/test";
import { content } from "@/content";
import { expectNoAxeViolations } from "./helpers";

const { name, role, description } = content.site;

test.describe("legal pages", () => {
  for (const [label, path, heading] of [
    ["Impressum", "/impressum", "Impressum"],
    ["Datenschutz", "/datenschutz", "Datenschutzerklärung"],
  ] as const) {
    test(`${label} opens from the footer, in German, without accessibility violations`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("navigation", { name: "Legal" }).getByRole("link", { name: label }).click();
      await expect(page).toHaveURL(path);
      // Next.js 16 (cacheComponents) keeps the previous page mounted but hidden, so match visible elements only.
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await expect(page.locator('article[lang="de"]')).toBeVisible();
      await expect(page).toHaveTitle(`${heading} – ${name}`);
      await expectNoAxeViolations(page);
    });
  }

  test("header section links lead back to the home page sections", async ({ page }) => {
    await page.goto("/impressum");
    test.skip((page.viewportSize()?.width ?? 0) < 900, "section links are in the menu below 900px");
    await page.getByRole("navigation", { name: "Main", exact: true }).getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL("/#projects");
    await expect(page.getByRole("heading", { name: "Projects." })).toBeVisible();
  });
});

test.describe("not found", () => {
  test("unknown addresses get a 404 page with a way home", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found.");
    await page.getByRole("link", { name: "Go to the home page" }).click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("link previews and search", () => {
  test("the home page has title, description and preview tags", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(`${name} – ${role}`);
    const meta = (selector: string) => page.locator(selector).getAttribute("content");
    expect(await meta('meta[name="description"]')).toBe(description);
    expect(await meta('meta[property="og:title"]')).toBe(`${name} – ${role}`);
    expect(await meta('meta[property="og:image"]')).toMatch(/\/opengraph-image/);
    expect(await meta('meta[property="og:image:width"]')).toBe("1200");
    expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^http:\/\/localhost:3000\/?$/);
  });

  test("the preview image is a 1200x630 PNG", async ({ request }) => {
    const res = await request.get("/opengraph-image");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
    const png = await res.body();
    // PNG header: width and height are big-endian at bytes 16 and 20.
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });

  test("Person structured data names the owner and profiles", async ({ page }) => {
    await page.goto("/");
    const json = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    expect(json).toMatchObject({
      "@type": "Person",
      name,
      jobTitle: role,
      sameAs: content.site.social.map((s) => s.href),
    });
  });

  test("sitemap and robots list the public pages and hide the API", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const path of ["/", "/impressum", "/datenschutz"]) {
      expect(sitemap).toContain(`<loc>http://localhost:3000${path === "/" ? "/" : path}</loc>`);
    }
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Disallow: /api/");
    expect(robots).toContain("Sitemap: http://localhost:3000/sitemap.xml");
  });
});
