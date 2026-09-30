"use client";

import type { CSSProperties } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import type { SKILLS } from "@/lib/profile";

type Props = { skill: (typeof SKILLS)[number]; index: number; fine: boolean };

export function SkillRow({ skill: g, index, fine }: Props) {
  const { activeSkill, setActiveSkill } = usePortfolio();
  const on = activeSkill === index;

  return (
    <li
      className={`skill-row${on ? " active" : ""}`}
      style={{ "--c": g.color } as CSSProperties}
      onPointerEnter={fine ? () => setActiveSkill(index) : undefined}
    >
      <button
        className="skill-btn"
        aria-expanded={on}
        onClick={fine ? undefined : () => setActiveSkill(on ? -1 : index)}
        onFocus={fine ? () => setActiveSkill(index) : undefined}
      >
        <span className="mono skill-orbit">{g.items.length} tools</span>
        <span className="skill-main">
          <span className="skill-name">{g.group}</span>
          <span className="skill-sub">{g.items.join(" · ")}</span>
        </span>
        <span className="skill-dot" aria-hidden="true" />
      </button>
      {!fine && (
        <div className="skill-inline">
          <div>
            <p>{g.note}</p>
            <ul className="skill-chips">
              {g.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <span className="mono">Used in · {g.usedIn.join(" · ")}</span>
          </div>
        </div>
      )}
    </li>
  );
}
