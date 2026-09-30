export type Scroller = { start(): void; stop(): void; reset(): void };

/** Ping-pong auto-scroll of a tall screenshot inside its window viewport. */
export function makeScroller(img: HTMLImageElement, view: HTMLElement, speed: number): Scroller {
  let y = 0,
    dir = 1,
    pause = 0,
    raf = 0,
    last = 0,
    running = false;

  function tick(t: number) {
    if (!running) return;
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
    last = t;
    const max = Math.max(0, img.offsetHeight - view.clientHeight);
    if (pause > 0) {
      pause -= dt;
    } else {
      y += dir * speed * dt * (img.offsetWidth / 800) * (dir < 0 ? 3 : 1);
      if (y >= max) {
        y = max;
        dir = -1;
        pause = 1.2;
      }
      if (y <= 0) {
        y = 0;
        dir = 1;
        pause = 0.8;
      }
    }
    img.style.transform = `translate3d(0,${-y}px,0)`;
    raf = requestAnimationFrame(tick);
  }

  return {
    start() {
      if (running) return;
      running = true;
      last = 0;
      pause = 0.5;
      raf = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    reset() {
      y = 0;
      dir = 1;
      img.style.transform = "translate3d(0,0,0)";
    },
  };
}
