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
- `app/`: routes, layout, global styles
- `components/`, `content/`, `lib/`, `scripts/`: added from phase 2 on
  (see plan section 2)
- `tests/unit/`: Vitest; `tests/e2e/`: Playwright

## Rules
- Follow the spec. If the build must deviate, update `intent/plan.md`
  (or the spec) in the same commit.
- All site text and data live in `content/`, never hard-coded in
  components (from phase 3).
- No cookies, trackers or third-party requests on page load (spec 3.9).
- Never commit secrets; `.env.example` lists the variable names.
- Light theme only; colors, type and spacing come from the tokens in
  `app/globals.css` (from phase 2).
