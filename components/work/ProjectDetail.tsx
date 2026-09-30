"use client";

import { useEffect, useRef } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import { BrowserWindow } from "@/components/ui/BrowserWindow";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import { PROJECTS } from "@/lib/projects";
import { useReducedMotion } from "@/lib/useMedia";

/** Full-screen project panel with a user-scrollable, self-scrolling screenshot. */
export function ProjectDetail() {
  const { detailIndex, detailOpen, closeDetail } = usePortfolio();
  const reduce = useReducedMotion();
  const p = PROJECTS[detailIndex];
  const viewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const userScrolled = useRef(false);

  // Any manual interaction with the window hands scrolling over to the user.
  useEffect(() => {
    const view = viewRef.current!;
    const take = () => (userScrolled.current = true);
    const evs = ["wheel", "touchstart", "pointerdown"] as const;
    evs.forEach((ev) => view.addEventListener(ev, take, { passive: true }));
    return () => evs.forEach((ev) => view.removeEventListener(ev, take));
  }, []);

  useEffect(() => {
    if (!detailOpen) return;
    const view = viewRef.current!;
    const img = imgRef.current!;
    view.scrollTop = 0;
    userScrolled.current = false;
    const focusT = window.setTimeout(() => backRef.current?.focus(), 50);
    if (reduce) return () => clearTimeout(focusT);

    let raf = 0,
      last = 0,
      wait = 0.9,
      resetT = 0;
    const step = (t: number) => {
      if (userScrolled.current) return;
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      if (wait > 0) wait -= dt;
      else {
        view.scrollTop += p.speed * dt * (img.offsetWidth / 800);
        if (view.scrollTop + view.clientHeight >= view.scrollHeight - 1) {
          wait = 1.4;
          resetT = window.setTimeout(() => {
            if (!userScrolled.current) view.scrollTo({ top: 0, behavior: "smooth" });
          }, 1200);
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resetT);
      clearTimeout(focusT);
    };
  }, [detailOpen, detailIndex, reduce, p.speed]);

  return (
    <div
      className={`detail${detailOpen ? " on" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="projectTitle"
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (t === e.currentTarget || t.classList.contains("d-inner")) closeDetail();
      }}
    >
      <div className="d-inner">
        <div>
          <button className="d-back mono" ref={backRef} onClick={closeDetail}>
            <ArrowLeft />
            Back to projects
          </button>
          <span className="mono">{p.kind}</span>
          <h2 className="d-title" id="projectTitle">
            {p.name}
          </h2>
          <p className="d-desc">{p.desc}</p>
          <p className="d-note" hidden={!p.note}>
            {p.note}
          </p>
          <div className="tags">
            {p.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="btns">
            <ExternalLink className="btn btn-solid" href={p.url}>
              Launch live demo <ArrowRight />
            </ExternalLink>
            {p.repo && (
              <ExternalLink className="btn btn-ghost" href={p.repo}>
                Source code <ArrowRight />
              </ExternalLink>
            )}
          </div>
        </div>
        <div className="d-win">
          <BrowserWindow
            host={p.host}
            src={p.img}
            alt={`Screenshot of ${p.name}`}
            viewRef={viewRef}
            imgRef={imgRef}
          />
          <p className="mono d-hint">Scroll inside the window to explore</p>
        </div>
      </div>
    </div>
  );
}
