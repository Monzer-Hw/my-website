import type { Sections } from "./schema";

// Fixed copy around the content: headings, intros and interface labels (design reference).
export const sections: Sections = {
  hero: { primaryCta: "See my work", secondaryCta: "Get in touch" },
  projects: {
    title: "Projects.",
    lede: "Projects where I owned the design from spec to code, with the decisions that shaped them.",
    built: "Built",
    inProgress: "In progress",
    demo: "Watch demo",
    live: "Try it",
    code: "Code",
  },
  about: { title: "About." },
  experience: {
    title: "Experience.",
    lede: "Where I've worked and what changed because of it.",
    current: "Current role",
    present: "now",
  },
  stack: { title: "Stack.", lede: "What I reach for, grouped by the problem it solves.", usedIn: "Used in" },
  contact: {
    title: "Let's talk.",
    lede: "Send a message and I'll get back to you.",
    emailLabel: "Prefer email?",
    copy: "Copy",
    copied: "Copied",
    locationLabel: "Based in",
    elsewhere: "Or find me on",
    form: {
      name: { label: "Name", placeholder: "Jane Doe", required: "Enter your name." },
      email: {
        label: "Email",
        placeholder: "jane@company.com",
        required: "Enter your email address.",
        invalid: "Enter an email address like jane@company.com.",
      },
      message: {
        label: "Message",
        placeholder: "What are you working on, and how can I help?",
        tooShort: "Write a message of at least 10 characters.",
        maxLength: 2000,
      },
      consent: {
        before: "I agree that my details are used to answer this message, as described in the",
        link: "privacy policy",
        after: ".",
        required: "Tick the box so I can use your details to reply.",
      },
      note: "I usually reply within a few days.",
      submit: "Send message",
      notConnected: "Sending isn't connected yet. Until it is, please use the email address on the left.",
    },
  },
};
