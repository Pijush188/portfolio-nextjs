import { C, caption, dot, easeOut, mono, span, withAlpha, type Visual } from "./kit";

/**
 * Tile scan: an overlapping window sweeps a P&ID drawing and tags each symbol,
 * the drawing collapses into a component graph, then an English question
 * becomes Cypher and lights up the matching edges.
 */
type Kind = "inst" | "valve" | "pump" | "vessel";
type Sym = { id: string; kind: Kind; x: number; y: number; label: string };

const SYMS: Sym[] = [
  { id: "V-101", kind: "vessel", x: 0.09, y: 0.51, label: "vessel" },
  { id: "XV-101", kind: "valve", x: 0.27, y: 0.28, label: "shutoff valve" },
  { id: "FCV-102", kind: "valve", x: 0.5, y: 0.28, label: "control valve" },
  { id: "FT-103", kind: "inst", x: 0.39, y: 0.07, label: "flow transmitter" },
  { id: "TT-104", kind: "inst", x: 0.82, y: 0.07, label: "temp transmitter" },
  { id: "P-105", kind: "pump", x: 0.38, y: 0.74, label: "pump" },
  { id: "HV-106", kind: "valve", x: 0.22, y: 0.74, label: "hand valve" },
  { id: "PCV-107", kind: "valve", x: 0.66, y: 0.51, label: "pressure valve" },
  { id: "PT-108", kind: "inst", x: 0.53, y: 0.55, label: "pressure transmitter" },
  { id: "LT-109", kind: "inst", x: 0.09, y: 0.05, label: "level transmitter" },
  { id: "LIC-110", kind: "inst", x: 0.22, y: 0.05, label: "level controller" },
  { id: "FI-111", kind: "inst", x: 0.84, y: 0.95, label: "flow indicator" },
];
const S = Object.fromEntries(SYMS.map((s) => [s.id, s]));

/** Process piping as polylines in normalised drawing coordinates. */
const PIPES: [number, number][][] = [
  [[0.13, 0.28], [0.97, 0.28]],
  [[0.13, 0.74], [0.97, 0.74]],
  [[0.66, 0.28], [0.66, 0.74]],
  [[0.39, 0.12], [0.39, 0.28]],
  [[0.82, 0.12], [0.82, 0.28]],
  [[0.84, 0.74], [0.84, 0.9]],
  [[0.09, 0.1], [0.09, 0.2]],
];
const SIGNALS: [string, string][] = [
  ["FT-103", "FCV-102"],
  ["PT-108", "PCV-107"],
  ["LT-109", "LIC-110"],
  ["LIC-110", "XV-101"],
];
const EDGES: { a: string; b: string; signal: boolean }[] = [
  { a: "V-101", b: "XV-101", signal: false },
  { a: "XV-101", b: "FCV-102", signal: false },
  { a: "FCV-102", b: "TT-104", signal: false },
  { a: "FCV-102", b: "PCV-107", signal: false },
  { a: "V-101", b: "HV-106", signal: false },
  { a: "HV-106", b: "P-105", signal: false },
  { a: "P-105", b: "PCV-107", signal: false },
  { a: "PCV-107", b: "FI-111", signal: false },
  ...SIGNALS.map(([a, b]) => ({ a, b, signal: true })),
];

const TILE_W = 0.42,
  TILE_H = 0.62;
const TILES: [number, number][] = [];
for (const y of [-0.05, 0.43]) for (const x of [-0.03, 0.29, 0.61]) TILES.push([x, y]);
const SCAN0 = 0.4,
  TILE_T = 0.8,
  GRAPH0 = SCAN0 + TILES.length * TILE_T + 0.3,
  QUERY0 = GRAPH0 + 2.8,
  CYCLE = 12.5;
const QUERY = "MATCH (i:Instrument)-[:SENDS_SIGNAL_TO]->(v) RETURN i, v";

/** When each symbol is first covered by the scanning tile. */
const DETECT = Object.fromEntries(
  SYMS.map((s) => {
    const k = TILES.findIndex(([x, y]) => s.x >= x && s.x <= x + TILE_W && s.y >= y && s.y <= y + TILE_H);
    const [tx] = TILES[k];
    return [s.id, SCAN0 + k * TILE_T + 0.15 + ((s.x - tx) / TILE_W) * 0.5];
  }),
);

export function createPid(): Visual {
  return {
    still: QUERY0 + 2.6,
    draw(ctx, time, w, h) {
      const s = Math.max(0.7, Math.min(w / 440, 1.6));
      const t = time % CYCLE;
      const fade = 1 - span(t, CYCLE - 0.7, CYCLE - 0.1);
      const padX = 22 * s,
        top = 34 * s,
        bottom = 36 * s;
      const X = (nx: number) => padX + nx * (w - padX * 2);
      const Y = (ny: number) => top + ny * (h - top - bottom);
      const graphK = easeOut(span(t, GRAPH0, GRAPH0 + 0.8));
      const drawingA = (1 - 0.78 * graphK) * fade;

      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);

      // faint engineering grid
      ctx.strokeStyle = "rgba(255,255,255,.035)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx <= 20; gx++) {
        ctx.beginPath();
        ctx.moveTo(X(gx / 20), Y(-0.06));
        ctx.lineTo(X(gx / 20), Y(1.04));
        ctx.stroke();
      }

      // drawing: pipes, signals, symbols
      ctx.globalAlpha = drawingA;
      ctx.strokeStyle = C.ink2;
      ctx.lineWidth = 1.3 * s;
      PIPES.forEach((pl) => {
        ctx.beginPath();
        pl.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))));
        ctx.stroke();
      });
      ctx.setLineDash([3 * s, 3 * s]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = C.ink3;
      SIGNALS.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(X(S[a].x), Y(S[a].y));
        ctx.lineTo(X(S[b].x), Y(S[b].y));
        ctx.stroke();
      });
      ctx.setLineDash([]);
      SYMS.forEach((sym) => drawSymbol(ctx, sym, X(sym.x), Y(sym.y), s, h - top - bottom));
      ctx.globalAlpha = 1;

      // scanning tile + detections
      const scanning = t >= SCAN0 && t < GRAPH0 - 0.3;
      if (scanning) {
        const k = Math.min(Math.floor((t - SCAN0) / TILE_T), TILES.length - 1);
        const [tx, ty] = TILES[k];
        const x0 = X(tx),
          y0 = Y(ty),
          x1 = X(tx + TILE_W),
          y1 = Y(ty + TILE_H);
        ctx.fillStyle = "rgba(127,179,255,.06)";
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        ctx.strokeStyle = withAlpha(C.blue, 0.7);
        ctx.lineWidth = 1;
        ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
        const sweep = y0 + (y1 - y0) * (((t - SCAN0) % TILE_T) / TILE_T);
        ctx.fillStyle = withAlpha(C.blue, 0.5);
        ctx.fillRect(x0, sweep, x1 - x0, 1);
      }
      if (graphK < 1) {
        SYMS.forEach((sym) => {
          const a = span(t, DETECT[sym.id], DETECT[sym.id] + 0.2) * (1 - graphK) * fade;
          if (a > 0) bracket(ctx, sym, X(sym.x), Y(sym.y), s, a);
        });
      }

      // graph
      if (graphK > 0) {
        const hit = t > QUERY0 + 1.9;
        EDGES.forEach((e, i) => {
          const k = easeOut(span(t, GRAPH0 + 0.3 + i * 0.1, GRAPH0 + 0.7 + i * 0.1)) * fade;
          if (k <= 0) return;
          const ax = X(S[e.a].x),
            ay = Y(S[e.a].y),
            bx = X(S[e.b].x),
            by = Y(S[e.b].y);
          const lit = hit && e.signal;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax + (bx - ax) * k, ay + (by - ay) * k);
          ctx.strokeStyle = e.signal ? withAlpha(C.blue, lit ? 0.95 : 0.45) : withAlpha(C.warm, hit ? 0.25 : 0.6);
          ctx.lineWidth = (lit ? 2 : 1.2) * s;
          if (e.signal && !lit) ctx.setLineDash([3 * s, 3 * s]);
          ctx.stroke();
          ctx.setLineDash([]);
          if (lit) {
            const f = (time * 0.9 + i * 0.2) % 1;
            dot(ctx, ax + (bx - ax) * f, ay + (by - ay) * f, 2.2 * s, C.blue);
          }
        });
        SYMS.forEach((sym) => {
          const inHit = hit && SIGNALS.some(([a, b]) => a === sym.id || b === sym.id);
          const r = (sym.kind === "vessel" ? 5 : 3.6) * s;
          dot(ctx, X(sym.x), Y(sym.y), r, withAlpha(inHit ? C.blue : C.warm, graphK * fade));
          ctx.font = mono(7 * s);
          ctx.fillStyle = withAlpha(C.ink2, graphK * fade);
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(sym.id, X(sym.x), Y(sym.y) + r + 3 * s);
        });
      }

      // query bar
      const qa = span(t, QUERY0 - 0.2, QUERY0) * fade;
      if (qa > 0) {
        const bh = 20 * s,
          by = h - bh - 9 * s;
        ctx.globalAlpha = qa;
        ctx.fillStyle = "rgba(20,20,22,.95)";
        ctx.strokeStyle = C.line;
        ctx.beginPath();
        ctx.roundRect(12 * s, by, w - 24 * s, bh, 6 * s);
        ctx.fill();
        ctx.stroke();
        const n = Math.floor(span(t, QUERY0, QUERY0 + 1.7) * QUERY.length);
        ctx.font = mono(8 * s);
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = C.warm;
        ctx.fillText("›", 20 * s, by + bh / 2);
        ctx.fillStyle = C.ink;
        const caret = n < QUERY.length && Math.floor(time * 3) % 2 === 0 ? "▍" : "";
        ctx.fillText(QUERY.slice(0, n) + caret, 32 * s, by + bh / 2);
        ctx.globalAlpha = 1;
      }

      const k = Math.min(Math.floor((t - SCAN0) / TILE_T) + 1, TILES.length);
      const found = SYMS.filter((x) => t > DETECT[x.id]).length;
      const phase =
        t < SCAN0
          ? "P&ID loaded · 1 page"
          : t < GRAPH0
            ? `Tile ${k}/${TILES.length} · Gemini vision · ${found} symbols`
            : t < QUERY0
              ? `Graph assembled · ${SYMS.length} nodes · ${EDGES.length} edges`
              : t < QUERY0 + 1.9
                ? "Question → Cypher"
                : `${SIGNALS.length} signal paths found`;
      caption(ctx, phase, s, t >= QUERY0 + 1.9 ? C.blue : C.ink2);
    },
  };
}

function drawSymbol(ctx: CanvasRenderingContext2D, sym: Sym, x: number, y: number, s: number, areaH: number) {
  ctx.strokeStyle = C.ink2;
  ctx.fillStyle = C.bg;
  ctx.lineWidth = 1.2 * s;
  if (sym.kind === "vessel") {
    const vw = 26 * s,
      vh = areaH * 0.62;
    ctx.beginPath();
    ctx.roundRect(x - vw / 2, y - vh / 2, vw, vh, vw / 2);
    ctx.fill();
    ctx.stroke();
    return;
  }
  if (sym.kind === "valve") {
    const r = 6.5 * s;
    ctx.beginPath();
    ctx.moveTo(x - r, y - r * 0.7);
    ctx.lineTo(x + r, y + r * 0.7);
    ctx.lineTo(x + r, y - r * 0.7);
    ctx.lineTo(x - r, y + r * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    return;
  }
  const r = 9 * s;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (sym.kind === "pump") {
    ctx.beginPath();
    ctx.moveTo(x - r * 0.45, y - r * 0.55);
    ctx.lineTo(x + r * 0.65, y);
    ctx.lineTo(x - r * 0.45, y + r * 0.55);
    ctx.closePath();
    ctx.stroke();
    return;
  }
  if (sym.id.startsWith("LIC")) {
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.stroke();
  }
  const [a, b] = sym.id.split("-");
  ctx.fillStyle = C.ink2;
  ctx.font = mono(5.6 * s, 500);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(a, x, y - 2.6 * s);
  ctx.fillText(b, x, y + 3.4 * s);
}

function bracket(ctx: CanvasRenderingContext2D, sym: Sym, x: number, y: number, s: number, a: number) {
  const half = (sym.kind === "vessel" ? 18 : 12) * s;
  const hy = sym.kind === "vessel" ? 30 * s : half;
  const L = 4 * s;
  ctx.strokeStyle = withAlpha(C.blue, a);
  ctx.lineWidth = 1.2 * s;
  for (const [sx, sy] of [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ]) {
    const cx = x + sx * half,
      cy = y + sy * hy;
    ctx.beginPath();
    ctx.moveTo(cx, cy - sy * L);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx - sx * L, cy);
    ctx.stroke();
  }
  ctx.font = mono(6.5 * s, 500);
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = withAlpha(C.blue, a);
  ctx.fillText(sym.id, x - half, y - hy - 2 * s);
}
