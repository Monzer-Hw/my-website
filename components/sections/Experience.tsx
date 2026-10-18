import { content } from "@/content";
import { formatRange } from "@/lib/dates";
import { SectionHeading } from "./SectionHeading";

export function Experience() {
  const copy = content.sections.experience;
  return (
    <section id="experience" aria-labelledby="experience-title" className="bg-surface py-section">
      <div className="wrap">
        <SectionHeading id="experience-title" title={copy.title} lede={copy.lede} />
        <ol reversed className="mt-16 list-none border-b border-line-2">
          {content.experience.map((job) => {
            const current = job.end === "present";
            return (
              <li
                key={`${job.org}-${job.start}`}
                className="grid gap-x-14 gap-y-3 border-t border-line-2 py-11 desk:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
              >
                <div className="flex flex-wrap gap-x-3 gap-y-1 desk:flex-col desk:gap-1">
                  <time dateTime={job.start} className="font-medium text-ink tabular-nums">
                    {formatRange(job.start, job.end, copy.present)}
                  </time>
                  <span className="text-[0.9375rem] text-ink-3">{job.location}</span>
                  {current && (
                    <span className="inline-flex items-center gap-2 text-sm text-ink desk:mt-1.5">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-live" />
                      {copy.current}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[clamp(1.375rem,1.15rem+0.8vw,1.75rem)] leading-[1.15] tracking-[-0.025em]">
                    {job.role}
                  </h3>
                  <p className="mt-1 text-ink-3">{job.org}</p>
                  <p className="mt-4 max-w-[60ch]">{job.summary}</p>
                  <ul className="mt-[18px] grid max-w-[62ch] list-none gap-2">
                    {job.results.map((result) => (
                      <li
                        key={result.slice(0, 32)}
                        className="relative pl-5 text-[0.9375rem] before:absolute before:top-[0.72em] before:left-0 before:h-px before:w-2 before:bg-ink-3"
                      >
                        {result}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-[18px] text-sm text-ink-3">{job.tools.join(", ")}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
