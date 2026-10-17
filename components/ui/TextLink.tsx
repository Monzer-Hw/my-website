import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Underlined text link; the underline darkens on hover (spec 4.5). */
export function TextLink({ className, ...props }: ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "inline-flex items-center gap-2 font-medium text-ink underline decoration-line-2 decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-200 hover:decoration-ink",
        className,
      )}
      {...props}
    />
  );
}
