"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { bindPointer } from "@/lib/pointer";

type PortfolioState = {
  /** Loader finished; hero text and scene intro play. */
  ready: boolean;
  markReady(): void;
  menuOpen: boolean;
  toggleMenu(force?: boolean): void;
  /** Hovered project / case index (fine pointers), -1 for none. */
  active: number;
  setActive(i: number): void;
  activeCase: number;
  setActiveCase(i: number): void;
  /** Hovered / expanded skill group. */
  activeSkill: number;
  setActiveSkill(i: number): void;
  /** Last opened project; kept after close so the panel fades out with its content. */
  detailIndex: number;
  detailOpen: boolean;
  openDetail(i: number): void;
  closeDetail(): void;
  caseIndex: number;
  caseOpen: boolean;
  openCase(i: number): void;
  closeCase(): void;
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
  const [activeCase, setActiveCase] = useState(-1);
  const [activeSkill, setActiveSkill] = useState(-1);
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [caseIndex, setCaseIndex] = useState(0);
  const [caseOpen, setCaseOpen] = useState(false);

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

  const openCase = useCallback((i: number) => {
    setActiveCase(-1);
    setCaseIndex(i);
    setCaseOpen(true);
  }, []);
  const closeCase = useCallback(() => setCaseOpen(false), []);

  const anyPanel = detailOpen || caseOpen;
  useEffect(() => {
    if (!anyPanel) return;
    document.body.classList.add("locked");
    return () => document.body.classList.remove("locked");
  }, [anyPanel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDetail();
        closeCase();
        toggleMenu(false);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [closeDetail, closeCase, toggleMenu]);

  const value = useMemo(
    () => ({
      ready,
      markReady,
      menuOpen,
      toggleMenu,
      active,
      setActive,
      activeCase,
      setActiveCase,
      activeSkill,
      setActiveSkill,
      detailIndex,
      detailOpen,
      openDetail,
      closeDetail,
      caseIndex,
      caseOpen,
      openCase,
      closeCase,
    }),
    [ready, markReady, menuOpen, toggleMenu, active, activeCase, activeSkill, detailIndex, detailOpen, openDetail, closeDetail, caseIndex, caseOpen, openCase, closeCase],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
