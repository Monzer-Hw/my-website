import { describe, expect, it } from "vitest";
import pkg from "@/package.json";

// Harness check for phase 1; real unit tests start with the content model in phase 3.
describe("test setup", () => {
  it("resolves the @ alias and exposes the project scripts", () => {
    expect(pkg.name).toBe("my-website");
    expect(Object.keys(pkg.scripts)).toEqual(
      expect.arrayContaining(["build", "lint", "typecheck", "test", "test:e2e"]),
    );
  });
});
