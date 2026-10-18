import type { ContactInput } from "./contact";

// Sends a contact message through Resend's HTTP API (no SDK; swapping providers only touches
// this file). Configuration comes from environment variables, see .env.example.

const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "Website contact form <onboarding@resend.dev>"; // Resend's test sender until the domain exists

/** Reads RESEND_API_KEY, CONTACT_TO and CONTACT_FROM. */
type Env = Record<string, string | undefined>;
export type SendResult = { ok: true } | { ok: false; reason: "config" | "provider"; status?: number };

/** Removes line breaks so visitor text can never add headers to the subject. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

export async function sendContactEmail(
  input: ContactInput,
  env: Env = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<SendResult> {
  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO;
  if (!apiKey || !to) return { ok: false, reason: "config" };

  const name = oneLine(input.name);
  const response = await fetchImpl(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM || DEFAULT_FROM,
      to: [to],
      reply_to: input.email,
      subject: `Website message from ${name}`,
      // Plain text only: nothing the visitor writes is ever rendered as HTML.
      text: `${input.message}\n\n---\nFrom: ${name} <${input.email}>\nSent with the contact form on the website. Reply to this email to answer.`,
    }),
  });
  return response.ok ? { ok: true } : { ok: false, reason: "provider", status: response.status };
}
