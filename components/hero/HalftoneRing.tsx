"use client";

import { useEffect, useRef } from "react";

/**
 * One large ring of halftone dots behind the whole hero (spec 4.7, design reference).
 * Drawn once and redrawn on resize. The slow loop arrives in phase 6.
 */
export function HalftoneRing() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const ink = getComputedStyle(document.documentElement).getPropertyValue("--color-ink").trim() || "#000";

    const draw = () => {
      const { width: W, height: H } = canvas.getBoundingClientRect();
      if (!W || !H) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Desktop: centered behind the name; narrow: behind the name and intro.
      const wide = W >= 900;
      const step = W < 700 ? 7 : 8;
      const cx = W * (wide ? 0.36 : 0.5);
      const cy = H * (wide ? 0.5 : 0.3);
      const R = wide ? Math.min(W * 0.27, H * 0.5) : W * 0.44;
      const band = R * 0.24;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = ink;
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      for (let y = step / 2; y < H; y += step) {
        for (let x = step / 2; x < W; x += step) {
          const dx = x - cx;
          const dy = (y - cy) * 1.08;
          const strength = Math.exp(-(((Math.hypot(dx, dy) - R) / band) ** 2));
          if (strength < 0.04) continue;
          // Darker toward the upper right, like light falling on a torus.
          const shade = 0.25 + 0.75 * (0.5 + 0.5 * Math.cos(Math.atan2(dy, dx) - 0.5));
          const r = strength * shade * step * 0.52;
          if (r < 0.25) continue;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full [mask-image:linear-gradient(180deg,#000_64%,transparent_92%)]"
    />
  );
}
