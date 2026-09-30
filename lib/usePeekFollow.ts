"use client";

import { useEffect, useRef, type RefObject } from "react";
import { pointer } from "@/lib/pointer";

/**
 * Eases a floating preview toward the pointer, offset to whichever side has room and
 * tilted by its lag. When `on` drops it freezes in place and scales down as it fades.
 */
export function usePeekFollow(ref: RefObject<HTMLElement | null>, on: boolean, enabled: boolean) {
  const state = useRef({ x: 0, y: 0, on: false });

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current!;
    const s = state.current;
    s.x = innerWidth / 2;
    s.y = innerHeight / 2;
    let raf = 0;
    const frame = () => {
      const { x: mx, y: my } = pointer;
      s.x += (mx + (mx > innerWidth * 0.62 ? -260 : 260) - s.x) * 0.1;
      s.y += (my - s.y) * 0.1;
      if (s.on) el.style.transform = `translate3d(${s.x}px,${s.y}px,0) translate(-50%,-50%) scale(1) rotate(${(mx - s.x) * 0.012}deg)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [ref, enabled]);

  useEffect(() => {
    const el = ref.current;
    const s = state.current;
    if (!on && s.on && el) el.style.transform = `translate3d(${s.x}px,${s.y}px,0) translate(-50%,-50%) scale(.86)`;
    s.on = on;
  }, [ref, on]);
}
