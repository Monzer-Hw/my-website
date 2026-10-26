---
paths:
  - "content/**"
  - "components/**"
  - "app/**/*.tsx"
---

# Content rules

- All site text and data live in `content/`, never hard-coded in
  components (spec 3.7). Writing style: spec 4.8.
- Files: `site.ts` (name, nav, links), `sections.ts` (headings,
  ledes, button and form labels), `profile.ts`, `status.ts`,
  `projects.ts`, `experience.ts`, `stack.ts`, `legal.ts` (Impressum
  and Datenschutz text); rules in `schema.ts` (Zod, limits from spec
  3.2–3.8).
- Components import `content` from `@/content` (validated at build).
  Invalid content fails `next build` with the field path.
- Entries marked `placeholder: true` are stand-ins. With
  `VERCEL_ENV=production` the build fails while any remain (spec 3.7);
  previews and local builds pass. Remove the flag only with real content.
