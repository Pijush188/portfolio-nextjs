"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { bindPointer } from "@/lib/pointer";

type PortfolioState = {
  /** Loader finished; hero text and scene intro play. */
  ready: boolean;
  markReady(): void;
  menuOpen: boolean;
  toggleMenu(force?: boolean): void;
  /** Hovered project index (fine pointers), -1 for none. */
  active: number;
  setActive(i: number): void;
  /** Last opened project; kept after close so the panel fades out with its content. */
  detailIndex: number;
  detailOpen: boolean;
  openDetail(i: number): void;
  closeDetail(): void;
};

const Ctx = createContext<PortfolioState | null>(null);

export function usePortfolio() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePortfolio must be used inside <PortfolioProvider>");
  return v;
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(bindPointer, []);

  const markReady = useCallback(() => {
    document.body.classList.remove("locked");
    document.body.classList.add("ready");
    setReady(true);
  }, []);

  const toggleMenu = useCallback((force?: boolean) => {
    setMenuOpen((open) => (force !== undefined ? force : !open));
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
  }, [menuOpen]);

  const openDetail = useCallback((i: number) => {
    setActive(-1);
    setDetailIndex(i);
    setDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => setDetailOpen(false), []);

  useEffect(() => {
    if (!detailOpen) return;
    document.body.classList.add("locked");
    return () => document.body.classList.remove("locked");
  }, [detailOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDetail();
        toggleMenu(false);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [closeDetail, toggleMenu]);

  const value = useMemo(
    () => ({ ready, markReady, menuOpen, toggleMenu, active, setActive, detailIndex, detailOpen, openDetail, closeDetail }),
    [ready, markReady, menuOpen, toggleMenu, active, detailIndex, detailOpen, openDetail, closeDetail],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
