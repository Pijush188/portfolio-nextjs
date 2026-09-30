"use client";

import { usePortfolio } from "@/components/PortfolioProvider";

export function Topbar() {
  const { menuOpen, toggleMenu } = usePortfolio();
  return (
    <header className="topbar">
      <a href="#hero" className="mark" aria-label="Pijush Das, home">
        <em>PD</em>
        <span>Pijush Das</span>
      </a>
      <button className="menu-btn" aria-expanded={menuOpen} aria-controls="menu" onClick={() => toggleMenu()}>
        <span>{menuOpen ? "CLOSE" : "MENU"}</span>
        <span className="burger" />
      </button>
    </header>
  );
}
