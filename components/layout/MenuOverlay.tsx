"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { EMAIL, GITHUB, LINKEDIN, SECTIONS } from "@/lib/site";

const NAV = SECTIONS.filter((s) => s.id !== "hero");

export function MenuOverlay() {
  const { menuOpen, toggleMenu } = usePortfolio();
  const close = () => toggleMenu(false);
  return (
    <div id="menu" aria-hidden={!menuOpen}>
      <nav>
        {NAV.map((n, i) => (
          <a key={n.id} href={`#${n.id}`} onClick={close}>
            {n.label}
            <sup>0{i + 1}</sup>
          </a>
        ))}
      </nav>
      <div className="menu-links mono">
        <ExternalLink href={LINKEDIN}>LinkedIn</ExternalLink>
        <ExternalLink href={GITHUB}>GitHub</ExternalLink>
        <a href={EMAIL}>Email</a>
      </div>
    </div>
  );
}
