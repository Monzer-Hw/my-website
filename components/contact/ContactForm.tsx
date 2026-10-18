"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Content } from "@/content/schema";
import { cn } from "@/lib/cn";
import { MESSAGE_MIN } from "@/lib/contact";

type Copy = Content["sections"]["contact"]["form"];
type Field = "name" | "email" | "message" | "consent";
type Values = { name: string; email: string; message: string; consent: boolean };
type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: Values = { name: "", email: "", message: "", consent: false };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values, copy: Copy): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (!v.name.trim()) errors.name = copy.name.required;
  if (!v.email.trim()) errors.email = copy.email.required;
  else if (!EMAIL.test(v.email.trim())) errors.email = copy.email.invalid;
  if (v.message.trim().length < MESSAGE_MIN) errors.message = copy.message.tooShort;
  if (!v.consent) errors.consent = copy.consent.required;
  return errors;
}

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");

const input =
  "w-full min-h-[50px] rounded-ctl border border-line-2 bg-bg px-3.5 py-3 text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-ink-3 hover:border-ink-3 focus:border-ink focus:shadow-[0_0_0_4px_var(--color-signal-wash)] focus:outline-none aria-[invalid=true]:border-danger";

/**
 * Contact form (spec 3.4): browser-side validation for quick feedback, then POST /api/contact,
 * which validates again and emails the message. A hidden honeypot field and the time the form
 * appeared let the server drop bots. Nothing is stored.
 */
export function ContactForm({
  copy,
  privacyHref,
  ownerEmail,
}: {
  copy: Copy;
  privacyHref: string;
  ownerEmail: string;
}) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [sentTo, setSentTo] = useState({ name: "", email: "" });
  const startedAt = useRef(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  function update<K extends Field>(field: K, value: Values[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted) setErrors(validate(next, copy));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setAttempted(true);
    const found = validate(values, copy);
    setErrors(found);
    const first = (["name", "email", "message", "consent"] as const).find((f) => found[f]);
    if (first) {
      const target = { name: nameRef, email: emailRef, message: messageRef, consent: consentRef }[first];
      target.current?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypotRef.current?.value ?? "",
          startedAt: startedAt.current,
        }),
      });
      const body = (await response.json().catch(() => ({}))) as { ok?: boolean };
      if (!response.ok || !body.ok) throw new Error(`status ${response.status}`);
      setSentTo({ name: values.name.trim().split(/\s+/)[0], email: values.email.trim() });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setValues(EMPTY);
    setErrors({});
    setAttempted(false);
    setStatus("idle");
    startedAt.current = Date.now();
    requestAnimationFrame(() => nameRef.current?.focus());
  }

  if (status === "sent") {
    return (
      <div className="py-3">
        <div aria-hidden="true" className="mb-[22px] grid size-12 place-items-center rounded-full bg-ink text-bg">
          <Icon name="check" className="size-[22px]" />
        </div>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] tracking-[-0.03em] outline-none"
        >
          {copy.successTitle}
        </h3>
        <p className="mt-3 max-w-[46ch] text-ink-2">{fill(copy.successBody, sentTo)}</p>
        <Button variant="soft" className="mt-7" onClick={reset}>
          {copy.sendAnother}
        </Button>
      </div>
    );
  }

  const err = (field: Field) =>
    errors[field] ? (
      <p id={`e-${field}`} className="text-sm text-danger">
        {errors[field]}
      </p>
    ) : null;

  const sending = status === "sending";

  return (
    <form noValidate onSubmit={submit} aria-busy={sending}>
      <div className="grid gap-5 phone:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="f-name" className="text-[0.9375rem] font-medium text-ink">
            {copy.name.label}
          </label>
          <input
            ref={nameRef}
            id="f-name"
            name="name"
            autoComplete="name"
            placeholder={copy.name.placeholder}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "e-name" : undefined}
            className={input}
          />
          {err("name")}
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="f-email" className="text-[0.9375rem] font-medium text-ink">
            {copy.email.label}
          </label>
          <input
            ref={emailRef}
            id="f-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={copy.email.placeholder}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "e-email" : undefined}
            className={input}
          />
          {err("email")}
        </div>
        <div className="flex min-w-0 flex-col gap-2 phone:col-span-2">
          <label htmlFor="f-message" className="text-[0.9375rem] font-medium text-ink">
            {copy.message.label}
          </label>
          <textarea
            ref={messageRef}
            id="f-message"
            name="message"
            maxLength={copy.message.maxLength}
            placeholder={copy.message.placeholder}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={cn(errors.message && "e-message", "c-message")}
            className={cn(input, "min-h-[150px] resize-y leading-[1.5]")}
          />
          {err("message")}
          <p id="c-message" className="self-end text-[0.8125rem] text-ink-3 tabular-nums">
            {values.message.length} / {copy.message.maxLength}
          </p>
        </div>

        {/* Honeypot: invisible and unreachable for people, filled in by bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="f-website">Website</label>
          <input ref={honeypotRef} id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div className="grid grid-cols-[20px_minmax(0,1fr)] gap-x-3 gap-y-1 text-[0.9375rem] text-ink-2 phone:col-span-2">
          <input
            ref={consentRef}
            id="f-consent"
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "e-consent" : undefined}
            className="mt-[3px] size-[18px] cursor-pointer"
          />
          <label htmlFor="f-consent" className="cursor-pointer">
            {copy.consent.before}{" "}
            <a href={privacyHref} className="text-ink underline underline-offset-[3px]">
              {copy.consent.link}
            </a>
            {copy.consent.after}
          </label>
          <div className="col-start-2">{err("consent")}</div>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3.5 border-t border-line pt-6">
        <p className="text-sm text-ink-3">{copy.note}</p>
        <Button type="submit" disabled={sending} className={cn(sending && "pointer-events-none opacity-60")}>
          {sending ? copy.sending : copy.submit}
        </Button>
      </div>
      <p role="status" className={cn("text-sm text-danger", status === "error" && "mt-4")}>
        {status === "error" ? fill(copy.sendError, { email: ownerEmail }) : ""}
      </p>
    </form>
  );
}
