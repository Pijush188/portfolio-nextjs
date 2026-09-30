import { ArrowRight } from "@/components/ui/icons";

export function Hero() {
  return (
    <section id="hero">
      <h2 className="hero-h">
        <span className="l">
          <i>Hi, I&apos;m Pijush Das</i>
        </span>
        <span className="l dim">
          <i>let&apos;s build something.</i>
        </span>
      </h2>
      <div className="hero-cta">
        <a className="pill" href="#work">
          View selected work
          <ArrowRight strokeWidth={1.6} />
        </a>
        <span className="mono scroll-hint">Scroll to begin</span>
      </div>
    </section>
  );
}
