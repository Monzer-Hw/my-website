import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "ink" | "soft";
type Size = "md" | "sm";

const base =
  "inline-flex items-center gap-2.5 whitespace-nowrap rounded-ctl font-medium no-underline transition-[background-color,box-shadow,transform] duration-200 active:scale-[0.98] cursor-pointer";

const variants: Record<Variant, string> = {
  ink: "bg-ink text-bg hover:bg-[#2b2b2b]",
  soft: "bg-surface text-ink shadow-[inset_0_0_0_1px_var(--color-line)] hover:shadow-[inset_0_0_0_1px_var(--color-line-2)]",
};

const sizes: Record<Size, string> = {
  md: "min-h-[46px] px-5 text-[0.9375rem]",
  sm: "min-h-[38px] px-4 text-sm",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function buttonClasses({ variant = "ink", size = "md", className }: Omit<Common, "children">) {
  return cn(base, variants[variant], sizes[size], className);
}

/** A link styled as a button (navigation, downloads). */
export function ButtonLink({ variant, size, className, ...props }: Common & ComponentProps<"a">) {
  return <a className={buttonClasses({ variant, size, className })} {...props} />;
}

/** A real button (actions such as submitting a form). */
export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: Common & ComponentProps<"button">) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}
