"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import { BrowserWindow } from "@/components/ui/BrowserWindow";
import { pointer } from "@/lib/pointer";
import { PROJECTS } from "@/lib/projects";
import { makeScroller } from "@/lib/scroller";
import { useFinePointer, useReducedMotion } from "@/lib/useMedia";

/** Floating browser window that trails the cursor while a project row is hovered. */
export function Peek() {
  const { active } = usePortfolio();
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const peekRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const pos = useRef({ x: 0, y: 0, on: false });

  // Keep showing the last project while the window fades out.
  const [shown, setShown] = useState(-1);
  if (active >= 0 && active !== shown) setShown(active);
  const p = shown >= 0 ? PROJECTS[shown] : null;

  // Follow loop: eased toward the pointer, offset to whichever side has room, tilted by lag.
  useEffect(() => {
    if (!fine) return;
    const el = peekRef.current!;
    const s = pos.current;
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
  }, [fine]);

  useEffect(() => {
    const el = peekRef.current!;
    const s = pos.current;
    if (active < 0) {
      if (s.on) el.style.transform = `translate3d(${s.x}px,${s.y}px,0) translate(-50%,-50%) scale(.86)`;
      s.on = false;
      return;
    }
    const scroller = makeScroller(imgRef.current!, viewRef.current!, PROJECTS[active].speed);
    scroller.reset();
    if (!reduce) scroller.start();
    s.on = true;
    return () => scroller.stop();
  }, [active, reduce]);

  return (
    <div id="peek" ref={peekRef} className={active >= 0 ? "on" : undefined} aria-hidden="true">
      <BrowserWindow host={p?.host ?? ""} src={p?.img} viewRef={viewRef} imgRef={imgRef} />
    </div>
  );
}
