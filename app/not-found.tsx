import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { content } from "@/content";

export const metadata: Metadata = { title: content.sections.notFound.title.replace(/\.$/, "") };

export default function NotFound() {
  const copy = content.sections.notFound;
  return (
    <div className="wrap py-section">
      <h1 className="text-[clamp(2rem,1.3rem+2.4vw,3.25rem)] leading-[1.04] tracking-[-0.04em]">{copy.title}</h1>
      <p className="mt-[18px] max-w-[56ch] text-[1.1875rem] leading-[1.55] text-ink-3">{copy.body}</p>
      <ButtonLink href="/" className="mt-8">
        {copy.home}
      </ButtonLink>
    </div>
  );
}
