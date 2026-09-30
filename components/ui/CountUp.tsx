"use client";

import { useEffect, useRef } from "react";
import { ease } from "@/lib/ease";
import { prefersReducedMotion } from "@/lib/useMedia";

type Props = { value: number; decimals?: number; start: boolean; duration?: number };

/** Counts from zero to `value` once `start` turns true. */
export function CountUp({ value, decimals = 0, start, duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = value.toFixed(decimals);

  useEffect(() => {
    const el = ref.current!;
    if (!start) {
      el.textContent = (0).toFixed(decimals);
      return;
    }
    if (prefersReducedMotion()) {
      el.textContent = final;
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      el.textContent = (value * ease(p)).toFixed(decimals);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, value, decimals, duration, final]);

  return (
    <span ref={ref} aria-label={final}>
      {final}
    </span>
  );
}
