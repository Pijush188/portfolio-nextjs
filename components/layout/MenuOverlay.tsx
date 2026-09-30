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
      {/* Required attribution for the CC BY 4.0 planet textures used in the scene. */}
      <p className="mono menu-credit">
        Planet textures: <ExternalLink href="https://www.solarsystemscope.com/textures/">Solar System Scope</ExternalLink>,{" "}
        <ExternalLink href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</ExternalLink>
      </p>
    </div>
  );
}
