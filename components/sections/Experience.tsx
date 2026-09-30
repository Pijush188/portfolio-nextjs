"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import { CaseItem } from "@/components/experience/CaseItem";
import { CASES } from "@/lib/cases";
import { ROLES } from "@/lib/profile";
import { useFinePointer } from "@/lib/useMedia";
import { useReveal } from "@/lib/useReveal";

export function Experience() {
  const { activeCase, setActiveCase } = usePortfolio();
  const fine = useFinePointer();
  const [headRef, headIn] = useReveal<HTMLDivElement>();
  const [listRef, listIn] = useReveal<HTMLUListElement>();

  const listClass = ["work-list", "case-list", "rv", listIn && "in", activeCase >= 0 && "hovering"]
    .filter(Boolean)
    .join(" ");

  return (
    <section id="experience">
      <div className="wrap">
        <div ref={headRef} className={`xp-head rv${headIn ? " in" : ""}`}>
          <span className="mono">Experience / Calsoft, Kolkata</span>
          <h2 className="h2">
            Systems that reason
            <br />
            over messy data.
          </h2>
          <ol className="roles">
            {ROLES.map((r) => (
              <li key={r.title} className={r.current ? "now" : undefined}>
                <span className="mono">{r.when}</span>
                <span className="role-title">{r.title}</span>
                <span className="role-org">{r.org}</span>
              </li>
            ))}
          </ol>
          <div className="work-head">
            <span className="mono">Case studies / Enterprise work</span>
            <span className="mono">{fine ? "Hover a case to watch it run" : "Tap a case for the full story"}</span>
          </div>
        </div>
        <ul ref={listRef} className={listClass} onPointerLeave={fine ? () => setActiveCase(-1) : undefined}>
          {CASES.map((c, i) => (
            <CaseItem key={c.id} study={c} index={i} fine={fine} />
          ))}
        </ul>
        <p className="mono xp-note">Client names are left out. Simulations are illustrative, not client data.</p>
      </div>
    </section>
  );
}
