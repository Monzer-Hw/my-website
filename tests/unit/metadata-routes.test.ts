import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

afterEach(() => vi.unstubAllEnvs());

describe("robots", () => {
  it("allows everything except the API and points to the sitemap", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://monzer.dev");
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: "/api/" },
      sitemap: "https://monzer.dev/sitemap.xml",
    });
  });
});

describe("sitemap", () => {
  it("lists the home page and both legal pages on the site's own address", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://monzer.dev");
    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://monzer.dev/",
      "https://monzer.dev/impressum",
      "https://monzer.dev/datenschutz",
    ]);
  });

  it("ranks the home page above the legal pages", () => {
    const [home, ...legal] = sitemap();
    expect(home.priority).toBe(1);
    expect(legal.map((entry) => entry.priority)).toEqual([0.2, 0.2]);
  });
});
