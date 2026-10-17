import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "bordered" | "plain";

const variants: Record<Variant, string> = {
  // 44px, used below the contact form (spec 4.5)
  bordered:
    "size-11 bg-bg text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line-2)] hover:text-ink hover:shadow-[inset_0_0_0_1px_var(--color-ink)] active:scale-[0.96]",
  // 38px, used in the header
  plain: "size-[38px] text-ink-3 hover:bg-surface hover:text-ink",
};

type Props = { icon: IconName; label: string; variant?: Variant; iconClassName?: string };

/** An icon-only link. `label` is required so screen readers announce it. */
export function IconLink({
  icon,
  label,
  variant = "plain",
  iconClassName,
  className,
  ...props
}: Props & Omit<ComponentProps<"a">, "aria-label" | "children">) {
  return (
    <a
      aria-label={label}
      title={label}
      className={cn(
        "grid place-items-center rounded-ctl transition-[color,background-color,box-shadow,transform] duration-200",
        variants[variant],
        className,
      )}
      {...props}
    >
      <Icon name={icon} className={cn(variant === "bordered" ? "size-5" : "size-[18px]", iconClassName)} />
    </a>
  );
}
