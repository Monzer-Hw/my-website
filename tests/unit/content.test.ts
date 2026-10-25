import { describe, expect, it } from "vitest";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { contentSchema } from "@/content/schema";
import { sections } from "@/content/sections";
import { site } from "@/content/site";
import { stack } from "@/content/stack";
import { legal } from "@/content/legal";
import { status } from "@/content/status";

const raw = () => structuredClone({ site, sections, legal, profile, status, projects, experience, stack });

function issues(input: unknown): string[] {
  const result = contentSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
}

describe("content schema", () => {
  it("accepts the current content", () => {
    expect(issues(raw())).toEqual([]);
  });

  it("rejects a project with more than three decisions", () => {
    const c = raw();
    while (c.projects[0].decisions.length < 4) c.projects[0].decisions.push({ topic: "Extra", text: "One decision too many." });
    expect(issues(c)).toEqual([expect.stringMatching(/^projects\.0\.decisions:/)]);
  });

  it("rejects a job with more than three results", () => {
    const c = raw();
    while (c.experience[0].results.length < 4) c.experience[0].results.push("An extra result.");
    expect(issues(c)).toEqual([expect.stringMatching(/^experience\.0\.results:/)]);
  });

  it("rejects a stack group that points at an unknown project", () => {
    const c = raw();
    const index = c.stack[0].usedIn.push("no-such-project") - 1;
    expect(issues(c)).toEqual([`stack.0.usedIn.${index}: Unknown project id "no-such-project" in stack group "${c.stack[0].title}"`]);
  });

  it("rejects duplicate project ids", () => {
    const c = raw();
    c.projects[1].id = c.projects[0].id;
    expect(issues(c)).toContain(`projects.1.id: Duplicate project id "${c.projects[0].id}"`);
  });

  it("rejects a bio longer than two paragraphs", () => {
    const c = raw();
    while (c.profile.bio.length < 3) c.profile.bio.push("An extra paragraph.");
    expect(issues(c)).toEqual([expect.stringMatching(/^profile\.bio:/)]);
  });

  it("rejects an intro longer than 140 characters", () => {
    const c = raw();
    c.profile.intro = `I’m ${c.site.name}, ${"x".repeat(140)}`;
    expect(issues(c)).toEqual([expect.stringMatching(/^profile\.intro:/)]);
  });

  it("rejects an intro without the name (it is the page heading)", () => {
    const c = raw();
    c.profile.intro = "An AI engineer building retrieval systems.";
    expect(issues(c)).toEqual([`profile.intro: Intro must contain the name "${c.site.name}"`]);
  });

  it("requires captions for every demo video", () => {
    const c = raw();
    const index = c.projects.findIndex((p) => p.links.video);
    expect(index).toBeGreaterThanOrEqual(0);
    const video = c.projects[index].links.video as { captions?: string };
    delete video.captions;
    expect(issues(c)).toEqual([expect.stringMatching(new RegExp(`^projects\\.${index}\\.links\\.video\\.captions:`))]);
  });

  it("rejects dates that are not YYYY-MM", () => {
    const c = raw();
    c.experience[0].start = "April 2024";
    expect(issues(c)).toEqual(["experience.0.start: Use YYYY-MM"]);
  });
});
