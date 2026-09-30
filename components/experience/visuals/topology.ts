import { C, caption, dot, easeOut, mono, mulberry32, ring, span, withAlpha, type Visual } from "./kit";

/**
 * Incident replay: a layered broadband topology (ordered with a barycenter sweep),
 * a device fails, alarms flood downstream, the trace walks back up to the root cause.
 */
type Node = { layer: number; parent: number; extra: number; x: number; y: number; children: number[]; depth: number };

const LAYERS = [
  { n: 1, label: "ISP" },
  { n: 2, label: "BNG" },
  { n: 3, label: "Core" },
  { n: 5, label: "Branch" },
  { n: 7, label: "Floor" },
  { n: 11, label: "Users" },
];
const CYCLE = 8.5;

export function createTopology(): Visual {
  const rnd = mulberry32(7);
  const nodes: Node[] = [];
  const byLayer: number[][] = [];
  LAYERS.forEach((L, li) => {
    byLayer[li] = [];
    for (let k = 0; k < L.n; k++) {
      const prev = byLayer[li - 1];
      const parent = prev ? prev[Math.floor(rnd() * prev.length)] : -1;
      const extra = prev && prev.length > 1 && rnd() < 0.3 ? prev[Math.floor(rnd() * prev.length)] : -1;
      nodes.push({ layer: li, parent, extra: extra === parent ? -1 : extra, x: 0, y: 0, children: [], depth: 0 });
      byLayer[li].push(nodes.length - 1);
    }
  });
  // Every upper node should feed at least one child, so the tree reads as a network.
  byLayer.forEach((ids, li) => {
    const next = byLayer[li + 1];
    if (!next) return;
    ids.forEach((id, k) => {
      if (!next.some((c) => nodes[c].parent === id)) nodes[next[k % next.length]].parent = id;
    });
  });
  nodes.forEach((n, i) => n.parent >= 0 && nodes[n.parent].children.push(i));

  // Barycenter ordering: sort each layer by the mean slot of its parents.
  const slot = new Map<number, number>();
  byLayer.forEach((ids, li) => {
    if (li > 0) {
      ids.sort((a, b) => {
        const m = (n: Node) => (n.extra >= 0 ? (slot.get(n.parent)! + slot.get(n.extra)!) / 2 : slot.get(n.parent)!);
        return m(nodes[a]) - m(nodes[b]);
      });
    }
    ids.forEach((id, k) => slot.set(id, (k + 0.5) / ids.length));
  });

  const candidates = [...byLayer[2], ...byLayer[3]];

  function layout(w: number, h: number, s: number) {
    const left = 62 * s,
      right = w - 20 * s,
      top = h * 0.2,
      bottom = h * 0.9;
    byLayer.forEach((ids, li) => {
      const y = top + ((bottom - top) * li) / (LAYERS.length - 1);
      ids.forEach((id) => {
        nodes[id].x = left + (right - left) * slot.get(id)!;
        nodes[id].y = y;
      });
    });
  }

  function subtree(root: number) {
    const out: number[] = [];
    const walk = (id: number, d: number) => {
      nodes[id].depth = d;
      out.push(id);
      nodes[id].children.forEach((c) => walk(c, d + 1));
    };
    walk(root, 0);
    return out;
  }

  return {
    still: 6.2,
    draw(ctx, time, w, h) {
      const s = Math.max(0.7, Math.min(w / 440, 1.6));
      layout(w, h, s);
      const cycle = Math.floor(time / CYCLE);
      const t = time % CYCLE;
      const root = candidates[(cycle * 5 + 3) % candidates.length];
      const affected = subtree(root);
      const maxD = Math.max(...affected.map((i) => nodes[i].depth));
      const alarmAt = (d: number) => 1.1 + d * 0.32;
      const traceStart = alarmAt(maxD) + 0.5;
      const traceAt = (d: number) => traceStart + (maxD - d) * 0.28;
      const found = traceStart + maxD * 0.28 + 0.2;
      const fade = 1 - span(t, CYCLE - 1, CYCLE - 0.2);
      const conf = (0.88 + ((cycle * 37) % 10) / 100).toFixed(2);
      const inAffected = new Set(affected);

      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);

      // layer labels
      ctx.font = mono(8 * s);
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      byLayer.forEach((ids, li) => {
        ctx.fillStyle = C.ink3;
        ctx.fillText(LAYERS[li].label.toUpperCase(), 14 * s, nodes[ids[0]].y);
      });

      // edges
      nodes.forEach((n, i) => {
        if (n.parent < 0) return;
        const p = nodes[n.parent];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = C.line;
        ctx.lineWidth = 1;
        ctx.stroke();
        if (n.extra >= 0) {
          const e = nodes[n.extra];
          ctx.setLineDash([2 * s, 3 * s]);
          ctx.beginPath();
          ctx.moveTo(e.x, e.y);
          ctx.lineTo(n.x, n.y);
          ctx.strokeStyle = "rgba(255,255,255,.07)";
          ctx.stroke();
          ctx.setLineDash([]);
        }
        // traffic packets flowing downstream
        const f = (time * 0.45 + i * 0.137) % 1;
        const broken = inAffected.has(i) && nodes[i].depth >= 1 && t > alarmAt(0) && fade > 0.5;
        if (!broken) dot(ctx, p.x + (n.x - p.x) * f, p.y + (n.y - p.y) * f, 1.2 * s, "rgba(127,179,255,.55)");

        // upstream trace, drawn child → parent
        if (inAffected.has(i) && nodes[i].depth >= 1) {
          const d = nodes[i].depth;
          const k = easeOut(span(t, traceAt(d), traceAt(d) + 0.3)) * fade;
          if (k > 0) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n.x + (p.x - n.x) * k, n.y + (p.y - n.y) * k);
            ctx.strokeStyle = withAlpha(C.warm, 0.85 * fade);
            ctx.lineWidth = 1.6 * s;
            ctx.stroke();
            ctx.lineWidth = 1;
          }
        }
      });

      // nodes
      nodes.forEach((n, i) => {
        const r = (n.layer < 2 ? 3.6 : n.layer < 4 ? 3 : 2.3) * s;
        let color = n.layer === LAYERS.length - 1 ? C.ink3 : C.ink2;
        if (inAffected.has(i) && n.depth >= 1) {
          const a = span(t, alarmAt(n.depth), alarmAt(n.depth) + 0.12) * fade;
          if (a > 0) {
            color = withAlpha(C.red, 0.35 + 0.65 * a);
            const rp = span(t, alarmAt(n.depth), alarmAt(n.depth) + 0.9);
            if (rp > 0 && rp < 1) ring(ctx, n.x, n.y, r + rp * 14 * s, withAlpha(C.red, (1 - rp) * 0.7));
          }
        }
        dot(ctx, n.x, n.y, r, color);
      });

      // root cause callout
      const rc = nodes[root];
      const k = easeOut(span(t, found, found + 0.5)) * fade;
      if (k > 0) {
        const pulse = (Math.sin(time * 5) + 1) / 2;
        ring(ctx, rc.x, rc.y, 7 * s + pulse * 2 * s, withAlpha(C.warm, k), 1.4 * s);
        dot(ctx, rc.x, rc.y, 3.4 * s, withAlpha(C.warm, k));
        const label = `ROOT CAUSE  ·  conf ${conf}`;
        ctx.font = mono(8.5 * s, 500);
        const tw = ctx.measureText(label).width + 14 * s;
        let bx = rc.x + 12 * s;
        if (bx + tw > w - 8 * s) bx = rc.x - 12 * s - tw;
        const by = rc.y - 22 * s;
        ctx.globalAlpha = k;
        ctx.fillStyle = "rgba(20,20,22,.92)";
        ctx.strokeStyle = withAlpha(C.warm, 0.6);
        ctx.beginPath();
        ctx.roundRect(bx, by, tw, 16 * s, 8 * s);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = C.warm;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(label, bx + 7 * s, by + 8 * s);
        ctx.globalAlpha = 1;
      }

      const alarms = affected.filter((i) => nodes[i].depth >= 1 && t > alarmAt(nodes[i].depth)).length;
      const phase =
        fade < 1
          ? "Incident closed"
          : t < alarmAt(0)
            ? "Monitoring · all links healthy"
            : t < traceStart
              ? `Alarm flood · ${alarms} events`
              : t < found
                ? "Tracing upstream · weighted Dijkstra"
                : "Root cause isolated";
      caption(ctx, phase, s, t >= alarmAt(0) && t < traceStart && fade === 1 ? C.red : t >= found && fade === 1 ? C.warm : C.ink2);
    },
  };
}
