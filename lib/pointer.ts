/**
 * Latest pointer position, shared by every rAF loop (cursor, peek, scene) without
 * triggering React renders. Starts at the viewport centre, like the original.
 */
export const pointer = { x: 0, y: 0 };

let bound = false;
export function bindPointer() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  pointer.x = innerWidth / 2;
  pointer.y = innerHeight / 2;
  addEventListener(
    "pointermove",
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    },
    { passive: true },
  );
}
