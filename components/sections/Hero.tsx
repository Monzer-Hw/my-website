import { HeroSphere } from "@/components/hero/HeroSphere";
import { IntroReveal } from "@/components/hero/IntroReveal";
import { Photo } from "@/components/hero/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { content } from "@/content";

export function Hero() {
  const { site, profile, sections } = content;

  return (
    <section
      aria-labelledby="name"
      className="relative overflow-hidden pt-[clamp(40px,6vw,88px)] pb-[clamp(56px,7vw,96px)]"
    >
      <HeroSphere />
      <div className="wrap relative grid grid-cols-1 items-center gap-12 desk:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          {/* The intro sentence, which starts with the name (in bold), is the page heading, at intro size. */}
          <IntroReveal
            as="h1"
            id="name"
            text={profile.intro}
            strong={site.name.split(" ")[0]}
            className="max-w-[34ch] text-[clamp(1.25rem,1.05rem+0.7vw,1.625rem)] leading-[1.35] font-normal tracking-[-0.015em] text-pretty text-ink-2"
          />
          <div className="mt-8 flex flex-wrap gap-2.5">
            <ButtonLink href="#projects">{sections.hero.primaryCta}</ButtonLink>
            <ButtonLink href="#contact" variant="soft">
              {sections.hero.secondaryCta}
              <Icon name="arrow" />
            </ButtonLink>
          </div>
        </div>

        <Photo className="order-3 desk:order-none" />

        {/* Small focus keywords, where the facts row used to be: under the buttons, full width. */}
        <ul className="order-2 flex list-none flex-wrap gap-x-2 gap-y-1 text-sm leading-[1.4] text-ink-3 desk:order-none desk:col-span-2">
          {profile.keywords.map((keyword, i) => (
            <li key={keyword} className="whitespace-nowrap">
              {keyword}
              {i < profile.keywords.length - 1 && (
                <span aria-hidden="true" className="ml-2">
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
