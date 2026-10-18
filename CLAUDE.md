# Monzer Hweit: personal website

Portfolio site built with the AI-native SDLC playbook. Read these
before changing anything:
- `intent/intent.md`: what and why (accepted)
- `intent/spec.md`: requirements and UI/UX design (accepted)
- `intent/plan.md`: build phases, files, risks, proof (accepted)
- `intent/design-reference.html`: the agreed design, placeholder content

Version control rules live in `.claude/rules/git-conventions.md`.

@AGENTS.md

## Stack
Next.js 16 (App Router, Turbopack, `cacheComponents`), React 19,
TypeScript 5, Tailwind CSS 4 (via `@tailwindcss/turbopack` in
`next.config.ts`, no PostCSS config), npm, Node 24.

## Commands
| Task | Command |
|---|---|
| Dev server | `npm run dev` |
| Typecheck | `npm run typecheck` |
| Lint | `npm run lint` |
| Unit tests (Vitest) | `npm test` |
| Production build | `npm run build` |
| E2E + accessibility (Playwright, axe) | `npm run build && npm run test:e2e` |

First run of e2e tests needs a browser: `npx playwright install chromium`.
CI (`.github/workflows/ci.yml`) runs all of the above plus Lighthouse
(`lighthouserc.json`: performance ≥ 0.95, accessibility 1.0, mobile).

## Layout
- `app/`: routes, root layout (font, skip link, header, footer),
  `globals.css` with the Tailwind `@theme` tokens
- `components/ui/`: primitives (`Icon`, `Button`/`ButtonLink`,
  `IconLink`, `TextLink`, `Tag`)
- `components/site/`: page frame (`Header`, `HeaderShell`,
  `MobileMenu`, `Footer`, `SocialLinks`)
- `components/sections/`: home sections in spec order (`Hero`,
  `Projects`/`ProjectRow`, `About`, `Experience`, `Stack`, `Contact`,
  `SectionHeading`)
- `components/hero/`: `HalftoneRing` (canvas), `Photo` (placeholder card
  until `profile.photo` is set)
- `components/media/`: `ProjectVideo` (still + "Watch demo", opens the
  player), `VideoDialog` (native `<dialog>`; the `<video>` exists only
  while open, so nothing loads before play), `VideoPoster`, `PosterArt`
  (drawn stand-in stills; spans only, they sit beside a button)
- `components/contact/`: `ContactForm` (validation, sending, success and
  error states, honeypot), `CopyButton`
- `app/api/contact/route.ts`: the only server code; validates, drops spam,
  emails through Resend. Stores nothing; never logs personal data
- `vercel.json`: functions run in Frankfurt (`fra1`). The contact rate
  limit (5 POSTs per IP per 10 min, then 429) is a Vercel Firewall rule
  on the project, not in the repo
- `content/`: all site text and data (see Content below)
- `lib/cn.ts`: class names; `lib/placeholders.ts`: launch guard;
  `lib/dates.ts`: `YYYY-MM` formatting; `lib/contact.ts`: form rules and
  spam checks shared by form and server; `lib/email.ts`: Resend HTTP API
  (no SDK), env vars in `.env.example`
- `scripts/`: added in later phases (see plan section 2)
- `tests/unit/`: Vitest; `tests/e2e/`: Playwright

## Tokens (use these, never raw values)
Colors `bg surface ink ink-2 ink-3 ink-4 line line-2 signal live danger`
(e.g. `text-ink-3`, `bg-surface`), plus `poster poster-2 poster-line
poster-ink poster-text` for the dark video stills only; radii `rounded-tag|ctl|media|card|photo`;
breakpoints `phone:` (560px) and `desk:` (900px); `wrap` utility for the
page column; spacing `h-header`, `py-section`, `px-gutter`.

## Content
- Files: `site.ts` (name, nav, links), `sections.ts` (headings,
  ledes, button and form labels), `profile.ts`, `status.ts`,
  `projects.ts`, `experience.ts`, `stack.ts`; rules in `schema.ts`
  (Zod, limits from spec 3.2–3.8).
- Components import `content` from `@/content` (validated at build).
  Invalid content fails `next build` with the field path.
- Entries marked `placeholder: true` are stand-ins. With
  `VERCEL_ENV=production` the build fails while any remain (spec 3.7);
  previews and local builds pass. Remove the flag only with real content.

## Next.js 16 gotchas
- `cacheComponents` is on: `new Date()`, `Math.random()` and similar
  fail the prerender. Put them in a `"use cache"` function with an
  explicit `cacheLife(...)`, or in a Client Component.

## Rules
- Follow the spec. If the build must deviate, update `intent/plan.md`
  (or the spec) in the same commit.
- All site text and data live in `content/`, never hard-coded in
  components.
- No cookies, trackers or third-party requests on page load (spec 3.9).
- Never commit secrets; `.env.example` lists the variable names.
- Light theme only; colors, type and spacing come from the tokens in
  `app/globals.css`.
