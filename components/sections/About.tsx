"use client";

import { ExternalLink } from "@/components/ui/ExternalLink";
import { ArrowUpRight } from "@/components/ui/icons";
import { GITHUB, LINKEDIN } from "@/lib/site";
import { useReveal } from "@/lib/useReveal";

export function About() {
  const [ref, shown] = useReveal<HTMLDivElement>();
  return (
    <section id="about">
      <div className="wrap">
        <div ref={ref} className={`about-grid rv${shown ? " in" : ""}`}>
          <span className="mono">About / Junior Data Scientist</span>
          <h2 className="h2">
            I pair LLMs with
            <br />
            graphs and search.
          </h2>
          <div className="about-cols">
            <p>
              I&apos;m a Junior Data Scientist at <strong>Calsoft</strong> in Kolkata, where I started as an AI/ML intern in
              early 2025. Before that I earned a B.Tech in IT at <strong>Meghnad Saha Institute of Technology</strong>.
            </p>
            <p>
              I work where LLMs meet structure: vision models that turn engineering drawings into graphs, root-cause
              engines that walk a network topology, and assistants that remember a conversation and can undo their own
              changes.
            </p>
          </div>
          <div className="about-cta btns">
            <ExternalLink className="pill" href={LINKEDIN}>
              LinkedIn
              <ArrowUpRight />
            </ExternalLink>
            <ExternalLink className="pill" href={GITHUB}>
              GitHub
              <ArrowUpRight />
            </ExternalLink>
          </div>
        </div>
      </div>
    </section>
  );
}
