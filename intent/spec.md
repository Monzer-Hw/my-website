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
1. **Header** (sticky): section links on the left, GitHub and LinkedIn
   icons and Resume button on the right; no name or "MH" mark (the hero
   carries the name). Below 900px: menu
   button instead of section links; GitHub and LinkedIn move into the
   menu below 560px.
2. **Hero**: one intro sentence that starts with the name ("I’m Monzer
   Hweit, an AI engineer building…"; it is the page heading, at intro
   size, at most 140 characters), buttons "See my work" (to Projects)
   and "Get in touch" (to Contact), and photo.
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
One status sentence ("I'm open to new roles and freelance projects.") is
defined once in the content files and shown in the Contact section.

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
  background removed works best on the dot sphere.
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

### 3.10 Legal requirements (Germany)
Based on public guidance (sources at the end of this section). No
lawyer is involved; the legal texts come from a reputable generator.

**Impressum (§5 DDG): required.** The duty applies to sites run
"geschäftsmäßig", meaning regularly and with an economic interest. A
portfolio that promotes Monzer to employers and clients counts as
self-promotion, so it is treated as required. It contains:
- Full name
- An address where Monzer can actually be served legal post. A P.O.
  box is not allowed; a c/o address only if post really reaches Monzer
  there and they can be met there. In practice: the home address.
- Email address, and any further contact details the generator asks for
- No VAT ID or register entry, since no business is registered

**Datenschutzerklärung (GDPR Art. 13): required**, because the contact
form and the hosting process personal data. It covers:
- Who is responsible (Monzer, with contact details)
- Hosting: Vercel processes server logs including IP addresses. Vercel
  is certified under the EU-US Data Privacy Framework and its Data
  Processing Addendum is part of its terms; name the transfer basis.
- Contact form: what is collected, why, the legal basis (answering the
  visitor's request), the email provider that delivers it, and how
  long messages are kept
- Fonts: served from the site itself, so no data goes to Google
- Videos: depends on the hosting decision (8.1); a third-party host
  must be named
- Visitors' rights (access, correction, deletion, objection) and the
  right to complain to a data protection authority

**Cookie banner: not needed.** Consent under §25 TDDDG is only needed
for storage or access on the visitor's device that isn't strictly
necessary. The site sets no cookies and loads no third-party content
before a click, so no banner is shown. Adding analytics or embeds
later would change this.

**How the texts are made:** with the free generators by attorney
Dr. Thomas Schwenke (datenschutz-generator.de), which are free for
private individuals and require a link back to the generator. Check
the current terms before use. Regenerate the texts whenever a service
is added or changed.

Sources:
[e-recht24: Impressumspflicht](https://e-recht24.de/artikel/datenschutz/209.html),
[IHK Chemnitz: Impressumspflicht](https://www.ihk.de/chemnitz/recht-und-steuern/rechtsinformationen/internetrecht/pflichtangaben-im-internet-die-impressumspflicht-4401580),
[e-recht24: ladungsfähige Anschrift](https://e-recht24.de/impressum/13082-ladungsfaehige-anschrift.html),
[e-recht24: c/o-Adresse](https://www.e-recht24.de/impressum/8369-impressum-c-o-adresse.html),
[e-recht24: Kontaktformular](https://www.e-recht24.de/dsg/12687-kontaktformular.html),
[e-recht24: TDDDG](https://www.e-recht24.de/datenschutz/12834-tdddg.html),
[Vercel: compliance](https://vercel.com/docs/security/compliance),
[datenschutz-generator.de: Impressum](https://datenschutz-generator.de/impressum).

## 4. Design (UI/UX)
The [design reference](design-reference.html) shows everything below.
Its blue "Show changes" panel and the black notice bar are preview
tools, not part of the site.

### 4.1 Principles
- Calm, editorial, monochrome. Typography and spacing carry the
  design; color is almost absent.
- One signature visual: the dot sphere in the hero.
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
| `live` | `#2E9E5B` | "Current" dots only |
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
- **Hero**: intro sentence and buttons left, photo right. On phones:
  text, then photo.
- **Projects**: title, status, video still and links in the left
  column, which stays in view while scrolling; description, decisions
  and tools on the right. Video stills are 16:9, with the duration
  bottom left and the play button bottom right.
- **Contact**: text, email and location left; form right; GitHub and
  LinkedIn icons centered below the form with "Or find me on".

### 4.7 Motion
- **Dot sphere** (revised by the owner after phase 9; replaces the
  halftone ring): a slowly turning sphere of fine dots that folds into
  ribbons, behind the whole hero, right of the intro on desktop and
  behind the intro on phones. It **loops continuously**: slow
  and subtle, never competing with the text; dots behind the text column
  are fainter. Where WebGL is missing or runs without a GPU, the
  halftone ring (sweep) shows instead.
  - It stays still when the visitor's system asks for reduced motion.
  - It pauses when the hero is off screen or the tab is hidden.
  - It must not drop the page below 60 frames per second on a
    mid-range phone.
- **Intro reveal**: on load, the letters of the intro stream in from
  left to right (90 per second); each first appears as a flickering
  block of dots, then resolves into its letter (about two seconds in
  all). Screen readers get the whole
  sentence at once; the text is plain text before and after; skipped for
  reduced motion.
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
- **Videos**: see open question 8.1.

Implementation details (exact libraries, CI checks, rate-limit setup,
file structure, order of work) belong in `plan.md` in Stage 3.

## 6. Concerns
Each concern has an owner who decides or acts on it. In this project
Monzer is the product owner and the owner of every policy; Claude
carries out the checks during the build.

| # | Concern | Owner | Decision or action |
|---|---|---|---|
| 1 | **The Impressum makes the home address public** (3.10). This conflicts with keeping the address off the CV. | Monzer | Decide before launch: home address, or a c/o address where post really reaches Monzer. |
| 2 | **Legal texts must stay accurate.** They must name every service that processes visitor data. | Monzer | Generate both texts before launch; regenerate when a service changes. Claude checks the list of services against the build. |
| 3 | **The consent checkbox** isn't strictly required (the legal basis is the visitor's request), but it makes the privacy notice explicit. | Monzer | Keep as designed, or remove. |
| 4 | **The email address is shown on the page.** It helps people who prefer email but attracts spam. | Monzer | Keep, or show it only in the form's error state. |
| 5 | **The looping ring costs performance and attention.** | Monzer (design), Claude (checks) | The rules in 4.7 apply; Claude measures frame rate and Lighthouse during the build. |
| 6 | **Placeholder content must never go live.** | Monzer | Enforced by the build check in 3.7. |

## 7. Skills and policies
The playbook expects the spec to be guided by the organisation's
brand, security, compliance and UX policies, written as Claude
skills. None exist for this project, so the rules are written into
this spec instead:
- Brand and UX: section 4
- Accessibility, performance and privacy: section 3.9
- Compliance: section 3.10

Candidates to turn into skills during the build, if they prove useful
across sessions: a **design-system skill** from section 4, and a
**privacy and legal checklist skill** from 3.9 and 3.10.

## 8. Open questions

### 8.1 Carried forward from the intent
- **Where are the demo videos hosted?** Not decided.
  *Recommendation:* self-host compressed MP4 files on the site (or
  Vercel Blob), so no third party sees visitors. Alternative:
  YouTube in privacy-enhanced mode, still loaded only after a click.
  Decide before real videos are added; placeholders don't need it.
- **What visual style should the site have?** **Answered** by section
  4 and the design reference.

### 8.2 New
- **Email address and domain**: which address receives messages and
  is shown on the page? It depends on the domain.
- **Email provider**: accept the recommendation in section 5?
- **Analytics**: none in v1 is assumed; "people contact me" is
  measured by the inbox. Confirm.
- **Real content**: bio, experience, projects, CV and photo are needed
  before launch.

## 9. Acceptance criteria
v1 is done when:
- [ ] All sections in 3.2 match the design reference at 360px, 768px
      and 1440px wide.
- [ ] A visitor can understand each project from its video, text and
      decisions without opening GitHub (intent success criterion).
- [ ] A test message sent through the form arrives in the inbox with
      the right reply-to address; invalid input and spam attempts are
      rejected (intent success criterion: people can contact me).
- [ ] The Resume button downloads the CV PDF.
- [ ] Impressum and Datenschutz, made with the generator, are live,
      linked from every page, and name every service in use (3.10).
- [ ] No cookies, and no third-party requests before a video is
      played.
- [ ] Lighthouse: performance 95+, accessibility 100, on mobile.
- [ ] Keyboard-only and screen reader walkthrough passes.
- [ ] Production build fails while placeholder content exists.
- [ ] The live site is on the custom domain, with link previews
      showing correctly on LinkedIn.

## 10. Design decisions made during review
| Decision | Instead of |
|---|---|
| Projects directly after the hero | After Experience |
| "Get in touch" button opens the form | Email link in the hero |
| Squared buttons (8px) | Pill-shaped buttons |
| No "Now building" card | Card on the photo |
| Photo without a card; card only as a placeholder | Photo always in a card |
| Ring behind the whole hero, looping | Ring that draws in once |
| Dot sphere behind the hero, ring as fallback (after phase 9) | Halftone ring |
| Intro revealed from dot blocks on load (after phase 9) | Static intro |
| Intro sentence with the name as the page heading, no big name (after phase 9) | Large two-line name above the intro |
| No facts row in the hero (after phase 9) | Location, focus and status row under the hero |
| No name or "MH" mark in the header (after phase 9) | Name with mark linking home |
| Project media in the left column | Large video above each description |
| GitHub and LinkedIn in the header and under the form | List in the footer |
| One-line footer | Footer with name block and social list |
| Stack groups link to projects | Plain stack list |
