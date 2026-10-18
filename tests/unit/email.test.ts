import { describe, expect, it, vi } from "vitest";
import type { ContactInput } from "@/lib/contact";
import { sendContactEmail } from "@/lib/email";

const input: ContactInput = {
  name: "Jane\r\nBcc: victim@example.com",
  email: "jane@company.com",
  message: "Hello, I'd like to talk about a project.",
  consent: true,
  website: "",
  startedAt: 1,
};
const env = { RESEND_API_KEY: "re_test_key", CONTACT_TO: "owner@example.com" };

function fakeFetch(status = 200) {
  return vi.fn(async () => new Response(JSON.stringify({ id: "email_1" }), { status }));
}

describe("sendContactEmail", () => {
  it("posts a plain-text email to Resend with the visitor as reply-to", async () => {
    const fetchImpl = fakeFetch();
    expect(await sendContactEmail(input, env, fetchImpl)).toEqual({ ok: true });

    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ Authorization: "Bearer re_test_key" });
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      from: "Website contact form <onboarding@resend.dev>",
      to: ["owner@example.com"],
      reply_to: "jane@company.com",
    });
    expect(body.html).toBeUndefined();
    expect(body.text).toContain(input.message);
  });

  it("strips line breaks from the subject so the visitor cannot add headers", async () => {
    const fetchImpl = fakeFetch();
    await sendContactEmail(input, env, fetchImpl);
    const [, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    const { subject } = JSON.parse(init.body as string);
    expect(subject).toBe("Website message from Jane Bcc: victim@example.com");
    expect(subject).not.toMatch(/[\r\n]/);
  });

  it("uses CONTACT_FROM when set", async () => {
    const fetchImpl = fakeFetch();
    await sendContactEmail(input, { ...env, CONTACT_FROM: "Monzer <hello@example.com>" }, fetchImpl);
    const [, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(init.body as string).from).toBe("Monzer <hello@example.com>");
  });

  it("fails without calling Resend when the key or recipient is missing", async () => {
    const fetchImpl = fakeFetch();
    expect(await sendContactEmail(input, { CONTACT_TO: "owner@example.com" }, fetchImpl)).toEqual({
      ok: false,
      reason: "config",
    });
    expect(await sendContactEmail(input, { RESEND_API_KEY: "k" }, fetchImpl)).toEqual({ ok: false, reason: "config" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("reports a provider error with its status", async () => {
    expect(await sendContactEmail(input, env, fakeFetch(422))).toEqual({ ok: false, reason: "provider", status: 422 });
  });
});
