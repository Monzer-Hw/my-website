import { describe, expect, it } from "vitest";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { contentSchema } from "@/content/schema";
import { sections } from "@/content/sections";
import { site } from "@/content/site";
import { stack } from "@/content/stack";
import { status } from "@/content/status";

const raw = () => structuredClone({ site, sections, profile, status, projects, experience, stack });

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
    c.projects[0].decisions.push({ topic: "Extra", text: "One decision too many." });
    expect(issues(c)).toEqual([expect.stringMatching(/^projects\.0\.decisions:/)]);
  });

  it("rejects a job with more than three results", () => {
    const c = raw();
    c.experience[0].results.push("Second extra result.", "Third extra result.");
    expect(issues(c)).toEqual([expect.stringMatching(/^experience\.0\.results:/)]);
  });

  it("rejects a stack group that points at an unknown project", () => {
    const c = raw();
    c.stack[0].usedIn.push("no-such-project");
    expect(issues(c)).toEqual(['stack.0.usedIn.2: Unknown project id "no-such-project" in stack group "Language models and retrieval"']);
  });

  it("rejects duplicate project ids", () => {
    const c = raw();
    c.projects[1].id = c.projects[0].id;
    expect(issues(c)).toContain('projects.1.id: Duplicate project id "rag-pipeline"');
  });

  it("rejects a bio longer than two paragraphs", () => {
    const c = raw();
    c.profile.bio.push("A third paragraph.");
    expect(issues(c)).toEqual([expect.stringMatching(/^profile\.bio:/)]);
  });

  it("rejects an intro longer than 140 characters", () => {
    const c = raw();
    c.profile.intro = "x".repeat(141);
    expect(issues(c)).toEqual([expect.stringMatching(/^profile\.intro:/)]);
  });

  it("requires captions for every demo video", () => {
    const c = raw();
    const video = c.projects[0].links.video as { captions?: string };
    delete video.captions;
    expect(issues(c)).toEqual([expect.stringMatching(/^projects\.0\.links\.video\.captions:/)]);
  });

  it("rejects dates that are not YYYY-MM", () => {
    const c = raw();
    c.experience[1].start = "April 2024";
    expect(issues(c)).toEqual(["experience.1.start: Use YYYY-MM"]);
  });
});
