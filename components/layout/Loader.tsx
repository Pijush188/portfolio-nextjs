"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import { PROJECTS } from "@/lib/projects";
import { ease } from "@/lib/ease";
import { prefersReducedMotion } from "@/lib/useMedia";

const STAGES = ["Scattering stars", "Shaping the galaxy", "Framing projects", "Ready"];

export function Loader() {
  const { markReady } = usePortfolio();
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const stepRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let loaded = 0;
    for (const p of PROJECTS) {
      const im = new Image();
      im.onload = im.onerror = () => loaded++;
      im.src = p.img;
    }

    const timers: number[] = [];
    const start = performance.now();
    const minT = prefersReducedMotion() ? 300 : 2600;
    let raf = 0;

    const step = (now: number) => {
      const timeP = Math.min((now - start) / minT, 1);
      const realP = (loaded / PROJECTS.length) * 0.5 + 0.5;
      const p = Math.min(timeP, realP);
      const v = Math.round(ease(p) * 100);
      countRef.current!.textContent = String(v).padStart(3, "0");
      barRef.current!.style.width = v + "%";
      const si = Math.min(Math.floor(v / 25.01), 3);
      stageRef.current!.textContent = STAGES[si];
      stepRef.current!.textContent = `0${si + 1} / 04`;
      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        timers.push(
          window.setTimeout(() => {
            setOut(true);
            markReady();
            timers.push(window.setTimeout(() => setGone(true), 1300));
          }, 350),
        );
      }
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [markReady]);

  if (gone) return null;

  return (
    <div id="loader" className={out ? "out" : undefined} role="status" aria-live="polite">
      <div className="l-top">
        <b>PD</b>
        <span className="mono">Interactive portfolio</span>
        <span className="mono">Edition 2026</span>
      </div>
      <div className="l-mid">
        <span className="mono">Frontend / React / Machine learning</span>
        <h1 className="l-name">
          <span>
            <i>PIJUSH</i>
          </span>
          <span>
            <i>DAS</i>
          </span>
        </h1>
        <div className="l-meter">
          <div className="l-count">
            <span ref={countRef}>000</span>
            <sup>%</sup>
          </div>
          <div>
            <div className="l-bar">
              <i ref={barRef} />
            </div>
            <div className="l-bar-meta">
              <span className="mono" ref={stageRef} style={{ color: "var(--ink-2)" }}>
                {STAGES[0]}
              </span>
              <span className="mono" ref={stepRef}>
                01 / 04
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="l-bot">
        <span className="mono">Built in Kolkata</span>
        <span className="mono">Scroll-driven WebGL experience</span>
      </div>
    </div>
  );
}
