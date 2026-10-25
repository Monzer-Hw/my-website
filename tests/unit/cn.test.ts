import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("joins class names with single spaces", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("skips false, null, undefined and empty values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("returns an empty string when nothing is left", () => {
    expect(cn(false, undefined)).toBe("");
  });
});
