"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Video = { src: string; captions: string; poster?: string };
type Copy = { videoTitle: string; videoClose: string; videoUnavailable: string };

/**
 * Modal video player. The <video> element only exists while the dialog is open, so
 * nothing is requested before the visitor presses play (spec 3.3). Escape and the
 * backdrop close it; the browser returns focus to the button that opened it.
 */
export function VideoDialog({
  id,
  title,
  video,
  copy,
  open,
  onClose,
}: {
  id: string;
  title: string;
  video: Video;
  copy: Copy;
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-video-title`}
      onClose={() => {
        setFailed(false);
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      className="m-auto w-[min(960px,calc(100vw-32px))] max-w-none overflow-hidden rounded-card bg-poster p-0 text-poster-text backdrop:bg-ink/70"
    >
      {open && (
        <>
          <div className="relative aspect-video bg-poster-2">
            {failed ? (
              <p role="status" className="absolute inset-0 grid place-items-center px-8 text-center text-[0.9375rem] text-poster-ink">
                {copy.videoUnavailable}
              </p>
            ) : (
              <video
                controls
                autoPlay
                playsInline
                preload="metadata"
                poster={video.poster}
                onError={() => setFailed(true)}
                className="size-full bg-poster"
              >
                <source src={video.src} type="video/mp4" onError={() => setFailed(true)} />
                <track kind="captions" src={video.captions} srcLang="en" label="English" default />
              </video>
            )}
          </div>
          <div className="flex items-center justify-between gap-4 px-5 py-3.5">
            <h2 id={`${id}-video-title`} className="text-[0.9375rem] font-medium text-poster-text">
              {title}: {copy.videoTitle}
            </h2>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label={copy.videoClose}
              className="grid size-[38px] flex-none cursor-pointer place-items-center rounded-ctl bg-bg/10 text-poster-text transition-colors duration-200 hover:bg-bg/20"
            >
              <Icon name="close" className="size-[18px]" />
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
