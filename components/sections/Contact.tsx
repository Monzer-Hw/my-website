import { ContactForm } from "@/components/contact/ContactForm";
import { CopyButton } from "@/components/contact/CopyButton";
import { SocialLinks } from "@/components/site/SocialLinks";
import { content } from "@/content";

export function Contact() {
  const { profile, status, site, sections } = content;
  const copy = sections.contact;
  const privacy = site.legal.find((l) => l.href === "/datenschutz")?.href ?? "/datenschutz";

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-surface py-section">
      <div className="wrap grid items-start gap-x-[72px] gap-y-10 desk:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <header>
          <h2 id="contact-title" className="text-[clamp(2rem,1.3rem+2.4vw,3.25rem)] leading-[1.04] tracking-[-0.04em]">
            {copy.title}
          </h2>
          <p className="mt-[18px] max-w-[56ch] text-[1.1875rem] leading-[1.55] text-ink-3">
            {status.sentence} {copy.lede}
          </p>
          <dl className="mt-9 border-t border-line-2">
            <div className="flex min-h-[60px] flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line-2 py-3">
              <dt className="text-[0.9375rem] text-ink-3">{copy.emailLabel}</dt>
              <dd className="inline-flex items-center gap-2">
                <span id="contact-email" className="font-medium text-ink select-all">
                  {profile.email}
                </span>
                <CopyButton value={profile.email} targetId="contact-email" label={copy.copy} copiedLabel={copy.copied} />
              </dd>
            </div>
            <div className="flex min-h-[60px] flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line-2 py-3">
              <dt className="text-[0.9375rem] text-ink-3">{copy.locationLabel}</dt>
              <dd className="font-medium text-ink">
                {profile.location.city}, {profile.location.country}
              </dd>
            </div>
          </dl>
        </header>

        <div className="grid min-w-0 gap-5">
          <div className="rounded-card bg-bg p-[clamp(24px,3.6vw,44px)] shadow-[0_0_0_1px_var(--color-line)]">
            <ContactForm copy={copy.form} privacyHref={privacy} ownerEmail={profile.email} />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <p className="text-[0.9375rem] text-ink-3">{copy.elsewhere}</p>
            <SocialLinks variant="bordered" />
          </div>
        </div>
      </div>
    </section>
  );
}
