"use client";

import { useEffect } from "react";
import { luminanceAt } from "@/lib/lightField";

/**
 * Text blocks whose background brightness is tracked. Children inherit the
 * block's --lum, so only block-level elements need watching.
 */
const SELECTOR = [
  "main .mono",
  "main h2",
  "main h3",
  "main p",
  "main li",
  "main .pill",
  "main .btn",
  ".topbar .mark",
  ".topbar .menu-btn",
].join(",");

// Sample points across a block, as fractions of its box.
const SAMPLES: [number, number][] = [
  [0.5, 0.5],
  [0.15, 0.5],
  [0.85, 0.5],
  [0.35, 0.2],
  [0.65, 0.8],
];

/**
 * Keeps text readable over the moving WebGL scene: each visible text block gets a
 * --lum (0..1) for how bright the scene is behind it, which CSS turns into a
 * stronger halo and brighter labels.
 */
export function Legibility() {
  useEffect(() => {
    const visible = new Set<HTMLElement>();
    const state = new WeakMap<HTMLElement, number>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) visible.add(el);
        else visible.delete(el);
      }
    });
    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    els.forEach((el) => io.observe(el));

    let raf = 0,
      last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 80) return; // ~12 updates a second is plenty
      last = now;
      for (const el of visible) {
        const r = el.getBoundingClientRect();
        let lum = 0;
        for (const [fx, fy] of SAMPLES) {
          const x = Math.min(Math.max(r.left + r.width * fx, 0), innerWidth);
          const y = Math.min(Math.max(r.top + r.height * fy, 0), innerHeight);
          lum = Math.max(lum, luminanceAt(x, y));
        }
        const prev = state.get(el) ?? 0;
        const next = prev + (lum - prev) * 0.45;
        if (Math.abs(next - prev) > 0.015 || (next < 0.01 && prev !== 0)) {
          const v = next < 0.01 ? 0 : next;
          state.set(el, v);
          el.style.setProperty("--lum", v.toFixed(2));
        }
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      els.forEach((el) => el.style.removeProperty("--lum"));
    };
  }, []);

  return null;
}
