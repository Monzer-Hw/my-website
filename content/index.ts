import { assertLaunchReady, findPlaceholders } from "@/lib/placeholders";
import { experience } from "./experience";
import { legal } from "./legal";
import { profile } from "./profile";
import { projects } from "./projects";
import { contentSchema } from "./schema";
import { sections } from "./sections";
import { site } from "./site";
import { stack } from "./stack";
import { status } from "./status";

/**
 * All site content, validated against the spec's rules. Pages import from here,
 * so invalid content, or placeholders in a production build, fail `next build`.
 */
export const content = contentSchema.parse({
  site,
  sections,
  legal,
  profile,
  status,
  projects,
  experience,
  stack,
});

assertLaunchReady(findPlaceholders(content), process.env.VERCEL_ENV);
