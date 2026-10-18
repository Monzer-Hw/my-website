/**
 * The site's public base URL, for link previews, the sitemap and structured data.
 * NEXT_PUBLIC_SITE_URL wins once the custom domain exists (phase 10); until then Vercel's
 * automatic production address is used, and http://localhost:3000 locally.
 */
export function siteUrl(env: Record<string, string | undefined> = process.env): URL {
  if (env.NEXT_PUBLIC_SITE_URL) return new URL(env.NEXT_PUBLIC_SITE_URL);
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return new URL(`https://${env.VERCEL_PROJECT_PRODUCTION_URL}`);
  return new URL("http://localhost:3000");
}
