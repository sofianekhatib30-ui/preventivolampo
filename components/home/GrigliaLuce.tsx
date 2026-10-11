"use client";

import { useEffect, useRef } from "react";
import { QUADRI } from "./Matrice";

// I quadratini della griglia della hero si accendono al passaggio del mouse e si spengono piano, ciascuno
// con il suo colore: oro o vino dove la matrice ha un quadratino pieno, sabbia sulla griglia vuota.
// Stesso disegno e stessi tempi di griglia-luce.js su Smistatore Mail e Attestiamo e di sito.js su
// Agenzie e aziende (Sofiane, 11/10/2026: «magari aggiungi anche effetti di illuminazione al passaggio
// del mause sui quadratini»). La griglia di sfondo (utility griglia-kds) è da 30 px e parte dall'angolo
// in alto a destra, quindi le colonne si contano da destra. Solo con un mouse vero e senza «riduci
// movimento»; la tela non riceve clic e sta fra il fondale e il contenuto.
const P = 30;

// Colore di riempimento e di bordo per tipo di quadratino (Sofiane, 11/10: «potrebbe essere più leggera e
// del colore del quadratino in cui si passa»).
const COLORI = {
  v: ["rgba(143,41,72,.34)", "rgba(196,84,118,.55)"],
  o: ["rgba(198,161,91,.18)", "rgba(217,185,122,.5)"],
  g: ["rgba(242,228,208,.05)", "rgba(242,228,208,.3)"],
} as const;

// I quadratini pieni della matrice come «colonna da destra,riga» (la matrice è larga 1440 e sta a destra).
const PIENI = new Map<string, "v" | "o">(
  QUADRI.filter(([x]) => x <= 1440 - 26).map(([x, y, s]) => [`${Math.floor((1440 - x) / P)},${Math.floor(y / P)}`, s ? "v" : "o"]),
);

export function GrigliaLuce() {
  const rif = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const tela = rif.current;
    const hero = tela?.parentElement;
    if (!tela || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ctx = tela.getContext("2d");
    if (!ctx) return;

    const celle = new Map<string, number>();
    // Sotto i 701 px la matrice non c'è: resta solo la griglia.
    const conMatrice = window.matchMedia("(min-width: 701px)");
    let W = 0;
    let H = 0;
    let giro = 0;
    let prima: [number, number] | null = null;

    const misura = () => {
      const r = hero.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      tela.width = Math.round(W * dpr);
      tela.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const accendi = (x: number, y: number, forza: number) => {
      if (x < 0 || y < 0 || x > W || y > H) return;
      const k = `${Math.floor((W - x) / P)},${Math.floor(y / P)}`;
      celle.set(k, Math.max(celle.get(k) ?? 0, forza));
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
    const disegna = () => {
      ctx.clearRect(0, 0, W, H);
      celle.forEach((v, k) => {
        const [c, r] = k.split(",").map(Number);
        const x = W - P * (c + 1) + 4;
        const y = r * P + 4;
        const [riempi, bordo] = COLORI[(conMatrice.matches && PIENI.get(k)) || "g"];
        ctx.globalAlpha = v;
        curva(x + 0.5, y + 0.5, 21, 21, 4);
        ctx.fillStyle = riempi;
        ctx.fill();
        ctx.strokeStyle = bordo;
        ctx.lineWidth = 1;
        ctx.stroke();
        const n = v - 0.025;
        if (n <= 0) celle.delete(k);
        else celle.set(k, n);
      });
      ctx.globalAlpha = 1;
      giro = celle.size ? requestAnimationFrame(disegna) : 0;
    };
    const suMuovi = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // Anche i quadratini fra un movimento e l'altro: una passata veloce lascia una scia continua.
      if (prima) {
        const dx = x - prima[0];
        const dy = y - prima[1];
        const passi = Math.min(30, Math.ceil(Math.hypot(dx, dy) / 12));
        for (let i = 1; i < passi; i++) accendi(prima[0] + (dx * i) / passi, prima[1] + (dy * i) / passi, 0.75);
      }
      accendi(x, y, 1);
      for (const [ox, oy] of [[P, 0], [-P, 0], [0, P], [0, -P]]) accendi(x + ox, y + oy, 0.3);
      prima = [x, y];
      if (!giro) giro = requestAnimationFrame(disegna);
    };
    const suEsci = () => {
      prima = null;
    };

    hero.addEventListener("pointermove", suMuovi);
    hero.addEventListener("pointerleave", suEsci);
    const ro = new ResizeObserver(misura);
    ro.observe(hero);
    misura();
    return () => {
      hero.removeEventListener("pointermove", suMuovi);
      hero.removeEventListener("pointerleave", suEsci);
      ro.disconnect();
      if (giro) cancelAnimationFrame(giro);
    };
  }, []);

  return <canvas ref={rif} aria-hidden="true" className="griglia-luce pointer-events-none absolute inset-0 -z-[5] size-full" />;
}
