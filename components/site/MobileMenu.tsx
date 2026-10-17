"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

type NavItem = { readonly label: string; readonly href: string };

/** Menu button and panel shown below 900px (spec 3.2). */
export function MobileMenu({ items, footer }: { items: readonly NavItem[]; footer: ReactNode }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={button}
        type="button"
        className="grid size-[38px] cursor-pointer place-items-center rounded-ctl bg-surface text-ink shadow-[inset_0_0_0_1px_var(--color-line)] desk:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name={open ? "close" : "menu"} className="size-[18px]" />
      </button>

      <nav
        id="mobile-menu"
        aria-label="Main menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-t border-line bg-bg desk:hidden"
      >
        <div className="wrap">
          <ul className="list-none pt-2 pb-4">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[52px] items-center justify-between border-b border-line text-lg text-ink no-underline"
                >
                  {item.label}
                  <Icon name="arrow" className="text-ink-3" />
                </a>
              </li>
            ))}
          </ul>
          <div className="pb-5">{footer}</div>
        </div>
      </nav>
    </>
  );
}
