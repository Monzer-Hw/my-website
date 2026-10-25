# Monzer Hweit: personal website

Portfolio site built with the AI-native SDLC playbook. Read these
before changing anything:
- `intent/intent.md`: what and why (accepted)
- `intent/spec.md`: requirements and UI/UX design (accepted)
- `intent/plan.md`: build phases, files, risks, proof (accepted)
- `intent/design-reference.html`: the agreed design, placeholder content

Topic rules live in `.claude/rules/`. Files with `paths:` load only
when Claude works on matching files:
- `git-conventions.md`: branches, commits, PRs, git hooks (always)
- `design.md`: theme, tokens, spec section 4 pointers (UI files)
- `content.md`: where text lives, placeholders (content and UI files)
- `nextjs.md`: Next.js 16 gotchas (`app/`, `components/`, `lib/`)
- `privacy.md`: privacy and legal, spec 3.9 and 3.10 (app code,
  content, config)
Before creating a file in a scoped folder, read its rules file first.

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
| Unit tests with coverage (thresholds enforced) | `npm run test:coverage` |
| Production build | `npm run build` |
| E2E + accessibility (Playwright, axe) | `npm run build && npm run test:e2e` |
| Full local check before a PR (lint, typecheck, coverage, build, e2e) | `npm run verify` |

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
- `components/hero/`: `HeroSphere` (WebGL dot sphere), `HalftoneRing`
  (2D canvas, fallback without WebGL), `IntroReveal` (intro from dot
  blocks on load), `Photo` (placeholder card until `profile.photo` is set)
- `components/media/`: `ProjectVideo` (still + "Watch demo", opens the
  player), `VideoDialog` (native `<dialog>`; the `<video>` exists only
  while open, so nothing loads before play), `VideoPoster`, `PosterArt`
  (drawn stand-in stills; spans only, they sit beside a button)
- `components/contact/`: `ContactForm` (validation, sending, success and
  error states, honeypot), `CopyButton`
- `app/api/contact/route.ts`: the only server code; validates, drops spam,
  emails through Resend
- `vercel.json`: functions run in Frankfurt (`fra1`)
- `content/`: all site text and data (rules in `.claude/rules/content.md`)
- `lib/cn.ts`: class names; `lib/placeholders.ts`: launch guard;
  `lib/dates.ts`: `YYYY-MM` formatting; `lib/contact.ts`: form rules and
  spam checks shared by form and server; `lib/email.ts`: Resend HTTP API
  (no SDK), env vars in `.env.example`
- `scripts/`: `git-hooks.mjs` (checks for the git hooks); more in later
  phases (see plan section 2)
- `tests/unit/`: Vitest; `tests/e2e/`: Playwright

## Rules
- Follow the spec. If the build must deviate, update `intent/plan.md`
  (or the spec) in the same commit.
- When descriptive docs (this file, `AGENTS.md`, `.claude/rules/`,
  code comments) and the existing code disagree, follow the
  conventions in the existing code, and in your final reply point out
  each inconsistency you found between the docs and the code. The
  intent files (`intent/*.md`) are still the source of truth for what
  to build.
- Never commit secrets; `.env.example` lists the variable names.
