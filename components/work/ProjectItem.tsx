"use client";

import { useEffect, useRef } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import { BrowserWindow } from "@/components/ui/BrowserWindow";
import { ArrowRight } from "@/components/ui/icons";
import type { Project } from "@/lib/projects";
import { makeScroller } from "@/lib/scroller";
import { useReducedMotion } from "@/lib/useMedia";

type Props = { project: Project; index: number; fine: boolean };

export function ProjectItem({ project: p, index, fine }: Props) {
  const { active, setActive, openDetail } = usePortfolio();
  const reduce = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Touch layouts show an inline window whose screenshot autoplays while on screen.
  useEffect(() => {
    if (fine || reduce) return;
    const s = makeScroller(imgRef.current!, viewRef.current!, p.speed * 0.8);
    const io = new IntersectionObserver(([en]) => (en.isIntersecting ? s.start() : s.stop()), { threshold: 0.4 });
    io.observe(boxRef.current!);
    return () => {
      io.disconnect();
      s.stop();
    };
  }, [fine, reduce, p.speed]);

  return (
    <li
      className={`proj${active === index ? " active" : ""}`}
      onPointerEnter={fine ? () => setActive(index) : undefined}
    >
      <button className="proj-row" aria-label={`Open ${p.name} details`} onClick={() => openDetail(index)}>
        <span className="mono proj-num">0{index + 1}</span>
        <span>
          <span className="proj-name">{p.name}</span>
          <span className="proj-sub">
            {p.sub} · <b>{p.host}</b>
          </span>
        </span>
        <a
          className="pill proj-live"
          href={p.url}
          target="_blank"
          rel="noopener"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          Live demo
        </a>
        <span className="proj-arrow">
          <ArrowRight />
        </span>
      </button>
      <div className="proj-inline" ref={boxRef}>
        <BrowserWindow
          host={p.host}
          src={p.img}
          alt={`Scrolling screenshot of ${p.name}`}
          viewRef={viewRef}
          imgRef={imgRef}
        />
      </div>
    </li>
  );
}
