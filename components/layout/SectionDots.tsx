"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/site";

export function SectionDots() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id));
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = scrollY + innerHeight * 0.5;
      let cur = 0;
      els.forEach((el, i) => {
        if (el && mid >= el.offsetTop) cur = i;
      });
      setCurrent(cur);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <nav className="dots" aria-label="Sections">
      {SECTIONS.map((s, i) => (
        <a key={s.id} href={`#${s.id}`} className={i === current ? "on" : undefined}>
          <span className="mono">{s.label}</span>
        </a>
      ))}
    </nav>
  );
}
