import type { ReactNode } from "react";

/** Small status label such as "exploring" (spec 4.5): 4px corners, thin border. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="ml-1 inline-block whitespace-nowrap rounded-tag px-2 py-px text-[0.8125rem] text-ink-3 shadow-[inset_0_0_0_1px_var(--color-line-2)]">
      {children}
    </span>
  );
}
