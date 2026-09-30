import type { ReactNode } from "react";

/** Browser-window chrome around a live simulation, with a pulsing "live" light. */
export function SimWindow({ host, children }: { host: string; children: ReactNode }) {
  return (
    <div className="win">
      <div className="win-bar">
        <i />
        <i />
        <i />
        <div className="win-url">{host}</div>
        <span className="sim-live">Sim</span>
      </div>
      <div className="win-view sim-view">{children}</div>
    </div>
  );
}
