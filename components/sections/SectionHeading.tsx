import { cn } from "@/lib/cn";

/** Section title ending with a period (spec 4.3), with an optional lede. */
export function SectionHeading({
  id,
  title,
  lede,
  className,
}: {
  id: string;
  title: string;
  lede?: string;
  className?: string;
}) {
  return (
    <header className={cn("max-w-[720px]", className)}>
      <h2 id={id} className="text-[clamp(2rem,1.3rem+2.4vw,3.25rem)] leading-[1.04] tracking-[-0.04em]">
        {title}
      </h2>
      {lede && <p className="mt-[18px] max-w-[56ch] text-[1.1875rem] leading-[1.55] text-ink-3">{lede}</p>}
    </header>
  );
}
