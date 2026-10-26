import type { Profile } from "./schema";

// PLACEHOLDER: copied from intent/design-reference.html. Replace with real text before launch.
export const profile: Profile = {
  placeholder: true,
  intro:
    "I’m Monzer Hweit, an AI engineer building retrieval systems, LLM pipelines and automations that keep working after the demo.",
  location: { city: "Düsseldorf area", country: "Germany" },
  statement:
    "I build AI systems that companies can actually run: retrieval over messy documents, LLM services with clear contracts, and automations that save people real hours.",
  bio: [
    "I started in data science, training text classifiers for customer support teams. Once large language models arrived, the hard part moved from the model to everything around it: getting clean data in, retrieving the right context, and knowing whether an answer is good. That's the work I enjoy most.",
    "Today I work as an AI engineer on document intelligence and internal assistants. I write the spec before the code, keep services typed and tested, and design provider-agnostic interfaces so a new model is a config change, not a rewrite.",
  ],
  email: "hello@example.com",
  photo: { src: "/photo/monzer.png", alt: "Portrait of Monzer Hweit", width: 1122, height: 1402 },
};
