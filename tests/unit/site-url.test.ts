import { describe, expect, it } from "vitest";
import { siteUrl } from "@/lib/site-url";

describe("siteUrl", () => {
  it("prefers the custom domain once it is set", () => {
    expect(
      siteUrl({ NEXT_PUBLIC_SITE_URL: "https://monzer.dev", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" }).href,
    ).toBe("https://monzer.dev/");
  });

  it("falls back to Vercel's production address over https", () => {
    expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "my-website-monzer2.vercel.app" }).href).toBe(
      "https://my-website-monzer2.vercel.app/",
    );
  });

  it("uses localhost when nothing is set", () => {
    expect(siteUrl({}).href).toBe("http://localhost:3000/");
  });
});
