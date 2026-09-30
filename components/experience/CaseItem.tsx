"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import { ArrowRight } from "@/components/ui/icons";
import type { CaseStudy } from "@/lib/cases";
import { CaseVisual } from "./CaseVisual";
import { SimWindow } from "./SimWindow";

type Props = { study: CaseStudy; index: number; fine: boolean };

export function CaseItem({ study: c, index, fine }: Props) {
  const { activeCase, setActiveCase, openCase } = usePortfolio();
  const boxRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Touch layouts play the inline simulation only while it is mostly on screen.
  useEffect(() => {
    if (fine) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(boxRef.current!);
    return () => io.disconnect();
  }, [fine]);

  return (
    <li
      className={`proj${activeCase === index ? " active" : ""}`}
      onPointerEnter={fine ? () => setActiveCase(index) : undefined}
    >
      <button className="proj-row" aria-label={`Open the ${c.name} case study`} onClick={() => openCase(index)}>
        <span className="mono proj-num case-code">{c.code}</span>
        <span>
          <span className="proj-name">{c.name}</span>
          <span className="proj-sub">
            {c.sub} · <b>{c.highlight}</b>
          </span>
        </span>
        <span className="pill proj-live">Case study</span>
        <span className="proj-arrow">
          <ArrowRight />
        </span>
      </button>
      <div className="proj-inline" ref={boxRef}>
        {!fine && (
          <SimWindow host={c.host}>
            <CaseVisual variant={c.visual} playing={inView} />
          </SimWindow>
        )}
      </div>
    </li>
  );
}
