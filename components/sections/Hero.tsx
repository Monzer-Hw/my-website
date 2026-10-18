import type { ReactNode } from "react";
import { HalftoneRing } from "@/components/hero/HalftoneRing";
import { Photo } from "@/components/hero/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { content } from "@/content";

export function Hero() {
  const { site, profile, status, sections } = content;
  const [first, ...rest] = site.name.split(" ");

  return (
    <section
      aria-labelledby="name"
      className="relative overflow-hidden pt-[clamp(40px,6vw,88px)] pb-[clamp(56px,7vw,96px)]"
    >
      <HalftoneRing />
      <div className="wrap relative grid grid-cols-1 items-center gap-12 desk:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          <h1
            id="name"
            className="text-[clamp(3.5rem,1.6rem+7.4vw,7.75rem)] leading-[0.9] font-semibold tracking-[-0.055em]"
          >
            <span className="block">{first}</span> <span className="block">{rest.join(" ")}</span>
          </h1>
          <p className="mt-8 max-w-[30ch] text-[clamp(1.25rem,1.05rem+0.7vw,1.625rem)] leading-[1.35] tracking-[-0.015em] text-ink-2">
            {profile.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <ButtonLink href="#projects">{sections.hero.primaryCta}</ButtonLink>
            <ButtonLink href="#contact" variant="soft">
              {sections.hero.secondaryCta}
              <Icon name="arrow" />
            </ButtonLink>
          </div>
        </div>

        <Photo className="order-3 desk:order-none" />

        <ul className="order-2 grid list-none gap-3.5 border-t border-line pt-5 phone:grid-cols-3 phone:gap-x-7 phone:gap-y-5 desk:order-none desk:col-span-2">
          <Fact icon={<Icon name="pin" className="mt-0.5 text-ink-3" />} title={profile.location.city} detail={profile.location.country} />
          <Fact icon={<Icon name="layers" className="mt-0.5 text-ink-3" />} title={profile.focus.title} detail={profile.focus.detail} />
          <Fact
            icon={<span aria-hidden="true" className="mx-1 mt-1.5 block size-2 rounded-full bg-live" />}
            title={status.title}
            detail={status.detail}
          />
        </ul>
      </div>
    </section>
  );
}

function Fact({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return (
    <li className="grid grid-cols-[16px_minmax(0,1fr)] content-start gap-x-2.5 text-sm leading-[1.4]">
      <span className="row-span-2 flex">{icon}</span>
      <strong className="font-medium text-ink">{title}</strong>
      <span className="text-ink-3">{detail}</span>
    </li>
  );
}
