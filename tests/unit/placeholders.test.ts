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
    const found = findPlaceholders(content);
    expect(found).toHaveLength(16);
    expect(found).toEqual(
      expect.arrayContaining([
        "profile",
        "status",
        "legal: Impressum",
        "legal: Datenschutzerklärung",
        "projects: Sudoku solver",
        "experience: AI Engineer at Nordwerk Analytics GmbH",
        "stack: Computer vision",
      ]),
    );
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
