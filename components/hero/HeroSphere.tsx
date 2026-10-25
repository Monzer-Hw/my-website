"use client";

import { useEffect, useRef, useState } from "react";
import { HalftoneRing } from "./HalftoneRing";

/**
 * Hero background: tens of thousands of ink dots on a sphere that slowly turns while the dots
 * fold into moving ribbons (plain WebGL, spec 4.7 as revised by the owner).
 * - Static frame for visitors who prefer reduced motion.
 * - Paused while the hero is off screen or the tab is hidden; resumes where it left off.
 * - Dots are softened behind the text column so the copy stays readable.
 * - Without WebGL, or when WebGL is software-rendered, falls back to the 2D halftone ring.
 * `data-state` ("running" | "paused" | "static") and `data-frames` expose this to the tests.
 */

// Tunables (from the owner's design artifact)
const DOT = 1.3; // dot size in CSS px
const INK = 0.22; // opacity of a single dot; overlaps darken
const FLOW = 0.11; // how fast the ribbons change
const SPIN = 0.045; // rotation speed, radians per second
const FOLD = 0.62; // how strongly dots bunch into ribbons
const INTRO_S = 1.6; // dots fade in over this many seconds

const VERTEX = `
attribute vec3 aPos; attribute float aSeed;
uniform vec2 uRes, uCenter; uniform float uRadius, uTime, uRot, uIntro, uDpr, uSize, uLeft;
varying float vA;
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z); vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy; vec4 y = y_ * ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y); vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
void main(){
  vec3 q = aPos * 1.25;
  vec3 off = vec3(snoise(q + vec3(0.0, 0.0, uTime)), snoise(q + vec3(17.1, 3.2, uTime)), snoise(q + vec3(-9.7, 23.4, uTime)));
  vec3 p = normalize(aPos + off * ${FOLD.toFixed(3)});
  float c = cos(uRot), s = sin(uRot);
  p = vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z);
  p = vec3(p.x, 0.94*p.y - 0.34*p.z, 0.34*p.y + 0.94*p.z);
  float persp = 1.0 / (1.0 - p.z * 0.22);
  vec2 px = uCenter + vec2(p.x, -p.y) * uRadius * persp;
  gl_Position = vec4(px.x / uRes.x * 2.0 - 1.0, 1.0 - px.y / uRes.y * 2.0, 0.0, 1.0);
  float front = smoothstep(-0.7, 0.7, p.z);
  float intro = clamp(uIntro * 1.4 - aSeed * 0.4, 0.0, 1.0);
  // Soften dots behind the text column so the copy stays readable
  float soft = mix(uLeft, 1.0, smoothstep(0.1, 0.55, px.x / uRes.x));
  vA = mix(0.3, 1.0, front) * intro * soft;
  gl_PointSize = uSize * uDpr * mix(0.75, 1.15, front) * persp;
}`;

const FRAGMENT = `
precision mediump float;
varying float vA;
uniform float uInk;
uniform vec3 uColor;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  if (dot(d, d) > 0.25) discard;
  float a = uInk * vA;
  gl_FragColor = vec4(uColor * a, a);
}`;

/** "#000000" → [0, 0, 0] in 0..1, for the shader. */
function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [0, 0, 0];
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/**
 * True when WebGL is drawn by the CPU (no GPU, or hardware acceleration turned off): this many
 * dots then block the main thread for tens of milliseconds per frame, so the ring is used instead.
 */
function isSoftware(gl: WebGLRenderingContext) {
  let name = String(gl.getParameter(gl.RENDERER));
  // Chromium reports a generic name here and the real one through this extension;
  // Firefox and Safari report it directly (Firefox warns when the extension is requested).
  if (name === "WebKit WebGL") {
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) name = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
  }
  return SOFTWARE.test(name);
}

export function HeroSphere() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl || isSoftware(gl)) {
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      setFallback(true);
      return;
    }

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "");
      return shader;
    };
    const program = gl.createProgram()!;
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "");
    } catch {
      setFallback(true);
      return;
    }
    gl.useProgram(program);

    // Evenly spread points on a unit sphere (Fibonacci lattice), each with a seed for the fade-in.
    // A deterministic seed keeps renders identical between visits.
    const count = window.innerWidth < 900 ? 32000 : 70000;
    const data = new Float32Array(count * 4);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - ((i + 0.5) / count) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * golden;
      data.set([Math.cos(th) * r, y, Math.sin(th) * r, Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1], i * 4);
    }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    const aSeed = gl.getAttribLocation(program, "aSeed");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(aSeed);
    gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 16, 12);

    const U = (name: string) => gl.getUniformLocation(program, name);
    const u = {
      res: U("uRes"), center: U("uCenter"), radius: U("uRadius"), time: U("uTime"), rot: U("uRot"),
      intro: U("uIntro"), dpr: U("uDpr"), size: U("uSize"), ink: U("uInk"), left: U("uLeft"), color: U("uColor"),
    };
    const ink = getComputedStyle(document.documentElement).getPropertyValue("--color-ink");
    gl.uniform3f(u.color, ...hexToRgb(ink || "#000000"));

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = rect.width;
      const H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const narrow = W < 900;
      gl.uniform2f(u.res, W, H);
      // Narrow: behind the name and intro, where the ring sat, clear of the small fact lines.
      gl.uniform2f(u.center, W * (narrow ? 0.5 : 0.56), H * (narrow ? 0.3 : 0.52));
      gl.uniform1f(u.radius, Math.min(W * (narrow ? 0.5 : 0.42), H * 0.5));
      gl.uniform1f(u.dpr, dpr);
      gl.uniform1f(u.size, DOT);
      gl.uniform1f(u.ink, INK);
      gl.uniform1f(u.left, narrow ? 0.6 : 0.55);
    };

    let frames = 0;
    const render = (seconds: number, intro: number) => {
      gl.uniform1f(u.time, 7.3 + seconds * FLOW);
      gl.uniform1f(u.rot, seconds * SPIN);
      gl.uniform1f(u.intro, intro);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
      if (++frames % 30 === 0) canvas.dataset.frames = String(frames);
    };

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let elapsed = 0;
    let last = 0;
    let onScreen = true;

    const loop = (now: number) => {
      elapsed += Math.min(0.1, (now - last) / 1000);
      last = now;
      render(elapsed, Math.min(1, elapsed / INTRO_S));
      raf = requestAnimationFrame(loop);
    };

    const update = () => {
      const reduce = motion.matches;
      const run = !reduce && onScreen && !document.hidden;
      if (run && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      if (reduce) render(0, 1);
      canvas.dataset.state = reduce ? "static" : run ? "running" : "paused";
    };

    size();
    update();

    const resize = new ResizeObserver(() => {
      size();
      if (!raf) render(elapsed, motion.matches ? 1 : Math.min(1, elapsed / INTRO_S));
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
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  if (fallback) return <HalftoneRing />;

  return (
    <canvas
      ref={ref}
      data-hero-bg="sphere"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full [mask-image:linear-gradient(180deg,#000_70%,transparent)]"
    />
  );
}
