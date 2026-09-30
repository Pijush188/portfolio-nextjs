import { ArrowRight } from "@/components/ui/icons";
import { RotatingWord } from "./RotatingWord";

// The things his systems actually read, in the order the page tells them.
const WORDS = ["networks.", "diagrams.", "schemas.", "leaves."];

export function Hero() {
  return (
    <section id="hero">
      <span className="mono hero-kicker">Junior Data Scientist · Calsoft</span>
      <h2 className="hero-h">
        <span className="l">
          <i>Hi, I&apos;m Pijush Das</i>
        </span>
        <span className="l dim">
          <i>
            I build AI that reads <RotatingWord words={WORDS} />
          </i>
        </span>
      </h2>
      <div className="hero-cta">
        <a className="pill" href="#experience">
          See what I&apos;ve built
          <ArrowRight strokeWidth={1.6} />
        </a>
        <span className="mono scroll-hint">Scroll to begin</span>
      </div>
    </section>
  );
}
