"use client";

import { useRef, useState } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import { CASES } from "@/lib/cases";
import { useFinePointer } from "@/lib/useMedia";
import { usePeekFollow } from "@/lib/usePeekFollow";
import { CaseVisual } from "./CaseVisual";
import { SimWindow } from "./SimWindow";

/** Floating window that plays a case's simulation while its row is hovered. */
export function CasePeek() {
  const { activeCase } = usePortfolio();
  const fine = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(-1);
  if (activeCase >= 0 && activeCase !== shown) setShown(activeCase);
  const c = shown >= 0 ? CASES[shown] : null;

  usePeekFollow(ref, activeCase >= 0, fine);

  return (
    <div className={`peek peek-case${activeCase >= 0 ? " on" : ""}`} ref={ref} aria-hidden="true">
      <SimWindow host={c?.host ?? ""}>
        {c && fine && <CaseVisual key={c.id} variant={c.visual} playing={activeCase >= 0} />}
      </SimWindow>
    </div>
  );
}
