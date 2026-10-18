import { afterEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("@/lib/email", () => ({ sendContactEmail: (...args: unknown[]) => send(...args) }));

const { POST } = await import("@/app/api/contact/route");

const valid = {
  name: "Jane Doe",
  email: "jane@company.com",
  message: "Hello, I'd like to talk about a project.",
  consent: true,
  website: "",
  startedAt: Date.now() - 10_000,
};

const post = (body: unknown) =>
  POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

afterEach(() => send.mockReset());

describe("POST /api/contact", () => {
  it("sends a valid message and answers 200", async () => {
    send.mockResolvedValue({ ok: true });
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ email: "jane@company.com" }));
  });

  it("answers 400 with the invalid fields and sends nothing", async () => {
    const res = await post({ ...valid, email: "nope" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid", fields: ["email"] });
    expect(send).not.toHaveBeenCalled();
  });

  it("answers 400 to a body that is not JSON", async () => {
    const res = await post("not json");
    expect(res.status).toBe(400);
  });

  it("pretends success for spam and sends nothing", async () => {
    const res = await post({ ...valid, website: "https://spam.example" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it("answers 502 when the email cannot be sent, without logging personal data", async () => {
    send.mockResolvedValue({ ok: false, reason: "provider", status: 500 });
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await post(valid);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: "send" });
    const logged = log.mock.calls.flat().join(" ");
    expect(logged).not.toContain("jane@company.com");
    expect(logged).not.toContain("Jane Doe");
    log.mockRestore();
  });
});
