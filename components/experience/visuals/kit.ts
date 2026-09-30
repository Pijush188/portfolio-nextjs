/** Shared helpers for the case-study canvas simulations. */

export const C = {
  bg: "#0b0b0b",
  ink: "#f5f5f4",
  ink2: "#c9c9c9",
  ink3: "#a39d95",
  line: "rgba(255,255,255,.12)",
  warm: "#ffb45c",
  blue: "#7fb3ff",
  red: "#ff5f57",
  green: "#28c840",
};

export type Visual = {
  /** Draw the frame at time t (seconds) into a w×h CSS-pixel canvas. */
  draw(ctx: CanvasRenderingContext2D, t: number, w: number, h: number): void;
  /** A representative time used as the still frame when motion is reduced. */
  still: number;
};

export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** 0→1 progress of t across [a, b]. */
export const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

let monoFamily = "";
export function mono(px: number, weight = 400) {
  if (!monoFamily) {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains-mono").trim();
    monoFamily = v || "ui-monospace, monospace";
  }
  return `${weight} ${px}px ${monoFamily}`;
}

let sansFamily = "";
export function sans(px: number, weight = 500) {
  if (!sansFamily) {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--font-inter").trim();
    sansFamily = v || "system-ui, sans-serif";
  }
  return `${weight} ${px}px ${sansFamily}`;
}

export function withAlpha(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}

/** Small mono caption in the top-left corner, like an instrument readout. */
export function caption(ctx: CanvasRenderingContext2D, text: string, s: number, color = C.ink2) {
  ctx.font = mono(9 * s, 500);
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  const txt = text.toUpperCase().split("").join(" ");
  ctx.fillText(txt, 14 * s, 12 * s);
}

export function ring(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, width = 1) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
