import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";
import { content } from "@/content";
import { durationLabel } from "@/lib/duration";

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** Fails with the list of WCAG 2.2 AA violations axe finds on the page in its current state. */
export async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(results.violations).toEqual([]);
}

type Project = (typeof content.projects)[number];
type WithVideo = Project & { links: { video: NonNullable<Project["links"]["video"]> } };

/** Projects that have a demo video. Throws if content has none, so a test never silently checks nothing. */
export function projectsWithVideo(): WithVideo[] {
  const found = content.projects.filter((p): p is WithVideo => p.links.video !== undefined);
  if (found.length === 0) throw new Error("content has no project with a demo video");
  return found;
}

/** The accessible name of a project's still, as ProjectVideo builds it. */
export function stillName(p: WithVideo): string {
  return `Watch demo: ${p.title}, ${durationLabel(p.links.video.duration)}`;
}

/** The name of the video dialog, as VideoDialog builds it. */
export function dialogName(p: Project): string {
  return `${p.title}: demo video`;
}
