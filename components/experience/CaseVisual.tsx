"use client";

import { useEffect, useRef } from "react";
import type { CaseVariant } from "@/lib/cases";
import { prefersReducedMotion } from "@/lib/useMedia";
import { createChat } from "./visuals/chat";
import type { Visual } from "./visuals/kit";
import { createPid } from "./visuals/pid";
import { createTopology } from "./visuals/topology";

const FACTORIES: Record<CaseVariant, () => Visual> = {
  topology: createTopology,
  pid: createPid,
  chat: createChat,
};

type Props = {
  variant: CaseVariant;
  /** Runs only while true and on screen; time is kept, so it resumes where it stopped. */
  playing: boolean;
  /** Restart from t=0 whenever this changes. */
  runKey?: unknown;
};

/** A looping canvas simulation of what a case-study system does. */
export function CaseVisual({ variant, playing, runKey }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(playing);
  const kick = useRef<() => void>(() => {});
  const reset = useRef<() => void>(() => {});

  useEffect(() => {
    playingRef.current = playing;
    kick.current();
  }, [playing]);

  useEffect(() => {
    reset.current();
  }, [runKey]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const visual = FACTORIES[variant]();
    const still = prefersReducedMotion();
    let w = 0,
      h = 0,
      t = still ? visual.still : 0,
      last = 0,
      raf = 0,
      visible = false;

    const paint = () => {
      if (!w || !h) return;
      ctx.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
      visual.draw(ctx, t, w, h);
    };
    const frame = (now: number) => {
      raf = 0;
      if (!visible || !playingRef.current || still) return;
      t += last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      paint();
      raf = requestAnimationFrame(frame);
    };
    const run = () => {
      if (raf || still) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    kick.current = run;
    reset.current = () => {
      t = still ? visual.still : 0;
      paint();
    };

    const ro = new ResizeObserver(([e]) => {
      w = e.contentRect.width;
      h = e.contentRect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      paint();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) run();
    });
    io.observe(canvas);
    // Fonts may land after the first paint; repaint once they do.
    document.fonts?.ready.then(paint);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      kick.current = () => {};
      reset.current = () => {};
    };
  }, [variant]);

  return <canvas ref={canvasRef} className="case-canvas" aria-hidden="true" />;
}
