import Image from "next/image";
import { content } from "@/content";
import { cn } from "@/lib/cn";

/**
 * The real photo has no card: no background, corners or shadow, in grayscale (spec 3.8).
 * Until it exists, a placeholder card with the initials holds its place.
 */
export function Photo({ className }: { className?: string }) {
  const { photo } = content.profile;
  const frame = "w-full max-w-[300px] justify-self-center desk:max-w-[440px] desk:justify-self-end";

  if (photo) {
    return (
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        preload
        sizes="(min-width: 900px) 440px, 300px"
        className={cn(frame, "h-auto grayscale contrast-[1.05]", className)}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        frame,
        "grid aspect-[4/5] place-items-center rounded-photo bg-[radial-gradient(circle_at_50%_38%,var(--color-surface),var(--color-line-2))] shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <span className="text-[clamp(4rem,3rem+4vw,7rem)] font-semibold tracking-[-0.06em] text-ink-4/50">
        {content.site.initials}
      </span>
    </div>
  );
}
