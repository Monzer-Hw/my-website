import { describe, expect, it } from "vitest";
import { formatRange, formatYearMonth } from "@/lib/dates";

describe("dates", () => {
  it("formats YYYY-MM as a short month and year", () => {
    expect(formatYearMonth("2025-03")).toBe("Mar 2025");
    expect(formatYearMonth("2023-12")).toBe("Dec 2023");
  });

  it("formats ranges, with the content's word for an ongoing role", () => {
    expect(formatRange("2024-04", "2025-02", "now")).toBe("Apr 2024 – Feb 2025");
    expect(formatRange("2025-03", "present", "now")).toBe("Mar 2025 – now");
  });
});
