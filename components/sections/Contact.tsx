"use client";

import { ArrowRight } from "@/components/ui/icons";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { EMAIL, GITHUB } from "@/lib/site";
import { useReveal } from "@/lib/useReveal";
import { Footer } from "./Footer";

export function Contact() {
  const [ref, shown] = useReveal<HTMLDivElement>();
  return (
    <section id="contact">
      <div className="wrap">
        <div ref={ref} className={`contact-box rv${shown ? " in" : ""}`}>
          <span className="mono">Open to internships / Collaboration</span>
          <h2 className="h2">
            Got something
            <br />
            to build?
          </h2>
          <p>
            I&apos;m looking for internships and open-source projects where I can ship real interfaces with a team. Code,
            questions and ideas all start here.
          </p>
          <div className="btns">
            <ExternalLink className="btn btn-solid" href={GITHUB}>
              Follow on GitHub
              <ArrowRight />
            </ExternalLink>
            <a className="btn btn-ghost" href={EMAIL}>
              Email me
              <ArrowRight />
            </a>
          </div>
          <div className="foot-links mono">
            <ExternalLink href={GITHUB}>GitHub</ExternalLink>
            <ExternalLink href={`${GITHUB}?tab=repositories`}>Repositories</ExternalLink>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
