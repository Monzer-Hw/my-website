import { describe, expect, it } from "vitest";
import { content } from "@/content";
import type { Content } from "@/content/schema";
import { assertLaunchReady, findPlaceholders } from "@/lib/placeholders";

function withoutPlaceholders(c: Content): Content {
  const clear = <T extends { placeholder?: boolean }>(entry: T): T => ({ ...entry, placeholder: false });
  return {
    ...c,
    profile: clear(c.profile),
    status: clear(c.status),
    projects: c.projects.map(clear),
    experience: c.experience.map(clear),
    stack: c.stack.map(clear),
    legal: { impressum: clear(c.legal.impressum), datenschutz: clear(c.legal.datenschutz) },
  };
}

describe("findPlaceholders", () => {
  it("lists every placeholder entry in readable form", () => {
    const c = withoutPlaceholders(content);
    const flag = <T extends { placeholder?: boolean }>(entry: T): T => ({ ...entry, placeholder: true });
    const flagged: Content = {
      ...c,
      profile: flag(c.profile),
      status: flag(c.status),
      projects: [flag(c.projects[0]), ...c.projects.slice(1)],
      experience: [flag(c.experience[0]), ...c.experience.slice(1)],
      stack: [flag(c.stack[0]), ...c.stack.slice(1)],
      legal: { impressum: flag(c.legal.impressum), datenschutz: flag(c.legal.datenschutz) },
    };
    expect(findPlaceholders(flagged)).toEqual([
      "profile",
      "status",
      `projects: ${c.projects[0].title}`,
      `experience: ${c.experience[0].role} at ${c.experience[0].org}`,
      `stack: ${c.stack[0].title}`,
      `legal: ${c.legal.impressum.title}`,
      `legal: ${c.legal.datenschutz.title}`,
    ]);
  });

  it("returns nothing once all content is real", () => {
    expect(findPlaceholders(withoutPlaceholders(content))).toEqual([]);
  });
});

describe("assertLaunchReady", () => {
  const remaining = ["projects: Sudoku solver"];

  it("blocks a production build while placeholders remain", () => {
    expect(() => assertLaunchReady(remaining, "production")).toThrow(
      /Production build blocked: 1 placeholder entries remain[\s\S]*- projects: Sudoku solver/,
    );
  });

  it.each(["preview", "development", undefined])("allows a %s build", (env) => {
    expect(() => assertLaunchReady(remaining, env)).not.toThrow();
  });

  it("allows a production build without placeholders", () => {
    expect(() => assertLaunchReady([], "production")).not.toThrow();
  });
});
