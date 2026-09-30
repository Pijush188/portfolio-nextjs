"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { GITHUB } from "@/lib/site";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export function MenuOverlay() {
  const { menuOpen, toggleMenu } = usePortfolio();
  const close = () => toggleMenu(false);
  return (
    <div id="menu" aria-hidden={!menuOpen}>
      <nav>
        {NAV.map((n, i) => (
          <a key={n.href} href={n.href} onClick={close}>
            {n.label}
            <sup>0{i + 1}</sup>
          </a>
        ))}
      </nav>
      <div className="menu-links mono">
        <ExternalLink href={GITHUB}>GitHub</ExternalLink>
        <ExternalLink href="https://apple-vision-ui.vercel.app/">Vision Pro UI</ExternalLink>
        <ExternalLink href="https://you-tube-clone-iota-six.vercel.app/">VidTube</ExternalLink>
      </div>
    </div>
  );
}
