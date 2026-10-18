import { content } from "@/content";

export function About() {
  const { profile, sections } = content;
  return (
    <section id="about" aria-labelledby="about-title" className="py-section">
      <div className="wrap grid items-start gap-x-14 gap-y-6 desk:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <header className="desk:sticky desk:top-[calc(var(--spacing-header)+32px)]">
          <h2 id="about-title" className="text-[clamp(2rem,1.3rem+2.4vw,3.25rem)] leading-[1.04] tracking-[-0.04em]">
            {sections.about.title}
          </h2>
        </header>
        <div>
          <p className="max-w-[32ch] text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)] leading-[1.28] tracking-[-0.03em] text-ink">
            {profile.statement}
          </p>
          <div className="mt-7 grid max-w-[62ch] gap-4">
            {profile.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
