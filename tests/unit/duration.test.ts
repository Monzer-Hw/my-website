import { describe, expect, it } from "vitest";
import { durationLabel } from "@/lib/duration";

describe("durationLabel", () => {
  it.each([
    ["2:14", "2 minutes 14 seconds"],
    ["1:01", "1 minute 1 second"],
    ["3:00", "3 minutes"],
    ["0:45", "45 seconds"],
    ["0:00", "0 seconds"],
  ])("reads %s as %s", (input, expected) => {
    expect(durationLabel(input)).toBe(expected);
  });
});
