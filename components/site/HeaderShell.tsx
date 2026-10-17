"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Sticky header frame; shows a divider once the page is scrolled. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="top"
      className={cn(
        "sticky top-[env(safe-area-inset-top,0px)] z-40 border-b bg-bg/85 backdrop-blur-[14px] transition-[border-color] duration-200",
        scrolled ? "border-line" : "border-transparent",
      )}
    >
      {children}
    </header>
  );
}
