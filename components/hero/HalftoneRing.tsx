"use client";

import { useEffect, useRef } from "react";

/**
 * One large ring of halftone dots behind the whole hero (spec 4.7). A dark crescent sweeps
 * around it, one full turn every 8 seconds; the far side nearly fades out.
 * - Static for visitors who prefer reduced motion.
 * - Paused while the hero is off screen or the tab is hidden; resumes where it left off.
 * - Each dot's position, angle and strength are computed once per size; a frame only
 *   recomputes radii, so drawing stays far below the 16 ms budget of 60 fps.
 * `data-state` ("running" | "paused" | "static") and `data-draw-ms` (average draw time)
 * expose this to the tests.
 */

type Dot = { x: number; y: number; cos: number; sin: number; strength: number };

const TAU = Math.PI * 2;
const TURN_MS = 8000; // one full sweep
const LIGHT = 0.5; // resting direction of the crescent: toward the upper right
const DOT_MAX = 0.36; // largest dot radius as a share of the grid step: dots never merge

/** Dark-to-light falloff around the ring; the high exponent makes the far side nearly empty. */
const crescent = (cosToLight: number) => 0.06 + 0.94 * (0.5 + 0.5 * cosToLight) ** 2.4;

export function HalftoneRing() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const ink = getComputedStyle(document.documentElement).getPropertyValue("--color-ink").trim() || "#000";
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let W = 0;
    let H = 0;
    let step = 8;
    let dots: Dot[] = [];

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      if (!W || !H) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Desktop: centered behind the name; narrow: behind the name and intro.
      const wide = W >= 900;
      step = W < 700 ? 7 : 8;
      const cx = W * (wide ? 0.36 : 0.5);
      const cy = H * (wide ? 0.5 : 0.3);
      const R = wide ? Math.min(W * 0.27, H * 0.5) : W * 0.44;
      const band = R * 0.24;
      const reach = band * 1.8; // exp(-x²) < 0.04 beyond x = 1.8, so farther dots never show

      dots = [];
      for (let y = step / 2; y < H; y += step) {
        for (let x = step / 2; x < W; x += step) {
          const dx = x - cx;
          const dy = (y - cy) * 1.08;
          const d = Math.hypot(dx, dy);
          if (Math.abs(d - R) > reach) continue;
          const a = Math.atan2(dy, dx);
          dots.push({ x, y, cos: Math.cos(a), sin: Math.sin(a), strength: Math.exp(-(((d - R) / band) ** 2)) });
        }
      }
      return true;
    };

    // t in ms; t = 0 is the resting frame (also the reduced-motion frame).
    const draw = (t: number) => {
      const light = LIGHT + (t / TURN_MS) * TAU;
      const lc = Math.cos(light);
      const ls = Math.sin(light);

      ctx.clearRect(0, 0, W, H);
      // All dots go into one path and one fill: measured ~10x cheaper than copying a
      // pre-drawn dot image per dot.
      ctx.fillStyle = ink;
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      for (const dot of dots) {
        if (dot.strength < 0.04) continue;
        const r = dot.strength * crescent(dot.cos * lc + dot.sin * ls) * step * DOT_MAX;
        if (r < 0.25) continue;
        ctx.moveTo(dot.x + r, dot.y);
        ctx.arc(dot.x, dot.y, r, 0, TAU);
      }
      ctx.fill();
    };

    let raf = 0;
    let start = 0;
    let elapsed = 0; // keeps the sweep's position across pauses
    let onScreen = true;
    let total = 0;
    let frames = 0;

    const frame = (now: number) => {
      const t0 = performance.now();
      elapsed = now - start;
      draw(elapsed);
      total += performance.now() - t0;
      if (++frames % 30 === 0) {
        canvas.dataset.drawMs = (total / frames).toFixed(2);
      }
      raf = requestAnimationFrame(frame);
    };

    const update = () => {
      const reduce = motion.matches;
      const run = !reduce && onScreen && !document.hidden;
      if (run && !raf) {
        start = performance.now() - elapsed;
        raf = requestAnimationFrame(frame);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      if (reduce) {
        elapsed = 0;
        draw(0);
      }
      canvas.dataset.state = reduce ? "static" : run ? "running" : "paused";
    };

    if (build()) draw(0);
    update();

    const resize = new ResizeObserver(() => {
      if (build()) draw(elapsed);
    });
    resize.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    visibility.observe(canvas);
    document.addEventListener("visibilitychange", update);
    motion.addEventListener("change", update);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      data-hero-bg="ring"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full [mask-image:linear-gradient(180deg,#000_64%,transparent_92%)]"
    />
  );
}
