import { ImageResponse } from "next/og";
import { content } from "@/content";

// Link preview image for LinkedIn and other sites (spec 3.9), generated at build time.
// Uses the built-in default font: Host Grotesk would have to be added to the repo as a TTF file.

const { name, role, description, initials } = content.site;

export const alt = `${name} – ${role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colors from the design tokens (app/globals.css); ImageResponse cannot read CSS variables.
const INK = "#000000";
const INK_3 = "#6b6b68";
const BG = "#ffffff";
const LINE_2 = "#d4d4d1";

// Fixed dot positions (no randomness): a ring centered off the right edge.
const RING_DOTS = [
  { radius: 236, count: 64, dot: 5 },
  { radius: 262, count: 72, dot: 8 },
  { radius: 288, count: 80, dot: 5 },
].flatMap(({ radius, count, dot }) =>
  Array.from({ length: count }, (_, k) => {
    const a = (k / count) * Math.PI * 2;
    return { x: 1080 + radius * Math.cos(a), y: 330 + radius * Math.sin(a), r: dot };
  }),
);

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: BG,
          position: "relative",
        }}
      >
        {/* The hero's halftone ring: three circles of dots, largest in the middle */}
        {RING_DOTS.map((dot, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: dot.x - dot.r,
              top: dot.y - dot.r,
              width: dot.r * 2,
              height: dot.r * 2,
              borderRadius: 9999,
              background: LINE_2,
            }}
          />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              background: INK,
              color: BG,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, color: INK }}>{name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
          <div style={{ fontSize: 108, fontWeight: 700, lineHeight: 0.95, letterSpacing: -4, color: INK }}>
            {role}
          </div>
          <div style={{ marginTop: 28, fontSize: 34, lineHeight: 1.35, color: INK_3 }}>{description}</div>
        </div>
      </div>
    ),
    size,
  );
}
