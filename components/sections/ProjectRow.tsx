import { ProjectVideo } from "@/components/media/ProjectVideo";
import { VideoPoster } from "@/components/media/VideoPoster";
import { Icon } from "@/components/ui/Icon";
import { TextLink } from "@/components/ui/TextLink";
import type { Content } from "@/content/schema";
import { cn } from "@/lib/cn";

type Project = Content["projects"][number];
type Copy = Content["sections"]["projects"];

/** Title, status, still and links on the left (sticky on desktop); story on the right. */
export function ProjectRow({ project, copy }: { project: Project; copy: Copy }) {
  const { id, title, status, summary, decisions, tools, links, posterArt } = project;
  const built = status.kind === "built";

  const otherLinks =
    links.live || links.code ? (
      <>
        {links.live && (
          <TextLink href={links.live} target="_blank" rel="noopener noreferrer">
            <Icon name="out" className="text-ink-3" />
            {copy.live}
            <span className="sr-only"> (live demo of {title}, opens in a new tab)</span>
          </TextLink>
        )}
        {links.code && (
          <TextLink href={links.code} target="_blank" rel="noopener noreferrer">
            <Icon name="code" className="text-ink-3" />
            {copy.code}
            <span className="sr-only"> for {title} on GitHub (opens in a new tab)</span>
          </TextLink>
        )}
      </>
    ) : null;

  return (
    <article
      id={id}
      aria-labelledby={`${id}-title`}
      className="grid grid-cols-1 gap-x-14 gap-y-4 border-t border-line-2 py-10 desk:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
    >
      <div className="min-w-0 desk:sticky desk:top-[calc(var(--spacing-header)+24px)] desk:self-start">
        <h3 id={`${id}-title`} className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-[1.1] tracking-[-0.03em]">
          {title}
        </h3>
        <p className="mt-2.5 inline-flex items-center gap-2 text-sm text-ink-3">
          <span
            aria-hidden="true"
            className={cn("size-1.5 rounded-full", built ? "bg-ink" : "shadow-[inset_0_0_0_1.5px_var(--color-ink)]")}
          />
          {built ? `${copy.built} ${status.date}` : copy.inProgress}
        </p>

        {links.video ? (
          <ProjectVideo
            id={id}
            title={title}
            video={links.video}
            copy={copy}
            still={
              <VideoPoster title={title} duration={links.video.duration} poster={links.video.poster} art={posterArt} />
            }
            links={otherLinks}
          />
        ) : (
          otherLinks && <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">{otherLinks}</div>
        )}
      </div>

      <div className="min-w-0">
        <p className="max-w-[60ch]">{summary}</p>
        <dl className="mt-[22px] grid gap-2.5">
          {decisions.map((d) => (
            <div
              key={d.topic}
              className="grid gap-x-5 gap-y-1 border-t border-dashed border-line-2 pt-2.5 text-[0.9375rem] phone:grid-cols-[minmax(0,13ch)_minmax(0,1fr)]"
            >
              <dt className="font-medium text-ink">{d.topic}</dt>
              <dd className="text-ink-2">{d.text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-[18px] text-sm text-ink-3">{tools.join(", ")}</p>
      </div>
    </article>
  );
}
