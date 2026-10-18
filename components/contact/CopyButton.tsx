"use client";

import { useEffect, useState } from "react";

/** Copies `value`; if the clipboard is unavailable, selects the target text instead. */
export function CopyButton({
  value,
  targetId,
  label,
  copiedLabel,
}: {
  value: string;
  targetId: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      const target = document.getElementById(targetId);
      if (!target) return;
      const range = document.createRange();
      range.selectNodeContents(target);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="min-h-[30px] cursor-pointer rounded-[6px] bg-bg px-3 text-[0.8125rem] text-ink shadow-[inset_0_0_0_1px_var(--color-line-2)] transition-shadow duration-200 hover:shadow-[inset_0_0_0_1px_var(--color-ink-3)]"
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
