"use client";

import { ExternalLink } from "@/components/ui/ExternalLink";
import { ArrowRight } from "@/components/ui/icons";
import { EMAIL, EMAIL_ADDRESS, GITHUB, LINKEDIN } from "@/lib/site";
import { useReveal } from "@/lib/useReveal";
import { Footer } from "./Footer";

export function Contact() {
  const [ref, shown] = useReveal<HTMLDivElement>();
  return (
    <section id="contact">
      <div className="wrap">
        <div ref={ref} className={`contact-box rv${shown ? " in" : ""}`}>
          <span className="mono">Contact / Always up for a good problem</span>
          <h2 className="h2">
            Got messy data
            <br />
            to untangle?
          </h2>
          <p>
            I like problems where an LLM alone isn&apos;t enough: graphs, vision and retrieval working together. If
            you&apos;re building something like that, or want to talk about it, write to me.
          </p>
          <div className="btns">
            <a className="btn btn-solid" href={EMAIL}>
              Email me
              <ArrowRight />
            </a>
            <ExternalLink className="btn btn-ghost" href={LINKEDIN}>
              Connect on LinkedIn
              <ArrowRight />
            </ExternalLink>
          </div>
          <div className="foot-links mono">
            <a href={EMAIL}>{EMAIL_ADDRESS}</a>
            <ExternalLink href={GITHUB}>GitHub</ExternalLink>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
