"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import { ProjectItem } from "@/components/work/ProjectItem";
import { PROJECTS } from "@/lib/projects";
import { useFinePointer } from "@/lib/useMedia";
import { useReveal } from "@/lib/useReveal";

export function Projects() {
  const { active, setActive } = usePortfolio();
  const fine = useFinePointer();
  const [headRef, headIn] = useReveal<HTMLDivElement>();
  const [listRef, listIn] = useReveal<HTMLUListElement>();

  const listClass = ["work-list", "rv", listIn && "in", active >= 0 && "hovering"].filter(Boolean).join(" ");

  return (
    <section id="projects">
      <div className="wrap">
        <div ref={headRef} className={`rv${headIn ? " in" : ""}`}>
          <span className="mono">Projects / Built on my own time</span>
          <h2 className="h2">
            Side projects,
            <br />
            live on the web.
          </h2>
          <div className="work-head">
            <span className="mono">Deep learning first, frontend side-quests after</span>
            <span className="mono">{fine ? "Hover a project to preview it" : "Tap a project for details"}</span>
          </div>
        </div>
        <ul ref={listRef} className={listClass} onPointerLeave={fine ? () => setActive(-1) : undefined}>
          {PROJECTS.map((p, i) => (
            <ProjectItem key={p.id} project={p} index={i} fine={fine} />
          ))}
        </ul>
      </div>
    </section>
  );
}
