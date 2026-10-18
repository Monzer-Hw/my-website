import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { PosterArt } from "./PosterArt";

type Props = {
  title: string;
  duration: string;
  poster?: string;
  art?: "rag" | "sudoku" | "flow";
};

/**
 * 16:9 still with the duration bottom left and the play mark bottom right (spec 4.6).
 * Decorative for now; phase 5 turns it into the click-to-load video player.
 */
export function VideoPoster({ title, duration, poster, art }: Props) {
  return (
    <figure aria-hidden="true" className="relative mt-[18px] aspect-video w-full overflow-hidden rounded-media bg-poster">
      {poster ? (
        <Image src={poster} alt="" fill sizes="(min-width: 900px) 380px, 100vw" className="object-cover" />
      ) : art ? (
        <PosterArt kind={art} />
      ) : (
        <span className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-poster-ink">{title}</span>
      )}
      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-[6px] bg-bg/15 px-2 py-1 text-xs text-bg tabular-nums backdrop-blur-sm">
        <Icon name="film" className="size-3.5" />
        {duration}
      </span>
      <span className="absolute right-3 bottom-3 grid size-11 place-items-center rounded-full bg-bg text-ink shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)]">
        <Icon name="play" className="ml-0.5 size-[18px]" />
      </span>
    </figure>
  );
}
