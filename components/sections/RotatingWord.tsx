"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import { useReducedMotion } from "@/lib/useMedia";

/** Cycles words with the hero's rise motion; the slot eases its width to fit each word. */
export function RotatingWord({ words, every = 2400 }: { words: string[]; every?: number }) {
  const { ready } = usePortfolio();
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [width, setWidth] = useState<number>();
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!ready || reduce) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), every);
    return () => clearInterval(id);
  }, [ready, reduce, every, words.length]);

  useEffect(() => {
    const measure = () => setWidth(refs.current[i]?.offsetWidth);
    measure();
    document.fonts?.ready.then(measure);
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [i]);

  return (
    <span className="rot" style={{ width }} aria-live="off">
      <span className="sr-only">{words.join(" ")}</span>
      {words.map((w, k) => (
        <span
          key={w}
          ref={(el) => {
            refs.current[k] = el;
          }}
          aria-hidden="true"
          className={k === i ? "cur" : k === (i - 1 + words.length) % words.length ? "prev" : undefined}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
