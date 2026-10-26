import { z } from "zod";

// Content rules from intent/spec.md 3.2–3.8. Parsed at build time in content/index.ts,
// so content that breaks a rule fails the build instead of reaching the page.

/** Marks an entry as stand-in content; a production build fails while any remain (spec 3.7). */
const placeholder = z.boolean().optional();

const text = z.string().trim().min(1);
const sitePath = z.string().regex(/^\/[^\s]*$/, "Must be a site path starting with /");
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM");
const projectId = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase-kebab-case");

export const siteSchema = z.object({
  name: text,
  initials: z.string().regex(/^[A-Z]{2,3}$/),
  role: text,
  description: text.max(160), // longer descriptions get cut off in search results
  cvPath: sitePath,
  // Absolute ("/#section") so the header works from every page, not only the home page.
  nav: z.array(z.object({ label: text, href: z.string().regex(/^\/#[a-z]+$/) })).min(1),
  social: z.array(
    z.object({ network: z.enum(["github", "linkedin"]), label: text, handle: text, href: z.url() }),
  ),
  legal: z.array(z.object({ label: text, href: sitePath })),
});

export const profileSchema = z.object({
  placeholder,
  intro: text.max(140),
  /** Focus areas, shown as a small row under the hero buttons. */
  keywords: z.array(text).min(1),
  location: z.object({ city: text, country: text }),
  statement: text,
  bio: z.array(text).min(1).max(2),
  email: z.email(),
  /** Grayscale photo, background removed (spec 3.8). Until set, a placeholder card shows. */
  photo: z.object({ src: sitePath, alt: text, width: z.int().positive(), height: z.int().positive() }).optional(),
});

export const statusSchema = z.object({
  placeholder,
  sentence: text,
});

const videoSchema = z.object({
  src: sitePath,
  captions: sitePath, // WebVTT; every demo video has captions (spec 3.3)
  poster: sitePath.optional(),
  duration: z.string().regex(/^\d{1,2}:[0-5]\d$/, "Use m:ss"),
});

export const projectSchema = z.object({
  placeholder,
  id: projectId,
  title: text,
  status: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("built"), date: text }),
    z.object({ kind: z.literal("in-progress") }),
  ]),
  summary: text,
  decisions: z.array(z.object({ topic: text, text })).min(1).max(3),
  tools: z.array(text).min(1),
  links: z.object({
    video: videoSchema.optional(),
    live: z.url().optional(),
    code: z.url().optional(),
  }),
  /** Drawn stand-in still used until a real poster image exists. */
  posterArt: z.enum(["rag", "sudoku", "flow"]).optional(),
});

export const jobSchema = z.object({
  placeholder,
  role: text,
  org: text,
  start: yearMonth,
  end: z.union([yearMonth, z.literal("present")]),
  location: text,
  summary: text,
  results: z.array(text).min(1).max(3),
  tools: z.array(text).min(1),
});

export const stackGroupSchema = z.object({
  placeholder,
  title: text,
  items: z.array(z.object({ name: text, tag: z.enum(["exploring", "in progress"]).optional() })).min(1),
  usedIn: z.array(projectId),
});

/** Section headings, intros and interface labels: the fixed copy around the content. */
export const sectionsSchema = z.object({
  hero: z.object({ primaryCta: text, secondaryCta: text }),
  projects: z.object({
    title: text,
    lede: text,
    built: text,
    inProgress: text,
    demo: text,
    live: text,
    code: text,
    videoTitle: text,
    videoClose: text,
    videoUnavailable: text,
  }),
  about: z.object({ title: text }),
  notFound: z.object({ title: text, body: text, home: text }),
  experience: z.object({ title: text, lede: text, current: text, present: text }),
  stack: z.object({ title: text, lede: text, usedIn: text }),
  contact: z.object({
    title: text,
    lede: text,
    emailLabel: text,
    copy: text,
    copied: text,
    locationLabel: text,
    elsewhere: text,
    form: z.object({
      name: z.object({ label: text, placeholder: text, required: text }),
      email: z.object({ label: text, placeholder: text, required: text, invalid: text }),
      message: z.object({ label: text, placeholder: text, tooShort: text, maxLength: z.int().positive() }),
      consent: z.object({ before: text, link: text, after: z.string(), required: text }),
      note: text,
      submit: text,
      sending: text,
      /** `{name}` is replaced with the visitor's first name, `{email}` with their address. */
      successTitle: text,
      successBody: text,
      sendAnother: text,
      /** `{email}` is replaced with the site owner's address. */
      sendError: text,
      /** Shown when the firewall's rate limit answers 429; `{email}` as above. */
      tooMany: text,
    }),
  }),
});

/** A legal page (spec 3.10), written in German. Texts come from a generator before launch. */
export const legalPageSchema = z.object({
  placeholder,
  title: text,
  sections: z.array(z.object({ heading: text, paragraphs: z.array(text).min(1) })).min(1),
});

export const contentSchema = z
  .object({
    site: siteSchema,
    sections: sectionsSchema,
    legal: z.object({ impressum: legalPageSchema, datenschutz: legalPageSchema }),
    profile: profileSchema,
    status: statusSchema,
    projects: z.array(projectSchema).min(1),
    experience: z.array(jobSchema).min(1),
    stack: z.array(stackGroupSchema).min(1),
  })
  .superRefine((content, ctx) => {
    // The intro is the page heading, so it has to carry the (first) name.
    const firstName = content.site.name.split(" ")[0];
    if (!content.profile.intro.includes(firstName)) {
      ctx.addIssue({ code: "custom", message: `Intro must contain the name "${firstName}"`, path: ["profile", "intro"] });
    }
    const ids = new Set<string>();
    content.projects.forEach((p, i) => {
      if (ids.has(p.id)) {
        ctx.addIssue({ code: "custom", message: `Duplicate project id "${p.id}"`, path: ["projects", i, "id"] });
      }
      ids.add(p.id);
    });
    content.stack.forEach((group, g) => {
      group.usedIn.forEach((id, i) => {
        if (!ids.has(id)) {
          ctx.addIssue({
            code: "custom",
            message: `Unknown project id "${id}" in stack group "${group.title}"`,
            path: ["stack", g, "usedIn", i],
          });
        }
      });
    });
  });

export type Content = z.infer<typeof contentSchema>;
export type Sections = z.input<typeof sectionsSchema>;
export type LegalPage = z.input<typeof legalPageSchema>;
export type Profile = z.input<typeof profileSchema>;
export type Status = z.input<typeof statusSchema>;
export type Project = z.input<typeof projectSchema>;
export type Job = z.input<typeof jobSchema>;
export type StackGroup = z.input<typeof stackGroupSchema>;
