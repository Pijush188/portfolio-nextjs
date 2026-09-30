"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import { SkillRow } from "@/components/skills/SkillRow";
import { SKILLS } from "@/lib/profile";
import { useFinePointer } from "@/lib/useMedia";
import { useReveal } from "@/lib/useReveal";

export function Skills() {
  const { activeSkill, setActiveSkill } = usePortfolio();
  const fine = useFinePointer();
  const [headRef, headIn] = useReveal<HTMLDivElement>();
  const [listRef, listIn] = useReveal<HTMLUListElement>();

  const listClass = ["skill-list", "rv", listIn && "in", fine && activeSkill >= 0 && "hovering"].filter(Boolean).join(" ");

  return (
    <section id="skills">
      <div className="wrap">
        <div ref={headRef} className={`rv${headIn ? " in" : ""}`}>
          <span className="mono">Skills / Six groups</span>
          <h2 className="h2">
            The toolkit
            <br />
            behind the work.
          </h2>
          <div className="work-head">
            <span className="mono">Tools I use, and where I used them</span>
            <span className="mono">{fine ? "Hover a group for the full set" : "Tap a group to open it"}</span>
          </div>
        </div>
        <ul ref={listRef} className={listClass} onPointerLeave={fine ? () => setActiveSkill(-1) : undefined}>
          {SKILLS.map((g, i) => (
            <SkillRow key={g.group} skill={g} index={i} fine={fine} />
          ))}
        </ul>
      </div>
    </section>
  );
}
