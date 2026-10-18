import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// No lastModified: cacheComponents forbids reading the current time while prerendering.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: new URL("/", base).href, changeFrequency: "monthly", priority: 1 },
    { url: new URL("/impressum", base).href, changeFrequency: "yearly", priority: 0.2 },
    { url: new URL("/datenschutz", base).href, changeFrequency: "yearly", priority: 0.2 },
  ];
}
