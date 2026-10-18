"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { durationLabel } from "@/lib/duration";
import { VideoDialog } from "./VideoDialog";

type Video = { src: string; captions: string; poster?: string; duration: string };
type Copy = { demo: string; videoTitle: string; videoClose: string; videoUnavailable: string };

/**
 * The still and a "Watch demo" link that both open the project's video (spec 3.3).
 * `still` is the server-rendered VideoPoster; `links` are the project's other links.
 */
export function ProjectVideo({
  id,
  title,
  video,
  copy,
  still,
  links,
}: {
  id: string;
  title: string;
  video: Video;
  copy: Copy;
  still: ReactNode;
  links?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const label = `${copy.demo}: ${title}, ${durationLabel(video.duration)}`;

  return (
    <>
      {/* The still is a picture; a transparent button with no visible text of its own lies over it,
          so its accessible name never conflicts with the still's drawn text (WCAG 2.5.3). */}
      <div className="group relative mt-[18px] aspect-video w-full overflow-hidden rounded-media bg-poster">
        {still}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={label}
          aria-haspopup="dialog"
          className="absolute inset-0 size-full cursor-pointer rounded-media"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="inline-flex cursor-pointer items-center gap-2 font-medium text-ink underline decoration-line-2 decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-200 hover:decoration-ink"
        >
          <Icon name="film" className="text-ink-3" />
          {copy.demo}
          <span className="sr-only"> of {title}</span>
        </button>
        {links}
      </div>
      <VideoDialog id={id} title={title} video={video} copy={copy} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
