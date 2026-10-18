import type { Content } from "@/content/schema";

type Page = Content["legal"]["impressum"];

/** A legal page in German (spec 3.10): a plain reading layout on the site's grid. */
export function LegalPage({ page }: { page: Page }) {
  return (
    <article lang="de" className="wrap py-section">
      <h1 className="text-[clamp(2rem,1.3rem+2.4vw,3.25rem)] leading-[1.04] tracking-[-0.04em]">{page.title}</h1>
      <div className="mt-12 grid max-w-[65ch] gap-9">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-[1.1875rem] tracking-[-0.01em]">{section.heading}</h2>
            <div className="mt-3 grid gap-2.5">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
