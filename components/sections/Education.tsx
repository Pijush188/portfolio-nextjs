"use client";

import { CountUp } from "@/components/ui/CountUp";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ArrowUpRight } from "@/components/ui/icons";
import { CERTIFICATES, DEGREE, SCHOOL } from "@/lib/profile";
import { useReveal } from "@/lib/useReveal";

export function Education() {
  const [headRef, headIn] = useReveal<HTMLDivElement>();
  const [bodyRef, bodyIn] = useReveal<HTMLDivElement>();

  return (
    <section id="education">
      <div className="wrap">
        <div ref={headRef} className={`rv${headIn ? " in" : ""}`}>
          <span className="mono">Education / Degree, school &amp; awards</span>
          <h2 className="h2">Where I learned it.</h2>
        </div>

        <div ref={bodyRef} className={`edu-grid rv${bodyIn ? " in" : ""}`}>
          <div>
            <article className="degree">
              <div>
                <span className="mono">{DEGREE.when}</span>
                <h3>{DEGREE.what}</h3>
                <p>
                  {DEGREE.school}, {DEGREE.place}
                </p>
              </div>
              <div className="degree-score">
                <span className="stat-num">
                  <CountUp value={DEGREE.cgpa} decimals={2} start={bodyIn} />
                </span>
                <span className="mono">CGPA</span>
              </div>
            </article>
            <ol className="school">
              {SCHOOL.map((s) => (
                <li key={s.what}>
                  <span className="mono">{s.when}</span>
                  <span>
                    <strong>{s.what}</strong>
                    <span>{s.school}</span>
                  </span>
                  <span className="school-score">{s.score}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="mono case-h">Awards &amp; certificates</h3>
            <ul className="certs">
              {CERTIFICATES.map((c) => (
                <li key={c.name}>
                  <ExternalLink href={c.href}>
                    <span>
                      <span className="mono">{c.kind}</span>
                      <strong>{c.name}</strong>
                      <span className="cert-detail">{c.detail}</span>
                    </span>
                    <ArrowUpRight />
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
