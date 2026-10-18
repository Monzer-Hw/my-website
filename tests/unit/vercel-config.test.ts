import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Spec 5: server functions run in Frankfurt so contact form data is processed in the EU.
describe("vercel.json", () => {
  it("pins Vercel Functions to Frankfurt (fra1)", () => {
    const config = JSON.parse(readFileSync(new URL("../../vercel.json", import.meta.url), "utf8"));
    expect(config.regions).toEqual(["fra1"]);
  });
});
