"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * The hero intro, revealed once on load (owner's intro playground): the letters stream in from left
 * to right; each first appears as a flickering block of dots (a random mix of shapes on one shared
 * grid), then resolves into its letter in place.
 * - Screen readers get the sentence from a visually hidden copy right away.
 * - The text is server-rendered and visible before the animation, and stays as plain text after it.
 * - Skipped for reduced motion. `data-state` ("idle" | "animating" | "done" | "static") for tests.
 */

// Settings chosen in the owner's intro playground: stream order, random mix, circle dots, random fill
const CPS = 90; // letters per second
const BLOCK = 1.5;
const SPACING = 5.4; // dot spacing = font size ÷ SPACING
const DOT_SIZE = 0.84;
const STEP = 1000 / CPS;
const BUILD = 160 / BLOCK;
const HOLD = 150 / BLOCK;
const RESOLVE = 260 / BLOCK;
const THINK = 240;
const START = 400;
const MIX = ["rect", "xheight", "pill", "ellipse", "diamond", "baseline", "glyph", "heights"] as const;

type Dot = { x: number; y: number; h: number; delay: number };

export function IntroReveal({
  text,
  as: Tag = "p",
  id,
  className,
}: {
  text: string;
  as?: "p" | "h1";
  id?: string;
  className?: string;
}) {
  const root = useRef<HTMLParagraphElement>(null); // same shape as HTMLHeadingElement
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "animating" | "done" | "static">("idle");
  const words = text.split(" ");

  // Decide whether to animate once fonts are ready (glyph shapes depend on the real font).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time preference check after mount
      setState("static");
      return;
    }
    let cancelled = false;
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(() => {
      if (!cancelled) setState("animating");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Run the dot animation while the canvas exists.
  useEffect(() => {
    if (state !== "animating") return;
    const p = root.current;
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!p || !cv || !ctx) return;

    const chars = Array.from(p.querySelectorAll<HTMLElement>("[data-c]"));
    chars.forEach((c) => (c.style.opacity = "0"));
    const pr = p.getBoundingClientRect();
    const cs = getComputedStyle(p);
    const fs = parseFloat(cs.fontSize);
    const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const boxes = chars.map((c) => {
      const r = c.getBoundingClientRect();
      return { x: r.left - pr.left, y: r.top - pr.top, w: r.width, h: r.height };
    });
    const W = Math.ceil(pr.width);
    const H = Math.ceil(pr.height);
    const measure = document.createElement("canvas").getContext("2d")!;
    measure.font = font;
    const mh = measure.measureText("H");
    const asc = mh.fontBoundingBoxAscent || fs * 0.95;
    const cap = mh.actualBoundingBoxAscent || fs * 0.7;
    const xh = measure.measureText("x").actualBoundingBoxAscent || cap * 0.72;
    const pitch = fs / SPACING;
    const rad = (pitch * DOT_SIZE) / 2;

    // Letter-shape blocks sample the real glyphs from an offscreen render.
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const o = off.getContext("2d", { willReadFrequently: true })!;
    o.font = font;
    o.textBaseline = "alphabetic";
    o.fillStyle = "#000";
    chars.forEach((c, i) => {
      if (!c.dataset.sp) o.fillText(c.textContent ?? "", boxes[i].x, boxes[i].y + asc);
    });
    const img = o.getImageData(0, 0, W, H).data;
    const glyphAt = (x: number, y: number) =>
      x >= 0 && y >= 0 && x < W && y < H && img[((y | 0) * W + (x | 0)) * 4 + 3] > 85;

    // Each character gets a random shape; dots sit on one shared grid so neighbouring blocks touch.
    const dots: Dot[][] = boxes.map((b, i) => {
      const out: Dot[] = [];
      const base = b.y + asc;
      const isSp = !!chars[i].dataset.sp;
      if (isSp && !(boxes[i - 1] && boxes[i + 1] && boxes[i - 1].y === b.y && boxes[i + 1].y === b.y)) return out;
      const sh = MIX[Math.floor(Math.random() * MIX.length)];
      if (sh === "glyph" && isSp) return out;
      let top = base - cap;
      let bottom = base;
      if (sh === "xheight") top = base - xh;
      else if (sh === "baseline") top = base - pitch * 2;
      else if (sh === "heights") top = base - cap * (0.3 + Math.random() * 0.95);
      else if (sh === "glyph") {
        top = b.y + 1;
        bottom = b.y + b.h - 1;
      }
      const k0 = Math.ceil(b.x / pitch - 0.5);
      const k1 = Math.ceil((b.x + b.w) / pitch - 0.5);
      const r0 = Math.ceil(top / pitch - 0.5);
      const r1 = Math.ceil(bottom / pitch - 0.5);
      const cx = b.x + b.w / 2;
      const cy = (top + bottom) / 2;
      const rx = Math.max(b.w / 2, pitch * 0.9);
      const ry = Math.max((bottom - top) / 2, pitch * 0.9);
      for (let r = r0; r < r1; r++) {
        for (let k = k0; k < k1; k++) {
          const x = k * pitch + pitch / 2;
          const y = r * pitch + pitch / 2;
          let ok = true;
          if (sh === "pill") ok = !((k === k0 || k === k1 - 1) && (r === r0 || r === r1 - 1)) || k1 - k0 < 3;
          else if (sh === "ellipse") ok = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1.05;
          else if (sh === "diamond") ok = Math.abs(x - cx) / rx + Math.abs(y - cy) / ry <= 1.08;
          else if (sh === "glyph") ok = glyphAt(x, y);
          if (!ok) continue;
          const h = Math.random();
          out.push({ x, y, h, delay: h * BUILD });
        }
      }
      return out;
    });

    // Stream: letter i's block starts forming STEP ms after the previous one, then dissolves into it.
    const buildAt = chars.map((_, i) => START + i * STEP);
    const fadeAt = buildAt.map((b) => b + BUILD + HOLD);
    const total = START + chars.length * STEP + BUILD + HOLD + RESOLVE;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.width = `${W}px`;
    cv.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = cs.color;
    // Dots are grouped by opacity (LEVELS steps) and each group is filled once per frame:
    // one fill per dot cost long main-thread tasks on slow phones.
    const LEVELS = 16;
    const buckets: number[][] = Array.from({ length: LEVELS + 1 }, () => []);
    const dot = (x: number, y: number, r: number, alpha: number) => {
      const level = Math.round(alpha * LEVELS);
      if (level > 0) buckets[level].push(x, y, r);
    };
    const flush = () => {
      for (let level = 1; level <= LEVELS; level++) {
        const b = buckets[level];
        if (!b.length) continue;
        ctx.globalAlpha = level / LEVELS;
        ctx.beginPath();
        for (let j = 0; j < b.length; j += 3) {
          ctx.moveTo(b[j] + b[j + 2], b[j + 1]);
          ctx.arc(b[j], b[j + 1], b[j + 2], 0, Math.PI * 2);
        }
        ctx.fill();
        b.length = 0;
      }
    };

    let raf = 0;
    let resized = false;
    const onResize = () => (resized = true);
    window.addEventListener("resize", onResize, { once: true });
    const finish = () => {
      chars.forEach((c) => (c.style.opacity = ""));
      setState("done");
    };

    const t0 = performance.now();
    const frame = (now: number) => {
      const t = now - t0;
      if (resized || t > total) return finish();
      ctx.clearRect(0, 0, W, H);
      const tick = Math.floor(t / 70);
      for (let i = 0; i < chars.length; i++) {
        const base = t - buildAt[i];
        if (base < -THINK) continue; // the stream hasn't reached this letter yet
        const ds = dots[i];
        let textK = 0;
        for (const d of ds) {
          const u = base - d.delay;
          if (u < 0) {
            // Thinking: faint flicker before the dot lands
            if (u > -THINK && (d.h * 997 + tick * 0.37) % 1 < 0.16) {
              dot(d.x, d.y, rad * 0.8, 0.28 * (1 + u / THINK));
            }
            continue;
          }
          const f = t - fadeAt[i];
          let a = 1;
          let r = rad;
          if (f > 0) {
            const k = Math.min(1, f / RESOLVE);
            a = 1 - k;
            r = rad * (1 - 0.4 * k);
            textK = k;
          }
          if (f > RESOLVE) {
            textK = 1;
            continue;
          }
          const flick = (d.h * 991 + tick * 0.41) % 1 < 0.22 ? 0.45 : 1;
          dot(d.x, d.y, r, 0.85 * a * flick);
        }
        if (!ds.length && t > fadeAt[i]) textK = 1;
        if (t > fadeAt[i]) chars[i].style.opacity = String(Math.min(1, textK * 1.25));
      }
      flush();
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      chars.forEach((c) => (c.style.opacity = ""));
    };
  }, [state]);

  return (
    <Tag ref={root} id={id} data-state={state} className={cn("relative", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            <span className="inline-block whitespace-nowrap">
              {[...word].map((ch, ci) => (
                <span key={ci} data-c="">
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 && (
              <span data-c="" data-sp="1">
                {" "}
              </span>
            )}
          </Fragment>
        ))}
      </span>
      {state === "animating" && (
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute top-0 left-0" />
      )}
    </Tag>
  );
}
