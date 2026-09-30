"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/useMedia";

/** Elements that already have their own hover treatment; the trail stays quiet over them. */
const INTERACTIVE = "a,button,input,textarea,select,label,[role=button],.proj,.skill-row,.peek,.win";

type Star = { x: number; y: number; vx: number; vy: number; life: number; age: number; size: number; sprite: number; phase: number };

// Star tints: warm white, pale gold, cool blue-white — sampled with those weights.
const TINTS = [
  { core: "255,255,255", halo: "255,236,210", w: 0.55 },
  { core: "255,246,225", halo: "255,196,120", w: 0.25 },
  { core: "245,250,255", halo: "160,190,255", w: 0.2 },
];

/** Pre-render one star: hot core, soft coloured halo, optional diffraction spikes. */
function makeSprite(core: string, halo: string, spikes: boolean) {
  const S = 64,
    c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const m = S / 2;
  const glow = g.createRadialGradient(m, m, 0, m, m, m);
  glow.addColorStop(0, `rgba(${core},1)`);
  glow.addColorStop(0.08, `rgba(${core},0.95)`);
  glow.addColorStop(0.22, `rgba(${halo},0.35)`);
  glow.addColorStop(0.5, `rgba(${halo},0.08)`);
  glow.addColorStop(1, `rgba(${halo},0)`);
  g.fillStyle = glow;
  g.fillRect(0, 0, S, S);
  if (spikes) {
    g.globalCompositeOperation = "lighter";
    for (const [dx, dy] of [
      [1, 0],
      [0, 1],
    ]) {
      const lg = g.createLinearGradient(m - dx * m, m - dy * m, m + dx * m, m + dy * m);
      lg.addColorStop(0, `rgba(${halo},0)`);
      lg.addColorStop(0.5, `rgba(${core},0.7)`);
      lg.addColorStop(1, `rgba(${halo},0)`);
      g.fillStyle = lg;
      if (dx) g.fillRect(0, m - 0.6, S, 1.2);
      else g.fillRect(m - 0.6, 0, 1.2, S);
    }
  }
  return c;
}

/**
 * Stardust trail: in plain parts of the page, moving the cursor leaves a faint warm glow
 * and sheds tiny stars that twinkle as they drift down and fade. Fine pointers only.
 */
export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches || prefersReducedMotion()) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const sprites = TINTS.flatMap((t) => [makeSprite(t.core, t.halo, false), makeSprite(t.core, t.halo, true)]);
    const pickTint = () => {
      let r = Math.random();
      for (let i = 0; i < TINTS.length; i++) {
        if ((r -= TINTS[i].w) <= 0) return i;
      }
      return 0;
    };

    let w = 0,
      h = 0,
      dpr = 1;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth;
      h = innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    addEventListener("resize", resize);

    const stars: Star[] = [];
    let mx = -1e4,
      my = -1e4,
      gx = mx,
      gy = my,
      glow = 0, // 0..1, rises with movement, decays when still
      speed = 0,
      carry = 0, // distance travelled since the last star
      quiet = true,
      raf = 0,
      last = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target as Element | null;
      quiet = !!t?.closest?.(INTERACTIVE) || document.body.classList.contains("locked");
      const dx = e.clientX - mx,
        dy = e.clientY - my;
      const d = mx < -1e3 ? 0 : Math.hypot(dx, dy);
      mx = e.clientX;
      my = e.clientY;
      if (gx < -1e3) {
        gx = mx;
        gy = my;
      }
      speed = Math.min(speed + d, 400);
      if (!quiet) {
        carry += d;
        while (carry > 10 && stars.length < 260) {
          carry -= 10;
          const f = carry / Math.max(d, 1); // spread along the stroke
          const big = Math.random() < 0.1;
          stars.push({
            x: mx - dx * f + (Math.random() - 0.5) * 6,
            y: my - dy * f + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 18 - dx * 0.4,
            vy: 12 + Math.random() * 30,
            life: 0.9 + Math.random() * 1.1,
            age: 0,
            size: big ? 9 + Math.random() * 5 : 3 + Math.random() * 4.5,
            sprite: pickTint() * 2 + (big ? 1 : 0),
            phase: Math.random() * 6.28,
          });
        }
      } else carry = 0;
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      speed *= Math.pow(0.02, dt); // decays within a fraction of a second
      const target = quiet ? 0 : Math.min(speed / 120, 1);
      glow += (target - glow) * Math.min(dt * 6, 1);
      gx += (mx - gx) * Math.min(dt * 14, 1);
      gy += (my - gy) * Math.min(dt * 14, 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      if (glow > 0.01) {
        const r = 70 + 30 * glow;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
        g.addColorStop(0, `rgba(255,214,160,${0.13 * glow})`);
        g.addColorStop(0.45, `rgba(255,170,110,${0.05 * glow})`);
        g.addColorStop(1, "rgba(255,150,90,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.fillRect(gx - r, gy - r, r * 2, r * 2);
      }

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.age += dt;
        if (s.age >= s.life) {
          stars.splice(i, 1);
          continue;
        }
        s.vy += 38 * dt; // gentle fall
        s.vx *= Math.pow(0.35, dt);
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const k = s.age / s.life;
        const fade = k < 0.12 ? k / 0.12 : Math.pow(1 - (k - 0.12) / 0.88, 1.6);
        const twinkle = 0.7 + 0.3 * Math.sin(now * 0.018 + s.phase);
        const size = s.size * (1 - 0.35 * k);
        ctx.globalAlpha = fade * twinkle;
        ctx.drawImage(sprites[s.sprite], s.x - size, s.y - size, size * 2, size * 2);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (stars.length || glow > 0.01) raf = requestAnimationFrame(tick);
      else {
        raf = 0;
        ctx.clearRect(0, 0, w, h);
      }
    };

    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="cursor-trail" aria-hidden="true" />;
}
