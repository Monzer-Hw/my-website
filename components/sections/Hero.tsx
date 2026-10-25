import { HeroSphere } from "@/components/hero/HeroSphere";
import { IntroReveal } from "@/components/hero/IntroReveal";
import { Photo } from "@/components/hero/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { content } from "@/content";

export function Hero() {
  const { site, profile, sections } = content;
  const [first, ...rest] = site.name.split(" ");

  return (
    <section
      aria-labelledby="name"
      className="relative overflow-hidden pt-[clamp(40px,6vw,88px)] pb-[clamp(56px,7vw,96px)]"
    >
      <HeroSphere />
      <div className="wrap relative grid grid-cols-1 items-center gap-12 desk:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          <h1
            id="name"
            className="text-[clamp(3.5rem,1.6rem+7.4vw,7.75rem)] leading-[0.9] font-semibold tracking-[-0.055em]"
          >
            <span className="block">{first}</span> <span className="block">{rest.join(" ")}</span>
          </h1>
          <IntroReveal
            text={profile.intro}
            className="mt-8 max-w-[30ch] text-[clamp(1.25rem,1.05rem+0.7vw,1.625rem)] leading-[1.35] tracking-[-0.015em] text-ink-2"
          />
          <div className="mt-8 flex flex-wrap gap-2.5">
            <ButtonLink href="#projects">{sections.hero.primaryCta}</ButtonLink>
            <ButtonLink href="#contact" variant="soft">
              {sections.hero.secondaryCta}
              <Icon name="arrow" />
            </ButtonLink>
          </div>
        </div>

        <Photo />
      </div>
    </section>
  );
}
