# Spec: Personal website v1
Author: Claude, for Monzer Hweit (product owner). Status: draft.
Source: [intent.md](intent.md) (accepted in PR #1). Date: 2026-10-17.
Design reference: [design-reference.html](design-reference.html), also
published as a private preview at
https://claude.ai/artifact/QFMUXBWw9r64vu6pdqKdAU

## 1. Summary
A one-page personal website that shows who Monzer is, their projects,
experience and tech stack, with a contact form that delivers messages
to their email, a downloadable CV, and the legal pages German law
requires. It is a calm, typographic, monochrome design built with
Next.js and hosted on Vercel.

**Does it solve the intent's problem?** Yes. The intent's problem is
that there is no single place to see who Monzer is, what they have
built and how to reach them. The home page answers all three on one page, and
each project is understandable without opening GitHub (video, summary,
decisions, result).

## 2. Scope
In scope (v1): the home page, Impressum and Datenschutz pages, a 404
page, the contact form, the CV download, link previews.

Out of scope, each with its own intent later: blog, German version,
AI assistant, testimonials, certifications, talks, open-source list.

## 3. Requirements

### 3.1 Pages
| Page | URL | Purpose |
|---|---|---|
| Home | `/` | Everything in 3.2, one page with section anchors |
| Impressum | `/impressum` | Legal notice (§5 DDG) |
| Datenschutz | `/datenschutz` | Privacy policy (GDPR) |
| Not found | any other URL | Short message and a link home |

URLs stay English and unprefixed. When the German version comes, it is
added under `/de/...` so no existing link breaks.

### 3.2 Home page sections, in order
1. **Header** (sticky): name with "MH" mark (links to top), section
   links, GitHub and LinkedIn icons, Resume button. Below 900px: menu
   button instead of section links; GitHub and LinkedIn move into the
   menu below 560px.
2. **Hero**: name, one-line intro, buttons "See my work" (to Projects)
   and "Get in touch" (to Contact), photo, and a facts row: location,
   focus areas, availability status.
3. **Projects**: one row per project (see 3.3).
4. **About**: one statement and at most two short paragraphs.
5. **Experience**: roles, newest first; each with dates, location,
   title, company, one-line summary, at most three results, tools.
6. **Stack**: groups of tools; each group links to the projects that
   use it.
7. **Contact**: availability sentence, email address with a Copy
   button, location, the contact form, and GitHub and LinkedIn icons
   centered below the form.
8. **Footer**: one line with copyright and links to Impressum and
   Datenschutz.

### 3.3 Projects
Each project shows:
- Title and status (built with date, or "In progress")
- A video still (poster image) with a play button and duration
- Links: Watch demo, Try it, Code (each only when it exists)
- A two- or three-sentence description
- At most three decisions (topic + decision), one of which may be a
  result with a number
- Tools used

Rules:
- **Videos load only after a click.** Before that the page shows only
  the poster image, so no video host receives data about visitors who
  don't press play. Videos never autoplay and have captions.
- **Placeholder projects** are used while real ones are not ready
  (see 3.7).

### 3.4 Contact form
- Fields: name, email, message (10–2,000 characters, with a counter),
  and a checkbox confirming the details may be used to reply, linking
  to Datenschutz.
- Validation runs in the browser (errors shown next to each field)
  and again on the server.
- On send: the message is emailed to Monzer with the visitor's address
  as reply-to. It is **not stored** anywhere else.
- Success state: "Message sent." with the visitor's first name.
  Failure state: says it couldn't be sent and shows the email address
  as an alternative.
- Spam protection without third-party services: a hidden honeypot
  field, a minimum time before submit, and a rate limit per IP address.

### 3.5 CV
A PDF served from the site (for example `/Monzer-Hweit-CV.pdf`),
downloaded by the Resume button. It contains no home address and no
phone number.

### 3.6 Availability status
One status ("Open to work: roles and freelance projects") is defined
once in the content files and shown in the hero facts and the Contact
section.

### 3.7 Content and placeholders
- All text and data live in content files (MDX or JSON) in the repo:
  profile, status, projects, experience, stack, legal pages. Changing
  content never requires touching components.
- Placeholder entries are marked `placeholder: true`. **A production
  deploy fails while any placeholder content remains.** This enforces
  the intent's rule that the site is not shared publicly until real
  projects replace the placeholders.

### 3.8 Photo
- Until a photo exists, a placeholder card holds its place: rounded,
  light grey, soft shadow, "MH" initials.
- The real photo replaces the card and has **no card**: no background,
  corners or shadow. It is shown in grayscale. A photo with the
  background removed works best on the halftone ring.
- A real photo is required before the public launch.

### 3.9 Non-functional requirements
- **Accessibility**: WCAG 2.2 AA. Keyboard reachable, visible focus,
  skip link, labelled form fields, text contrast at least 4.5:1,
  reduced-motion respected, captions on videos.
- **Performance**: Lighthouse performance 95+ on mobile; Largest
  Contentful Paint under 2.5 s; no layout shift from fonts or images.
- **Privacy**: no cookies, no tracking, no analytics in v1, no
  requests to third parties when the page loads. The font is served
  from the site itself.
- **Link previews**: page title and description, a 1200×630 preview
  image for LinkedIn and other sites, Person structured data, sitemap
  and robots file.
- **Browsers**: current Chrome, Edge, Firefox and Safari, desktop and
  mobile. Works from 360px wide upward without sideways scrolling.

## 4. Design (UI/UX)
The [design reference](design-reference.html) shows everything below.
Its blue "Show changes" panel and the black notice bar are preview
tools, not part of the site.

### 4.1 Principles
- Calm, editorial, monochrome. Typography and spacing carry the
  design; color is almost absent.
- One signature visual: the halftone ring in the hero.
- Every section uses the same label-left, content-right grid.
- Content shows engineering thinking: decisions and measured results.

### 4.2 Color
| Token | Value | Use |
|---|---|---|
| `bg` | `#FFFFFF` | Page background |
| `surface` | `#F3F3F2` | Alternating section bands, soft buttons |
| `ink` | `#000000` | Headings, primary button |
| `ink-2` | `#3D3D3B` | Body text |
| `ink-3` | `#6B6B68` | Secondary text, captions |
| `ink-4` | `#9A9A96` | Decoration only, never text |
| `line` / `line-2` | `#E8E8E6` / `#D4D4D1` | Dividers, borders |
| `signal` | `#2F49D1` | Keyboard focus only |
| `live` | `#2E9E5B` | "Current" and "open to work" dots only |
| `danger` | `#B3261E` | Form errors only |

Light theme only in v1.

### 4.3 Typography
- One family: **Host Grotesk** (variable, weights 300–800), self-hosted,
  fallback `"Helvetica Neue", Arial, sans-serif`.
- Name: up to about 124px, weight 600, line height 0.9, letter spacing
  −0.055em. Section titles: up to 52px, weight 500, ending with a
  period ("Projects.").
- Body: 17px, line height 1.6, lines at most about 62 characters.
- Sizes scale fluidly between phone and desktop.

### 4.4 Layout and spacing
- Content width 1180px, side margins 20–48px.
- Grid: label column 4 parts, content column 8 parts. Hero 7/5,
  Contact 5/7.
- Section spacing 96–160px; white and `surface` bands alternate.
- Breakpoints: phone below 560px, tablet below 900px, desktop from
  900px. Below 900px all grids become one column.

### 4.5 Shapes and components
- **Buttons**: 8px corners, never pill-shaped. Primary black, secondary
  grey with a thin border. Height 46px (38px small).
- **Inputs**: 8px corners, thin border, black border and light blue
  glow on focus.
- **Icon buttons** (GitHub, LinkedIn): 44px squares with 8px corners
  under the form; 38px borderless in the header.
- **Text links**: underlined, the underline darkens on hover.
- **Cards**: only the contact form (20px corners) and project video
  stills (14px). The photo placeholder card uses 22px.
- **Icons**: 16px line icons, 1.8px stroke.
- **Tags** ("exploring", "in progress"): 4px corners, thin border.

### 4.6 Section details
- **Hero**: name and intro left, photo right, facts row across the
  full width at the bottom. On phones: text, then facts, then photo.
- **Projects**: title, status, video still and links in the left
  column, which stays in view while scrolling; description, decisions
  and tools on the right. Video stills are 16:9, with the duration
  bottom left and the play button bottom right.
- **Contact**: text, email and location left; form right; GitHub and
  LinkedIn icons centered below the form with "Or find me on".

### 4.7 Motion
- **Halftone ring**: one large ring of dots behind the whole hero,
  centered behind the name on desktop and behind the name and intro on
  phones. It **loops continuously**: slow and subtle, never competing
  with the text. Its exact motion (rotation, breathing or a wave
  through the dots) is chosen during the build from two or three
  quick prototypes.
  - It stays still when the visitor's system asks for reduced motion.
  - It pauses when the hero is off screen or the tab is hidden.
  - It must not drop the page below 60 frames per second on a
    mid-range phone.
- Elsewhere: hover fades of 0.2s, buttons press in slightly, the
  header gets a divider line after scrolling. Nothing else moves.

### 4.8 Writing
First person, plain and concrete. Results as numbers. Section titles
end with a period. Buttons say exactly what happens.

## 5. Technical design
- **Framework**: Next.js (App Router) with TypeScript and Tailwind CSS.
  Pages are static; only the contact form runs on the server.
- **Content**: MDX and JSON files in the repo, validated with a schema
  at build time (missing fields fail the build).
- **Font**: Host Grotesk through `next/font`, which downloads it at
  build time and serves it from the site.
- **Contact form**: a server endpoint validates the input, applies the
  spam checks and sends the email through a transactional email
  provider with an EU region and a data processing agreement (for
  example Resend). The API key is an environment variable, never in
  the repo.
- **Rate limit**: a Vercel Firewall rule on the contact endpoint.
- **Hosting**: Vercel, with server functions in the Frankfurt region
  (`fra1`) so form data is processed in the EU. Custom domain once
  bought.
- **Videos**: see open question 7.1.
- **Link preview image**: generated at build time with `next/og`.
- **Checks in CI**: type check, lint, build (including the placeholder
  check), and an accessibility check of the built pages.

## 6. Concerns (flagged for the product owner)
1. **Legal pages need a proper review.** The Impressum (§5 DDG) and
   Datenschutz must name everything that processes visitor data:
   Vercel (hosting, server logs with IP addresses), the email provider
   (contact form) and the video host, if any. This spec is not legal
   advice; use a reputable generator or a lawyer before launch.
2. **The consent checkbox** is not strictly required for answering a
   message (the legal basis is the visitor's request), but it makes
   the privacy notice explicit. Kept as designed; remove only after
   legal review.
3. **Your email address is shown on the page.** It helps people who
   prefer email but attracts spam. Alternative: show it only in the
   form's error state.
4. **The looping ring costs performance and attention.** The pause,
   reduced-motion and frame-rate rules in 4.7 keep it in check.
5. **Placeholder content must never go live.** Enforced by the build
   check in 3.7.

## 7. Open questions

### 7.1 Carried forward from the intent
- **Where are the demo videos hosted?** Not decided.
  *Recommendation:* self-host compressed MP4 files on the site (or
  Vercel Blob), so no third party sees visitors. Alternative:
  YouTube in privacy-enhanced mode, still loaded only after a click.
  Decide before real videos are added; placeholders don't need it.
- **What visual style should the site have?** **Answered** by section
  4 and the design reference.

### 7.2 New
- **Email address and domain**: which address receives messages and
  is shown on the page? It depends on the domain.
- **Email provider**: accept the recommendation in section 5?
- **Analytics**: none in v1 is assumed; "people contact me" is
  measured by the inbox. Confirm.
- **Real content**: bio, experience, projects, CV and photo are needed
  before launch.

## 8. Acceptance criteria
v1 is done when:
- [ ] All sections in 3.2 match the design reference at 360px, 768px
      and 1440px wide.
- [ ] A visitor can understand each project from its video, text and
      decisions without opening GitHub (intent success criterion).
- [ ] A test message sent through the form arrives in the inbox with
      the right reply-to address; invalid input and spam attempts are
      rejected (intent success criterion: people can contact me).
- [ ] The Resume button downloads the CV PDF.
- [ ] Impressum and Datenschutz are live and linked from every page.
- [ ] No cookies, and no third-party requests before a video is
      played.
- [ ] Lighthouse: performance 95+, accessibility 100, on mobile.
- [ ] Keyboard-only and screen reader walkthrough passes.
- [ ] Production build fails while placeholder content exists.
- [ ] The live site is on the custom domain, with link previews
      showing correctly on LinkedIn.

## 9. Design decisions made during review
| Decision | Instead of |
|---|---|
| Projects directly after the hero | After Experience |
| "Get in touch" button opens the form | Email link in the hero |
| Squared buttons (8px) | Pill-shaped buttons |
| No "Now building" card | Card on the photo |
| Photo without a card; card only as a placeholder | Photo always in a card |
| Ring behind the whole hero, looping | Ring that draws in once |
| Project media in the left column | Large video above each description |
| GitHub and LinkedIn in the header and under the form | List in the footer |
| One-line footer | Footer with name block and social list |
| Stack groups link to projects | Plain stack list |
