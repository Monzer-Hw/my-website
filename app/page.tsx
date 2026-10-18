import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { content } from "@/content";
import { siteUrl } from "@/lib/site-url";

// Person structured data for search engines (spec 3.9).
function personJsonLd() {
  const { site, profile } = content;
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description: site.description,
    url: siteUrl().href,
    address: { "@type": "PostalAddress", addressLocality: profile.location.city, addressCountry: profile.location.country },
    sameAs: site.social.map((s) => s.href),
  };
  // Escape "<" so content can never close the script tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// Section order from intent/spec.md 3.2.
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd() }} />
      <Hero />
      <Projects />
      <About />
      <Experience />
      <Stack />
      <Contact />
    </>
  );
}
