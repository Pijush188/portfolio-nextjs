import { C, caption, easeOut, mono, sans, span, withAlpha, type Visual } from "./kit";

/**
 * Two chat sessions on one project. Session A asks a follow-up that gets rewritten
 * with history; both sessions take checkpoints; resetting B leaves A untouched.
 */
type Msg =
  | { who: "user"; at: number; text: string }
  | { who: "chip"; at: number; text: string }
  | { who: "ai"; at: number; lines: string[] };

const MSGS: Msg[] = [
  { who: "user", at: 0.3, text: "Which tables reference CUSTOMER?" },
  { who: "ai", at: 1.5, lines: ["**3 tables** reference CUSTOMER", "• ORDERS.customer_id", "• INVOICE.customer_id", "• TICKET.owner_id"] },
  { who: "user", at: 3.6, text: "what about their foreign keys?" },
  { who: "chip", at: 4.2, text: "↺ rewritten: foreign keys of ORDERS, INVOICE, TICKET" },
  { who: "ai", at: 5.2, lines: ["**ORDERS** → CUSTOMER, PRODUCT", "**INVOICE** → ORDERS", "**TICKET** → CUSTOMER"] },
];
const PILLS_A = [2.4, 6.1];
const PILLS_B = [2.9, 6.7, 7.3];
const RESET = 8.1,
  CYCLE = 12.5;

export function createChat(): Visual {
  return {
    still: 10,
    draw(ctx, time, w, h) {
      const s = Math.max(0.7, Math.min(w / 440, 1.6));
      const t = time % CYCLE;
      const fade = 1 - span(t, CYCLE - 0.7, CYCLE - 0.1);
      const top = 32 * s,
        pad = 12 * s,
        chatW = w * 0.6,
        fs = 9 * s,
        lh = 13 * s;

      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = fade;

      // ---- chat column (session A)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, top - 6 * s, chatW, h - top + 6 * s);
      ctx.clip();
      const maxW = chatW - pad * 2 - 30 * s;
      type Laid = { m: Msg; k: number; lines: string[]; hgt: number };
      const laid: Laid[] = [];
      for (const m of MSGS) {
        const k = easeOut(span(t, m.at, m.at + 0.35));
        if (k <= 0) continue;
        ctx.font = m.who === "chip" ? mono(7 * s) : sans(fs, 500);
        const lines = m.who === "ai" ? m.lines : wrap(ctx, m.text, maxW);
        const hgt = m.who === "chip" ? 12 * s : lines.length * lh + 12 * s;
        laid.push({ m, k, lines, hgt });
      }
      const total = laid.reduce((a, l) => a + (l.hgt + 7 * s) * l.k, 0);
      let y = top - Math.max(0, total - (h - top - 26 * s));

      for (const { m, k, lines, hgt } of laid) {
        ctx.globalAlpha = k * fade;
        const dy = (1 - k) * 8 * s;
        if (m.who === "user") {
          ctx.font = sans(fs, 500);
          const bw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 18 * s;
          const bx = chatW - pad - bw;
          ctx.fillStyle = "rgba(255,255,255,.1)";
          ctx.beginPath();
          ctx.roundRect(bx, y + dy, bw, hgt, 9 * s);
          ctx.fill();
          ctx.fillStyle = C.ink;
          ctx.textBaseline = "top";
          ctx.textAlign = "left";
          lines.forEach((l, i) => ctx.fillText(l, bx + 9 * s, y + dy + 6 * s + i * lh + 1 * s));
        } else if (m.who === "chip") {
          ctx.font = mono(7 * s);
          ctx.fillStyle = C.warm;
          ctx.textAlign = "right";
          ctx.textBaseline = "top";
          ctx.fillText(m.text, chatW - pad, y + dy);
        } else {
          const shown = Math.ceil(span(t, m.at, m.at + 0.9) * lines.length);
          let bw = 0;
          lines.forEach((l) => {
            ctx.font = sans(fs, 500);
            bw = Math.max(bw, ctx.measureText(l.replace(/\*\*/g, "")).width);
          });
          bw += 18 * s;
          ctx.strokeStyle = C.line;
          ctx.beginPath();
          ctx.roundRect(pad, y + dy, bw, hgt, 9 * s);
          ctx.stroke();
          lines.slice(0, shown).forEach((l, i) => drawRich(ctx, l, pad + 9 * s, y + dy + 7 * s + i * lh, fs));
        }
        y += (hgt + 7 * s) * k;
      }
      // typing indicator before each answer
      for (const m of MSGS) {
        if (m.who !== "ai" || t < m.at - 0.55 || t >= m.at) continue;
        ctx.globalAlpha = fade;
        for (let i = 0; i < 3; i++) {
          const b = (Math.sin(time * 9 - i * 0.9) + 1) / 2;
          ctx.fillStyle = withAlpha(C.ink2, 0.3 + 0.6 * b);
          ctx.beginPath();
          ctx.arc(pad + 8 * s + i * 7 * s, y + 6 * s, 2 * s, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // ---- sessions panel
      ctx.globalAlpha = fade;
      const px = chatW + 8 * s,
        pw = w - px - pad,
        gap = 8 * s,
        ch = (h - top - pad - gap) / 2;
      ctx.fillStyle = C.line;
      ctx.fillRect(chatW, top - 6 * s, 1, h - top);
      const resetFlash = span(t, RESET, RESET + 0.25) * (1 - span(t, RESET + 0.6, RESET + 0.9));
      const cleared = easeOut(span(t, RESET + 0.4, RESET + 0.8));
      const okA = easeOut(span(t, RESET + 1, RESET + 1.3));
      card(ctx, px, top, pw, ch, s, "Session A", "this chat", PILLS_A, t, 0, true);
      if (okA > 0) {
        ctx.globalAlpha = okA * fade;
        ctx.font = mono(7 * s, 500);
        ctx.fillStyle = C.green;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText("✓ untouched", px + 9 * s, top + ch - 7 * s);
        ctx.globalAlpha = fade;
      }
      const by = top + ch + gap;
      card(ctx, px, by, pw, ch, s, "Session B", "other window", PILLS_B, t, cleared, false);
      if (t > RESET - 0.4) {
        ctx.font = mono(7 * s, 500);
        const label = cleared > 0.5 ? "clean slate" : "reset session";
        ctx.globalAlpha = fade;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = cleared > 0.5 ? C.ink3 : withAlpha(C.red, 0.6 + 0.4 * resetFlash);
        ctx.fillText(label, px + 9 * s, by + ch - 7 * s);
      }
      ctx.globalAlpha = 1;

      const phase =
        t < 4.2
          ? "Session A · schema Q&A"
          : t < RESET
            ? "Follow-up rewritten with history"
            : t < RESET + 1
              ? "Resetting session B"
              : "Checkpoints isolated per session";
      caption(ctx, phase, s, t >= RESET + 1 && fade === 1 ? C.green : C.ink2);
    },
  };
}

function card(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  s: number,
  title: string,
  sub: string,
  pills: number[],
  t: number,
  cleared: number,
  mine: boolean,
) {
  const a = ctx.globalAlpha;
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8 * s);
  ctx.stroke();
  if (mine) {
    ctx.fillStyle = C.warm;
    ctx.fillRect(x, y + 8 * s, 2 * s, 12 * s);
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = mono(7.5 * s, 500);
  ctx.fillStyle = C.ink;
  ctx.fillText(title.toUpperCase(), x + 9 * s, y + 8 * s);
  ctx.font = mono(6.5 * s);
  ctx.fillStyle = C.ink3;
  ctx.fillText(sub, x + 9 * s, y + 19 * s);

  const pw = 27 * s,
    ph = 12 * s,
    py = y + 33 * s;
  pills.forEach((at, i) => {
    const k = easeOut(span(t, at, at + 0.3));
    if (k <= 0) return;
    const px = x + 9 * s + i * (pw + 4 * s);
    if (px + pw > x + w - 4 * s) return;
    ctx.globalAlpha = a * k * (1 - cleared);
    ctx.fillStyle = "rgba(255,180,92,.12)";
    ctx.strokeStyle = withAlpha(C.warm, 0.5);
    ctx.beginPath();
    ctx.roundRect(px, py + (1 - k) * 5 * s - cleared * 6 * s, pw, ph, 6 * s);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = C.warm;
    ctx.font = mono(6.2 * s, 500);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`v00${i + 1}`, px + pw / 2, py + ph / 2 + (1 - k) * 5 * s - cleared * 6 * s);
  });
  ctx.globalAlpha = a;
}

/** Render a line with **bold** spans. */
function drawRich(ctx: CanvasRenderingContext2D, line: string, x: number, y: number, fs: number) {
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  line.split(/(\*\*[^*]+\*\*)/).forEach((part) => {
    if (!part) return;
    const bold = part.startsWith("**");
    const txt = bold ? part.slice(2, -2) : part;
    ctx.font = sans(fs, bold ? 700 : 500);
    ctx.fillStyle = bold ? C.ink : C.ink2;
    ctx.fillText(txt, x, y);
    x += ctx.measureText(txt).width;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const out: string[] = [];
  let cur = "";
  for (const word of text.split(" ")) {
    const next = cur ? cur + " " + word : word;
    if (ctx.measureText(next).width > maxW && cur) {
      out.push(cur);
      cur = word;
    } else cur = next;
  }
  if (cur) out.push(cur);
  return out;
}
