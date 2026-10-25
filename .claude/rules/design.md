---
paths:
  - "app/**/*.{tsx,css}"
  - "components/**"
---

# Design rules

The design is `intent/spec.md` section 4; `intent/design-reference.html`
shows it with placeholder content. Read the spec section you touch:
color 4.2, typography 4.3, layout and spacing 4.4, shapes and
components 4.5, section details 4.6, motion 4.7. Accessibility and
performance targets are in 3.9.

- Light theme only; colors, type and spacing come from the tokens in
  `app/globals.css`.

## Tokens (use these, never raw values)
Colors `bg surface ink ink-2 ink-3 ink-4 line line-2 signal live danger`
(e.g. `text-ink-3`, `bg-surface`), plus `poster poster-2 poster-line
poster-ink poster-text` for the dark video stills only; radii `rounded-tag|ctl|media|card|photo`;
breakpoints `phone:` (560px) and `desk:` (900px); `wrap` utility for the
page column; spacing `h-header`, `py-section`, `px-gutter`.
