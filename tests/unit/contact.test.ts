import { describe, expect, it } from "vitest";
import { MIN_FILL_MS, checkSubmission } from "@/lib/contact";

const NOW = 1_800_000_000_000;
const valid = {
  name: "Jane Doe",
  email: "jane@company.com",
  message: "Hello, I'd like to talk about a project.",
  consent: true,
  website: "",
  startedAt: NOW - 10_000,
};

describe("checkSubmission", () => {
  it("accepts a valid submission and trims the text", () => {
    const result = checkSubmission({ ...valid, name: "  Jane Doe  " }, NOW);
    expect(result).toEqual({ kind: "ok", data: { ...valid, name: "Jane Doe" } });
  });

  it("lists every invalid field", () => {
    const result = checkSubmission({ ...valid, name: " ", email: "jane@", message: "short", consent: false }, NOW);
    expect(result).toEqual({ kind: "invalid", fields: ["name", "email", "message", "consent"] });
  });

  it("rejects messages over 2000 characters", () => {
    expect(checkSubmission({ ...valid, message: "x".repeat(2001) }, NOW)).toEqual({
      kind: "invalid",
      fields: ["message"],
    });
  });

  it("treats a filled-in honeypot as spam, even with otherwise invalid fields", () => {
    expect(checkSubmission({ ...valid, website: "https://spam.example" }, NOW)).toEqual({
      kind: "spam",
      reason: "honeypot",
    });
    expect(checkSubmission({ website: "x" }, NOW)).toEqual({ kind: "spam", reason: "honeypot" });
  });

  it(`treats a submit within ${MIN_FILL_MS} ms of the form appearing as spam`, () => {
    expect(checkSubmission({ ...valid, startedAt: NOW - 500 }, NOW)).toEqual({ kind: "spam", reason: "too-fast" });
    expect(checkSubmission({ ...valid, startedAt: NOW - MIN_FILL_MS }, NOW).kind).toBe("ok");
  });

  it("rejects input that is not an object", () => {
    expect(checkSubmission(null, NOW).kind).toBe("invalid");
    expect(checkSubmission("hello", NOW).kind).toBe("invalid");
  });
});
