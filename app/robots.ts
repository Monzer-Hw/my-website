import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// Everything is public except the contact endpoint. Vercel adds "noindex" to preview
// deployments on its own, so previews stay out of search engines.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", siteUrl()).href,
  };
}
