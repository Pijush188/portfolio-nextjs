"use client";

import { useEffect, useRef } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import { pointer } from "@/lib/pointer";

/** Lagging ring cursor that grows into a "VIEW" badge while a project is hovered. */
export function Cursor() {
  const { active, activeCase } = usePortfolio();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    let kx = pointer.x || innerWidth / 2,
      ky = pointer.y || innerHeight / 2,
      raf = 0;
    const frame = () => {
      kx += (pointer.x - kx) * 0.28;
      ky += (pointer.y - ky) * 0.28;
      el.style.transform = `translate3d(${kx}px,${ky}px,0)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div id="cursor" ref={ref} className={active >= 0 || activeCase >= 0 ? "big" : undefined}>
      <span>{activeCase >= 0 ? "OPEN" : "VIEW"}</span>
    </div>
  );
}
