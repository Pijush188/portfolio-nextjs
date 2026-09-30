import type { CSSProperties } from "react";

/** The system's stages in order; a signal travels through them on a loop. */
export function Pipeline({ steps }: { steps: string[] }) {
  return (
    <ol className="pipe" style={{ "--n": steps.length } as CSSProperties} aria-label="Pipeline">
      {steps.map((s, i) => (
        <li key={s} style={{ "--i": i } as CSSProperties}>
          <i />
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}
