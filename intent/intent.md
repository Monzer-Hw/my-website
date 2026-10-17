# Intent: Personal website
Author: Monzer Hweit (AI Engineer). Status: draft.

## Problem
My work currently lives only in GitHub repositories and on LinkedIn.
People who come across me (recruiters, potential clients, fellow
engineers) have no quick way to see what I have built or how I
approach AI engineering problems.

## Proposed outcome
An attractive, professional personal website that presents who I am,
my projects, my experience and my tech stack, and makes it easy to
get in touch. This intent covers v1 only: a static portfolio. Later
stages are covered by their own intent documents.

Goals, in priority order:
1. Showcase my projects
2. Attract inbound opportunities (roles, freelance, collaborations)
3. Act as a single hub for CV, links and contact

v1 is successful when:
- It is live and I am proud to share the link
- Visitors understand my projects without opening GitHub
- I get contacted through the site within 3 months of launch
  (measured with cookieless analytics and a site-specific contact path)

## Affected users and systems
- Visitors: everyone in the industry: companies, recruiters and
  hiring managers, freelance or consulting clients, technical peers.
  The site speaks to all of them, but the hero leads with one clear
  positioning line about what I build.
- Existing presence: GitHub (Monzer-Hw), LinkedIn (monzer-hweit).
  Most traffic is expected via links shared on LinkedIn.
- Repositories and demo videos of the projects to be showcased

## v1 scope
Sections:
- **Hero**: one-line positioning statement, availability status
  (e.g. "Open to roles & freelance"), calls to action:
  View projects · Download CV · Contact
- **About**: short bio and how I approach AI engineering
- **Projects**: 3–4 featured projects. Each card has:
  - title and one-line problem statement
  - my role
  - stack tags
  - one concrete result or metric
  - links: demo video · live demo · GitHub (where available)
  - muted preview loop or poster image; full demo video on click,
    with captions
- **Case studies**: detail pages for the 2–3 strongest projects
  (architecture diagram, model and design choices, evaluation,
  what I would improve)
- **Experience**: timeline of roles with 2–3 impact bullets each
- **Tech stack**: grouped by category (e.g. LLMs & agents, ML,
  backend, infra, data), linked to the projects that use it.
  No skill-percentage bars.
- **Contact**: email link and LinkedIn (no contact form in v1)
- **CV**: downloadable PDF (without home address or phone number)
- **Legal**: Impressum and Datenschutzerklärung

Quality bar:
- Responsive, fast, accessible, dark mode
- Open Graph images and meta descriptions per page (good LinkedIn
  link previews), Person structured data
- Cookieless analytics (e.g. Vercel Web Analytics)

## Out of scope
Each of these gets its own intent document in a later stage:
- "Ask about me" AI assistant
- Blog / writing
- German version
- Extras: testimonials, certifications, talks, open-source
  contributions, contact form

## Constraints
- Hosting on Vercel; a custom domain will be bought (ideally before
  launch, so shared links and the contact address stay stable)
- Proposed stack: Next.js + Tailwind CSS + MDX (content as files),
  so later stages can build on v1 without a rewrite
- English only; URL structure leaves room for other languages
  without breaking links
- Based in Germany: an Impressum (§5 DDG, the site is business-like)
  and a privacy policy (GDPR; Vercel processes visitor IPs) are
  most likely required. To be confirmed; not legal advice.
- Demo videos must not set third-party cookies without consent:
  self-host, or use privacy-enhanced YouTube embeds with click-to-load

## Open questions
- Positioning line: one sentence on who I am and what I build
- Which 3–4 projects are featured in v1, and which get case studies?
- Visual direction (e.g. minimal/editorial, dark/technical,
  bold/colorful) and reference sites I like
- Video hosting: self-hosted files or YouTube (privacy-enhanced)?
- Domain name
