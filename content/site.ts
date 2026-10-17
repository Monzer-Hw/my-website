// Site-wide constants. Validation with Zod joins in phase 3 (content model).

export const site = {
  name: "Monzer Hweit",
  initials: "MH",
  cvPath: "/cv/Monzer-Hweit-CV.pdf",
  nav: [
    { label: "Projects", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Stack", href: "#stack" },
    { label: "Contact", href: "#contact" },
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
