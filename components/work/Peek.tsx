"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import { BrowserWindow } from "@/components/ui/BrowserWindow";
import { PROJECTS } from "@/lib/projects";
import { makeScroller } from "@/lib/scroller";
import { useFinePointer, useReducedMotion } from "@/lib/useMedia";
import { usePeekFollow } from "@/lib/usePeekFollow";

/** Floating browser window that trails the cursor while a project row is hovered. */
export function Peek() {
  const { active } = usePortfolio();
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const peekRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Keep showing the last project while the window fades out.
  const [shown, setShown] = useState(-1);
  if (active >= 0 && active !== shown) setShown(active);
  const p = shown >= 0 ? PROJECTS[shown] : null;

  usePeekFollow(peekRef, active >= 0, fine);

  useEffect(() => {
    if (active < 0) return;
    const scroller = makeScroller(imgRef.current!, viewRef.current!, PROJECTS[active].speed);
    scroller.reset();
    if (!reduce) scroller.start();
    return () => scroller.stop();
  }, [active, reduce]);

  return (
    <div className={`peek${active >= 0 ? " on" : ""}`} ref={peekRef} aria-hidden="true">
      <BrowserWindow host={p?.host ?? ""} src={p?.img} viewRef={viewRef} imgRef={imgRef} />
    </div>
  );
}
