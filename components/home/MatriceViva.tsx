"use client";

import { useEffect, useRef } from "react";
import { QUADRI } from "./Matrice";

// Matrice viva della hero: ogni tanto un quadratino pieno della matrice si solleva appena (sale di tre
// pixel, cresce un poco, ombra morbida sotto) e si illumina leggermente del suo colore, oro o vino, poi
// torna giù. Pochi alla volta, senza mouse (Sofiane, 11/10/2026: «muovere i quadratini come se si
// sollevassero e si illuminano del loro colore in maniera leggera e annulliamo il passaggio del mause»).
// Stessi tempi e colori di griglia-luce.js su Smistatore Mail, Attestiamo e Agenzie e aziende. Sotto i
// 701 px la matrice non c'è, e nemmeno l'animazione; ferma con «riduci movimento», fuori dallo schermo e
// con la scheda nascosta. La tela sta fra il fondale e il contenuto.

type Tinta = { f: readonly [number, number, number, number, number]; b: readonly [number, number, number, number, number] };
// Riempimento e bordo: [r, g, b, opacità a riposo (quella della matrice), quanto sale al culmine].
const TINTE: Record<"o" | "v", Tinta> = {
  o: { f: [198, 161, 91, 0.16, 0.24], b: [226, 196, 138, 0, 0.5] },
  v: { f: [143, 41, 72, 0.38, 0.24], b: [201, 92, 126, 0, 0.5] },
};
const DURATA = 2800;
const OGNI = 560;
const INSIEME = 6;

// I quadratini pieni interi della matrice, come colonna da destra e riga della griglia da 30 px.
const PIENI = QUADRI.filter(([x, y]) => x <= 1414 && y <= 874).map(([x, y, s]) => ({
  c: (1440 - 26 - x) / 30,
  r: (y - 4) / 30,
  t: (s ? "v" : "o") as "o" | "v",
}));

const rgba = (c: readonly number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;

export function MatriceViva() {
  const rif = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const tela = rif.current;
    const hero = tela?.parentElement;
    if (!tela || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = tela.getContext("2d");
    if (!ctx) return;

    const conMatrice = window.matchMedia("(min-width: 701px)");
    const quadri = PIENI.map((q) => ({ ...q, da: -1 }));
    let attivi: typeof quadri = [];
    let W = 0;
    let H = 0;
    let giro = 0;
    let ultimo = 0;
    let visibile = true;

    const misura = () => {
      const r = hero.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      tela.width = Math.round(W * dpr);
      tela.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const curva = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };
    const nuovo = (ora: number) => {
      const liberi = quadri.filter((q) => q.da < 0 && W - 30 * (q.c + 1) >= 0 && q.r * 30 + 26 <= H);
      if (!liberi.length) return;
      const q = liberi[Math.floor(Math.random() * liberi.length)];
      q.da = ora;
      attivi.push(q);
    };
    const disegna = (ora: number) => {
      ctx.clearRect(0, 0, W, H);
      if (attivi.length < INSIEME && ora - ultimo > OGNI) {
        nuovo(ora);
        ultimo = ora;
      }
      attivi = attivi.filter((q) => {
        const t = (ora - q.da) / DURATA;
        if (t >= 1) {
          q.da = -1;
          return false;
        }
        const e = 0.5 - 0.5 * Math.cos(t * 2 * Math.PI); // sale e scende, morbido ai due capi
        const lato = 22 * (1 + 0.09 * e);
        const x = W - 30 * (q.c + 1) + 15 - lato / 2;
        const y = q.r * 30 + 15 - lato / 2 - 3 * e;
        const tinta = TINTE[q.t];
        ctx.save();
        ctx.shadowColor = `rgba(12,3,6,${(0.45 * e).toFixed(3)})`;
        ctx.shadowBlur = 8 * e;
        ctx.shadowOffsetY = 3 * e;
        curva(x, y, lato, lato, 4);
        ctx.fillStyle = rgba(tinta.f, tinta.f[3] + tinta.f[4] * e);
        ctx.fill();
        ctx.restore();
        curva(x + 0.5, y + 0.5, lato - 1, lato - 1, 4);
        ctx.strokeStyle = rgba(tinta.b, tinta.b[4] * e);
        ctx.lineWidth = 1;
        ctx.stroke();
        return true;
      });
      giro = requestAnimationFrame(disegna);
    };
    const aggiorna = () => {
      const deve = visibile && !document.hidden && conMatrice.matches;
      if (deve && !giro) {
        ultimo = 0;
        giro = requestAnimationFrame(disegna);
      }
      if (!deve && giro) {
        cancelAnimationFrame(giro);
        giro = 0;
        ctx.clearRect(0, 0, W, H);
        attivi.forEach((q) => {
          q.da = -1;
        });
        attivi = [];
      }
    };

    const io = new IntersectionObserver(([v]) => {
      visibile = v.isIntersecting;
      aggiorna();
    });
    io.observe(hero);
    const ro = new ResizeObserver(misura);
    ro.observe(hero);
    document.addEventListener("visibilitychange", aggiorna);
    conMatrice.addEventListener("change", aggiorna);
    misura();
    aggiorna();
    return () => {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", aggiorna);
      conMatrice.removeEventListener("change", aggiorna);
      if (giro) cancelAnimationFrame(giro);
    };
  }, []);

  return <canvas ref={rif} aria-hidden="true" className="griglia-luce pointer-events-none absolute inset-0 -z-[5] size-full" />;
}
