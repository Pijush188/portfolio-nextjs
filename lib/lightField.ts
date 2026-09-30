/**
 * Screen-space map of the WebGL scene's bright spots (galaxy core, disk, sun),
 * written by the scene every frame and read by the legibility watcher.
 * Coordinates are CSS pixels; intensity is 0..1.
 */
export type Light = { x: number; y: number; r: number; i: number };

export const lights: Light[] = [];

/** Estimated background brightness 0..1 at a viewport point. */
export function luminanceAt(x: number, y: number) {
  let dark = 1;
  for (const l of lights) {
    const d = Math.hypot(x - l.x, y - l.y);
    if (d >= l.r) continue;
    const f = 1 - d / l.r;
    dark *= 1 - l.i * f * Math.sqrt(f);
  }
  return 1 - dark;
}
