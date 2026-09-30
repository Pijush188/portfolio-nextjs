"use client";

import { useEffect, useRef } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import { ArrowLeft } from "@/components/ui/icons";
import { CASES } from "@/lib/cases";
import { CaseVisual } from "./CaseVisual";
import { Pipeline } from "./Pipeline";
import { SimWindow } from "./SimWindow";

/** Full-screen case study: the story on the left, a live simulation pinned on the right. */
export function CaseDetail() {
  const { caseIndex, caseOpen, closeCase } = usePortfolio();
  const c = CASES[caseIndex];
  const backRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!caseOpen) return;
    panelRef.current!.scrollTop = 0;
    const t = window.setTimeout(() => backRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [caseOpen, caseIndex]);

  return (
    <div
      ref={panelRef}
      className={`detail case-detail${caseOpen ? " on" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="caseTitle"
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (t === e.currentTarget || t.classList.contains("d-inner")) closeCase();
      }}
    >
      <div className="d-inner case-inner">
        <div className="case-story">
          <button className="d-back mono" ref={backRef} onClick={closeCase}>
            <ArrowLeft />
            Back to experience
          </button>
          <span className="mono">{c.kind}</span>
          <h2 className="d-title" id="caseTitle">
            {c.name}
          </h2>
          <p className="d-desc case-summary">{c.summary}</p>
          <ul className="case-status">
            {c.status.map((s) => (
              <li key={s.label} className={s.done ? "done" : "wip"}>
                <i />
                {s.label}
                <span className="mono">{s.done ? "Done" : "In progress"}</span>
              </li>
            ))}
          </ul>

          <h3 className="mono case-h">The problem</h3>
          <p className="case-problem">{c.problem}</p>

          <h3 className="mono case-h">What I built</h3>
          <ol className="case-built">
            {c.built.map((b) => (
              <li key={b.title}>
                <strong>{b.title}</strong>
                <p>{b.body}</p>
              </li>
            ))}
          </ol>

          <h3 className="mono case-h">Stack</h3>
          <div className="tags">
            {c.stack.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="case-side">
          <div className="d-win case-win">
            <SimWindow host={c.host}>
              <CaseVisual key={c.id} variant={c.visual} playing={caseOpen} runKey={caseOpen} />
            </SimWindow>
            <p className="mono d-hint">Illustrative simulation of the system</p>
          </div>
          <h3 className="mono case-h">How it flows</h3>
          <Pipeline steps={c.pipeline} />
        </div>
      </div>
    </div>
  );
}
