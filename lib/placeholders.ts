import type { Content } from "@/content/schema";

/** Lists every entry still marked `placeholder: true`, in readable form. */
export function findPlaceholders(content: Content): string[] {
  const found: string[] = [];
  if (content.profile.placeholder) found.push("profile");
  if (content.status.placeholder) found.push("status");
  for (const p of content.projects) if (p.placeholder) found.push(`projects: ${p.title}`);
  for (const j of content.experience) if (j.placeholder) found.push(`experience: ${j.role} at ${j.org}`);
  for (const g of content.stack) if (g.placeholder) found.push(`stack: ${g.title}`);
  return found;
}

/**
 * Throws in a production build while placeholders remain (spec 3.7), so stand-in
 * content can never go live. Preview and local builds are allowed.
 * `env` is Vercel's VERCEL_ENV: "production" | "preview" | "development" | undefined.
 */
export function assertLaunchReady(placeholders: string[], env: string | undefined): void {
  if (env !== "production" || placeholders.length === 0) return;
  throw new Error(
    `Production build blocked: ${placeholders.length} placeholder entries remain. ` +
      `Replace them in content/ and remove "placeholder: true":\n- ${placeholders.join("\n- ")}`,
  );
}
