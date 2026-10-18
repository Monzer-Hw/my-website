import { checkSubmission } from "@/lib/contact";
import { sendContactEmail } from "@/lib/email";

/**
 * POST /api/contact: validates a contact form submission and emails it (spec 3.4).
 * Nothing is stored. Logs never contain the visitor's name, email or message.
 *
 * 200 { ok: true }                     sent (or silently dropped as spam)
 * 400 { ok: false, error: "invalid" }  failed validation; `fields` lists which
 * 502 { ok: false, error: "send" }     the email provider or configuration failed
 */
export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid", fields: [] }, { status: 400 });
  }

  const result = checkSubmission(raw, Date.now());
  if (result.kind === "spam") {
    // Look like success so bots learn nothing.
    return Response.json({ ok: true });
  }
  if (result.kind === "invalid") {
    return Response.json({ ok: false, error: "invalid", fields: result.fields }, { status: 400 });
  }

  const sent = await sendContactEmail(result.data);
  if (!sent.ok) {
    console.error(`contact: email not sent (${sent.reason}${sent.status ? ` ${sent.status}` : ""})`);
    return Response.json({ ok: false, error: "send" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
