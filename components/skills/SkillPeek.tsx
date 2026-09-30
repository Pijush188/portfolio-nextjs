"use client";

import { useRef, useState, type CSSProperties } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import { SKILLS } from "@/lib/profile";
import { useFinePointer } from "@/lib/useMedia";
import { usePeekFollow } from "@/lib/usePeekFollow";

/** Floating card that trails the cursor over the skill list: the full group, and where it was used. */
export function SkillPeek() {
  const { activeSkill } = usePortfolio();
  const fine = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(-1);
  if (activeSkill >= 0 && activeSkill !== shown) setShown(activeSkill);
  const g = shown >= 0 ? SKILLS[shown] : null;

  usePeekFollow(ref, fine && activeSkill >= 0, fine);

  return (
    <div className={`peek skill-peek${fine && activeSkill >= 0 ? " on" : ""}`} ref={ref} aria-hidden="true">
      {g && (
        <div className="skill-card" key={shown} style={{ "--c": g.color } as CSSProperties}>
          <div className="skill-card-head">
            <span className="skill-dot" />
            <span className="mono">Skills</span>
            <span className="mono skill-count">{g.items.length} tools</span>
          </div>
          <h4>{g.group}</h4>
          <p>{g.note}</p>
          <ul>
            {g.items.map((s, i) => (
              <li key={s} style={{ "--i": i } as CSSProperties}>
                {s}
              </li>
            ))}
          </ul>
          <div className="skill-used">
            <span className="mono">Used in</span>
            {g.usedIn.map((u) => (
              <span key={u}>{u}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
