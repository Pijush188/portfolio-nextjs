"use client";

import { ArrowUpRight } from "@/components/ui/icons";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { GITHUB } from "@/lib/site";
import { useReveal } from "@/lib/useReveal";

const STACK = [
  ["Frontend", "JavaScript, React, GSAP, HTML & CSS"],
  ["Backend", "Java, Python"],
  ["ML & IoT", "Image classification, smart home automation"],
];

export function About() {
  const [ref, shown] = useReveal<HTMLDivElement>();
  return (
    <section id="about">
      <div className="wrap">
        <div ref={ref} className={`about-grid rv${shown ? " in" : ""}`}>
          <span className="mono">About / Student developer</span>
          <h2 className="h2">
            Learning by building,
            <br />
            shipping what I learn.
          </h2>
          <div className="about-cols">
            <p>
              I&apos;m a student at <strong>Meghnad Saha Institute of Technology</strong>, Kolkata. I learn a stack by
              rebuilding things I admire, down to the scroll timing.
            </p>
            <p>
              My work spans pixel-careful frontend clones, React apps wired to real APIs, and a deep-learning model that
              reads crop disease from a single leaf photo.
            </p>
          </div>
          <ul className="stack">
            {STACK.map(([k, v]) => (
              <li key={k}>
                <span className="mono">{k}</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
          <div className="about-cta">
            <ExternalLink className="pill" href={GITHUB}>
              Visit GitHub
              <ArrowUpRight />
            </ExternalLink>
          </div>
        </div>
      </div>
    </section>
  );
}
