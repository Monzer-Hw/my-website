"use client";

import { useEffect, useRef } from "react";

/**
 * One large ring of halftone dots behind the whole hero, looping slowly (spec 4.7).
 * - Static for visitors who prefer reduced motion.
 * - Paused while the hero is off screen or the tab is hidden.
 * - Each dot's position, angle and distance are computed once per size; a frame only
 *   recomputes radii, so drawing stays far below the 16 ms budget of 60 fps.
 * `data-state` ("running" | "paused" | "static") and `data-draw-ms` (average draw time)
 * expose this to the tests.
 */

type Variant = "sweep" | "spin" | "wave";
const VARIANTS: Variant[] = ["sweep", "spin", "wave"];

// PROTOTYPE (phase 6, round 2): `?ring=sweep|spin|wave` switches the loop on previews so the
// owner can choose. Once chosen, the other variants and this switch are removed.
function readVariant(): Variant {
  const v = new URLSearchParams(window.location.search).get("ring");
  return VARIANTS.includes(v as Variant) ? (v as Variant) : "sweep";
}

// Grid dot (sweep, wave): fixed position, angle stored as cos/sin.
type Dot = { x: number; y: number; d: number; cos: number; sin: number; strength: number };
// Orbiting dot (spin): sits on a circle of radius `rad` and travels around it.
type Orbiter = { rad: number; theta: number; strength: number; shade: number };

const TAU = Math.PI * 2;
const LIGHT = 0.5; // resting light direction: darker toward the upper right

/** Light-to-dark falloff around the ring; the high exponent makes the far side nearly empty. */
const crescent = (cosToLight: number) => 0.06 + 0.94 * (0.5 + 0.5 * cosToLight) ** 2.4;

export function HalftoneRing() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const variant = readVariant();
    const ink = getComputedStyle(document.documentElement).getPropertyValue("--color-ink").trim() || "#000";
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let W = 0;
    let H = 0;
    let step = 8;
    let R = 0;
    let band = 0;
    let cx = 0;
    let cy = 0;
    let dots: Dot[] = [];
    let orbiters: Orbiter[] = [];

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
      cx = W * (wide ? 0.36 : 0.5);
      cy = H * (wide ? 0.5 : 0.3);
      R = wide ? Math.min(W * 0.27, H * 0.5) : W * 0.44;
      band = R * 0.24;
      // exp(-x²) < 0.04 beyond x = 1.8, so dots farther out never show.
      const reach = band * 1.8;

      dots = [];
      orbiters = [];
      if (variant === "spin") {
        // Concentric circles of dots, staggered per circle, so the whole ring can turn.
        let ring = 0;
        for (let rad = Math.max(step, R - reach); rad <= R + reach; rad += step, ring++) {
          const n = Math.max(6, Math.round((TAU * rad) / step));
          const strength = Math.exp(-(((rad - R) / band) ** 2));
          for (let k = 0; k < n; k++) {
            const theta = ((k + (ring % 2) * 0.5) / n) * TAU;
            orbiters.push({ rad, theta, strength, shade: crescent(Math.cos(theta - LIGHT)) });
          }
        }
      } else {
        for (let y = step / 2; y < H; y += step) {
          for (let x = step / 2; x < W; x += step) {
            const dx = x - cx;
            const dy = (y - cy) * 1.08;
            const d = Math.hypot(dx, dy);
            if (Math.abs(d - R) > reach) continue;
            const a = Math.atan2(dy, dx);
            dots.push({ x, y, d, cos: Math.cos(a), sin: Math.sin(a), strength: Math.exp(-(((d - R) / band) ** 2)) });
          }
        }
      }
      return true;
    };

    // t in ms; t = 0 is the resting frame (also the reduced-motion frame).
    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      // All dots go into one path and one fill: measured ~10x cheaper than copying a
      // pre-drawn dot image per dot.
      ctx.fillStyle = ink;
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      const dotAt = (x: number, y: number, r: number) => {
        if (r < 0.25) return;
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, TAU);
      };

      if (variant === "spin") {
        // The dots and their shading turn together: one full turn every 24 s.
        const turn = (t / 24000) * TAU;
        for (const o of orbiters) {
          const s = o.strength * o.shade;
          if (s < 0.04) continue;
          const a = o.theta + turn;
          dotAt(cx + o.rad * Math.cos(a), cy + (o.rad * Math.sin(a)) / 1.08, s * step * 0.52);
        }
      } else {
        // sweep: a sharp dark crescent travels around the ring, one turn every 8 s.
        // wave: a strong ripple runs outward through the band every 4.5 s.
        const light = LIGHT + (variant === "sweep" ? (t / 8000) * TAU : 0);
        const lc = Math.cos(light);
        const ls = Math.sin(light);
        const wavePhase = (t / 4500) * TAU;
        for (const dot of dots) {
          let s = dot.strength;
          if (variant === "wave") s *= 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(dot.d / 26 - wavePhase));
          if (s < 0.04) continue;
          dotAt(dot.x, dot.y, s * crescent(dot.cos * lc + dot.sin * ls) * step * 0.52);
        }
      }
      ctx.fill();
    };

    let raf = 0;
    let start = 0;
    let elapsed = 0; // keeps the loop's position across pauses
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
      canvas.dataset.variant = variant;
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
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full [mask-image:linear-gradient(180deg,#000_64%,transparent_92%)]"
    />
  );
}
