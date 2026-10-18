// Site-wide constants: real data, not placeholders. Validated by siteSchema in content/index.ts.

export const site = {
  name: "Monzer Hweit",
  initials: "MH",
  role: "AI Engineer",
  /** Search results and link previews (spec 3.9). */
  description:
    "AI engineer building retrieval systems, LLM pipelines and automations that keep working after the demo.",
  cvPath: "/cv/Monzer-Hweit-CV.pdf",
  nav: [
    { label: "Projects", href: "/#projects" },
    { label: "About", href: "/#about" },
    { label: "Experience", href: "/#experience" },
    { label: "Stack", href: "/#stack" },
    { label: "Contact", href: "/#contact" },
  ],
  social: [
    { network: "github", label: "GitHub", handle: "Monzer-Hw", href: "https://github.com/Monzer-Hw" },
    { network: "linkedin", label: "LinkedIn", handle: "monzer-hweit", href: "https://www.linkedin.com/in/monzer-hweit" },
  ],
  legal: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
  ],
} as const;

export type SocialNetwork = (typeof site.social)[number]["network"];
