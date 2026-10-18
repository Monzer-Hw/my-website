import { z } from "zod";

// Contact form rules (spec 3.4), shared by the form and the server. The server checks again:
// the browser's checks only help visitors, they protect nothing.

/** A human needs at least this long to fill in the form; faster submits are treated as bots. */
export const MIN_FILL_MS = 3000;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email().max(320),
  message: z.string().trim().min(MESSAGE_MIN).max(MESSAGE_MAX),
  consent: z.literal(true),
  /** Honeypot: hidden from people, so only bots fill it in. */
  website: z.string().optional(),
  /** When the form appeared, in ms since the epoch. */
  startedAt: z.number().int().positive(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type Check =
  | { kind: "ok"; data: ContactInput }
  | { kind: "invalid"; fields: string[] }
  | { kind: "spam"; reason: "honeypot" | "too-fast" };

/** Validates a submission and sorts out spam. `now` is passed in so the rule is testable. */
export function checkSubmission(raw: unknown, now: number): Check {
  // Spam checks come first: a bot gets the same "success" whether or not its other fields are valid.
  const candidate = (raw ?? {}) as Record<string, unknown>;
  if (typeof candidate.website === "string" && candidate.website.trim() !== "") {
    return { kind: "spam", reason: "honeypot" };
  }
  if (typeof candidate.startedAt === "number" && now - candidate.startedAt < MIN_FILL_MS) {
    return { kind: "spam", reason: "too-fast" };
  }
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { kind: "invalid", fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))] };
  }
  return { kind: "ok", data: parsed.data };
}
