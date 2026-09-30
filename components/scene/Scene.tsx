"use client";

import { useEffect, useRef } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import { prefersReducedMotion } from "@/lib/useMedia";
import type { SceneHandle } from "./createScene";

/** Fixed full-screen WebGL canvas. three.js is loaded in its own chunk so first paint stays light. */
export function Scene() {
  const { ready } = usePortfolio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handle = useRef<SceneHandle | null>(null);
  const readyRef = useRef(ready);

  useEffect(() => {
    let cancelled = false;
    import("./createScene").then(({ createScene }) => {
      if (cancelled || !canvasRef.current) return;
      handle.current = createScene(canvasRef.current, prefersReducedMotion());
    });
    return () => {
      cancelled = true;
      handle.current?.dispose();
      handle.current = null;
    };
  }, []);

  useEffect(() => {
    if (ready && !readyRef.current) handle.current?.startIntro();
    readyRef.current = ready;
  }, [ready]);

  return <canvas id="scene" ref={canvasRef} aria-hidden="true" />;
}
