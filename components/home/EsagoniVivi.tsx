"use client";

import { useEffect, useRef } from "react";

// Fondo a esagoni della hero (Sofiane, 11/10/2026: «e se usassimo questa con i nostri colori palette», su
// un'immagine di esagoni scuri in rilievo con i bordi che si accendono; «ovviamente sempre animata»).
// Tessere esagonali scure in leggero rilievo, tre luci della palette (oro, bordeaux, sabbia) che girano piano
// e accendono i bordi delle tessere vicine, e ogni tanto una tessera che si solleva appena. Vicino al testo
// le luci si abbassano. Stesso disegno e stessi tempi di griglia-luce.js su Smistatore Mail, Attestiamo e
// Agenzie e aziende. Il componente mette la classe "esagoni" sulla hero: il CSS nasconde allora matrice e
// griglia a quadratini, che restano come fondo senza JavaScript. Con «riduci movimento» il disegno è fermo;
// fuori dallo schermo e con la scheda nascosta si ferma.

type Colore = readonly [number, number, number];
type Luce = { c: Colore; raggio: number; forza: number; px: number; py: number; ax: number; ay: number; vx: number; vy: number; f: number };

const FUGA = "#0E0408";
const TESSERA_A: Colore = [48, 20, 30];
const TESSERA_B: Colore = [31, 12, 19];
// Posizione media (px, py, in frazioni della hero), ampiezza e velocità del giro: le luci passano dove la hero
// si vede (fascia alta, margine destro, fascia bassa), non solo dietro la finestra d'esempio.
const LUCI: readonly Luce[] = [
  { c: [217, 185, 122], raggio: 320, forza: 0.95, px: 0.84, py: 0.24, ax: 0.12, ay: 0.2, vx: 0.031, vy: 0.023, f: 0 },
  { c: [196, 58, 100], raggio: 340, forza: 1, px: 0.56, py: 0.96, ax: 0.34, ay: 0.05, vx: 0.019, vy: 0.031, f: 2.1 },
  { c: [242, 228, 208], raggio: 240, forza: 0.5, px: 0.52, py: 0.1, ax: 0.3, ay: 0.06, vx: 0.024, vy: 0.017, f: 4.2 },
];
const R = 34; // raggio dell'esagono, dal centro al vertice
const FUGA_PX = 3; // metà della fuga fra due tessere

type Cella = { x: number; y: number; tono: number };

function esagono(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  g.beginPath();
  for (let k = 0; k < 6; k++) {
    const a = (Math.PI / 180) * (60 * k - 90);
    const px = x + r * Math.cos(a);
    const py = y + r * Math.sin(a);
    if (k) g.lineTo(px, py);
    else g.moveTo(px, py);
  }
  g.closePath();
}
const mescola = (a: Colore, b: Colore, t: number): Colore => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rgb = (c: Colore, al: number) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${al.toFixed(3)})`;
const NERO: Colore = [0, 0, 0];

function disegnaTessera(g: CanvasRenderingContext2D, x: number, y: number, r: number, tono: number, alza: number) {
  const dall = mescola(TESSERA_A, [70, 32, 44], alza);
  const al = mescola(TESSERA_B, [44, 18, 28], alza);
  const gr = g.createLinearGradient(x, y - r, x, y + r);
  gr.addColorStop(0, rgb(mescola(dall, NERO, tono), 1));
  gr.addColorStop(1, rgb(mescola(al, NERO, tono), 1));
  esagono(g, x, y, r);
  g.fillStyle = gr;
  g.fill();
  // smusso: luce sul bordo alto, ombra su quello basso
  g.save();
  esagono(g, x, y, r);
  g.clip();
  g.lineWidth = 2;
  g.strokeStyle = `rgba(242,228,208,${(0.08 + 0.06 * alza).toFixed(3)})`;
  g.beginPath();
  g.moveTo(x - r * 0.866, y - r * 0.5);
  g.lineTo(x, y - r);
  g.lineTo(x + r * 0.866, y - r * 0.5);
  g.stroke();
  g.strokeStyle = "rgba(0,0,0,.42)";
  g.beginPath();
  g.moveTo(x - r * 0.866, y + r * 0.5);
  g.lineTo(x, y + r);
  g.lineTo(x + r * 0.866, y + r * 0.5);
  g.stroke();
  g.restore();
}

export function EsagoniVivi() {
  const rif = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const tela = rif.current;
    const hero = tela?.parentElement;
    if (!tela || !hero) return;
    const ctx = tela.getContext("2d");
    if (!ctx) return;
    const riduci = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    hero.classList.add("esagoni");

    let W = 0;
    let H = 0;
    let dpr = 1;
    let celle: Cella[] = [];
    let fondo: HTMLCanvasElement | null = null;
    let giro = 0;
    let visibile = true;
    let ultimoQuadro = 0;
    let sollevate: { c: Cella; da: number }[] = [];
    let ultimaSollevata = 0;
    const inizio = performance.now();

    // Vicino al testo (la colonna di sinistra su schermi larghi) le luci si abbassano.
    const vicinoAlTesto = (x: number) => {
      if (W < 1020) return 0.55;
      const t = Math.min(1, Math.max(0, (x - W * 0.34) / (W * 0.24)));
      return 0.32 + 0.68 * t * t * (3 - 2 * t);
    };

    const disegna = (ora: number) => {
      if (!fondo) return;
      const t = riduci ? 9 : (ora - inizio) / 1000;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(fondo, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // tessere sollevate: salgono di qualche pixel con un'ombra sotto e poi tornano giù
      if (!riduci && ora - ultimaSollevata > 900 && sollevate.length < 4 && celle.length) {
        const c = celle[Math.floor(Math.random() * celle.length)];
        if (c.x > W * 0.45 || W < 1020) {
          sollevate.push({ c, da: ora });
          ultimaSollevata = ora;
        }
      }
      sollevate = sollevate.filter((s) => {
        const p = (ora - s.da) / 3600;
        if (p >= 1) return false;
        const e = 0.5 - 0.5 * Math.cos(p * 2 * Math.PI);
        ctx.save();
        ctx.shadowColor = `rgba(0,0,0,${(0.55 * e).toFixed(3)})`;
        ctx.shadowBlur = 14 * e;
        ctx.shadowOffsetY = 5 * e;
        disegnaTessera(ctx, s.c.x, s.c.y - 3 * e, R - FUGA_PX, s.c.tono, e);
        ctx.restore();
        return true;
      });

      // luci: ogni luce accende i bordi delle tessere vicine, con un alone largo e un filo netto
      ctx.globalCompositeOperation = "lighter";
      for (const l of LUCI) {
        const lx = W * (l.px + l.ax * Math.sin(t * l.vx * 2 * Math.PI + l.f));
        const ly = H * (l.py + l.ay * Math.sin(t * l.vy * 2 * Math.PI + l.f * 1.7));
        const respiro = 0.85 + 0.15 * Math.sin(t * 0.35 + l.f);
        const rag = l.raggio * (W < 700 ? 0.7 : 1);
        for (const c of celle) {
          const dx = c.x - lx;
          const dy = c.y - ly;
          if (Math.abs(dx) > rag || Math.abs(dy) > rag) continue;
          const d = Math.sqrt(dx * dx + dy * dy) / rag;
          if (d >= 1) continue;
          const a = (1 - d) * (1 - d) * l.forza * respiro * vicinoAlTesto(c.x);
          esagono(ctx, c.x, c.y, R - FUGA_PX + 0.5);
          ctx.fillStyle = rgb(l.c, a * 0.07);
          ctx.fill();
          ctx.lineWidth = 5;
          ctx.strokeStyle = rgb(l.c, a * 0.16);
          ctx.stroke();
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = rgb(l.c, a * 0.85);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const misura = () => {
      const r = hero.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      tela.width = Math.round(W * dpr);
      tela.height = Math.round(H * dpr);
      const larg = Math.sqrt(3) * R;
      const alt = 1.5 * R;
      celle = [];
      for (let j = -1; j * alt < H + R; j++) {
        for (let i = -1; i * larg < W + larg; i++) {
          // tono fisso per tessera, ricavato dalla posizione: lo stesso a ogni ridisegno
          const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
          celle.push({ x: i * larg + (j % 2 ? larg / 2 : 0), y: j * alt, tono: (s - Math.floor(s)) * 0.22 });
        }
      }
      fondo = document.createElement("canvas");
      fondo.width = tela.width;
      fondo.height = tela.height;
      const g = fondo.getContext("2d");
      if (!g) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = FUGA;
      g.fillRect(0, 0, W, H);
      for (const c of celle) disegnaTessera(g, c.x, c.y, R - FUGA_PX, c.tono, 0);
      disegna(performance.now());
    };

    const quadro = (ora: number) => {
      giro = requestAnimationFrame(quadro);
      if (ora - ultimoQuadro < 33) return; // circa 30 immagini al secondo bastano
      ultimoQuadro = ora;
      disegna(ora);
    };
    const aggiorna = () => {
      if (riduci) return;
      const deve = visibile && !document.hidden;
      if (deve && !giro) giro = requestAnimationFrame(quadro);
      if (!deve && giro) {
        cancelAnimationFrame(giro);
        giro = 0;
      }
    };

    const io = new IntersectionObserver(([v]) => {
      visibile = v.isIntersecting;
      aggiorna();
    });
    io.observe(hero);
    let attesa: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(attesa);
      attesa = setTimeout(misura, 120);
    });
    ro.observe(hero);
    document.addEventListener("visibilitychange", aggiorna);
    misura();
    aggiorna();
    return () => {
      io.disconnect();
      ro.disconnect();
      clearTimeout(attesa);
      document.removeEventListener("visibilitychange", aggiorna);
      if (giro) cancelAnimationFrame(giro);
      hero.classList.remove("esagoni");
    };
  }, []);

  return <canvas ref={rif} aria-hidden="true" className="griglia-luce pointer-events-none absolute inset-0 -z-[5] size-full" />;
}
