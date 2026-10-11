"use client";

import { useEffect, useRef } from "react";

// Fondo della hero: tessere esagonali scure in leggero rilievo, con le punte a destra e a sinistra come il marchio
// («anche gli esagoni delle hero devono essere posizionati cosi») (Sofiane, 11/10/2026: «e se usassimo questa con
// i nostri colori palette», «ovviamente sempre animata»), tessere che ogni tanto si sollevano con un'ombra
// sotto, e i fili di luce della home di kdigitalsolution.it che corrono lungo le fughe lasciando una scia che
// si spegne («utilizziamo invece dell effetto luminoso degli stumenti lo stesso effetto della home dove passano
// i fili di luce in mezzo mantenendo l effetto degli esagoni che si muovono»). La finestra d'esempio galleggia.
// Stesso disegno e stessi tempi di griglia-luce.js su Smistatore Mail, Attestiamo e Agenzie e aziende. Il
// componente mette la classe "esagoni" sulla hero: il CSS nasconde allora matrice e griglia a quadratini, che
// restano come fondo senza JavaScript. Con «riduci movimento» il disegno è fermo (tessere e qualche filo
// acceso); fuori dallo schermo e con la scheda nascosta si ferma.

type Colore = readonly [number, number, number];
type Cella = { x: number; y: number; tono: number };
type Lato = { a: string; b: string; ax: number; ay: number; bx: number; by: number };
type Corridore = { lato: number; verso: 1 | -1; t: number };

// Tessere: fuga quasi nera, espresso in leggero rilievo.
const FUGA = "#0E0408";
const TESSERA_A: Colore = [48, 20, 30];
const TESSERA_B: Colore = [31, 12, 19];
const R = 34; // raggio dell'esagono, dal centro al vertice
const FUGA_PX = 3; // metà della fuga fra due tessere
// Fili di luce: colori, passo, scia e spegnimento della home (COLORI.scura, PASSO, SCIA, SPEGNI). L'intensità è
// più alta (0.7 contro 0.27): sopra le tessere in rilievo, con quella della home i fili quasi non si vedevano.
const CALDO = "242,228,208";
const ALONE = "198,161,91";
const FORZA = 0.7;
const PASSO = 0.3;
const SCIA = 18;
const SPEGNI = 2.1;
const NERO: Colore = [0, 0, 0];

function esagono(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  g.beginPath();
  for (let k = 0; k < 6; k++) {
    const a = (Math.PI / 180) * (60 * k);
    const px = x + r * Math.cos(a);
    const py = y + r * Math.sin(a);
    if (k) g.lineTo(px, py);
    else g.moveTo(px, py);
  }
  g.closePath();
}
const mescola = (a: Colore, b: Colore, t: number): Colore => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rgb = (c: Colore, al: number) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${al.toFixed(3)})`;

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
  g.moveTo(x - r, y);
  g.lineTo(x - r * 0.5, y - r * 0.866);
  g.lineTo(x + r * 0.5, y - r * 0.866);
  g.lineTo(x + r, y);
  g.stroke();
  g.strokeStyle = "rgba(0,0,0,.42)";
  g.beginPath();
  g.moveTo(x - r, y);
  g.lineTo(x - r * 0.5, y + r * 0.866);
  g.lineTo(x + r * 0.5, y + r * 0.866);
  g.lineTo(x + r, y);
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
    let vert: Record<string, number[]> = {};
    let lati: Lato[] = [];
    let dentroLati: number[] = [];
    let fondo: HTMLCanvasElement | null = null;
    let corridori: Corridore[] = [];
    let scia: { lato: number; eta: number }[] = [];
    let sollevate: { c: Cella; da: number }[] = [];
    let ultimaSollevata = 0;
    let giro = 0;
    let visibile = true;
    let ultimo = 0;

    // La maglia dei fili: i lati degli esagoni a raggio pieno, cioè le linee al centro delle fughe.
    const chiave = (x: number, y: number) => `${Math.round(x)},${Math.round(y)}`;
    const costruisciMaglia = () => {
      vert = {};
      lati = [];
      dentroLati = [];
      const visti = new Set<string>();
      for (const c of celle) {
        const p: [number, number][] = [];
        for (let k = 0; k < 6; k++) {
          const a = (Math.PI / 180) * (60 * k);
          p.push([c.x + R * Math.cos(a), c.y + R * Math.sin(a)]);
        }
        for (let e = 0; e < 6; e++) {
          const A = p[e];
          const B = p[(e + 1) % 6];
          const ka = chiave(A[0], A[1]);
          const kb = chiave(B[0], B[1]);
          const id = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
          if (visti.has(id)) continue;
          visti.add(id);
          const idx = lati.length;
          lati.push({ a: ka, b: kb, ax: A[0], ay: A[1], bx: B[0], by: B[1] });
          (vert[ka] ??= []).push(idx);
          (vert[kb] ??= []).push(idx);
          const mx = (A[0] + B[0]) / 2;
          const my = (A[1] + B[1]) / 2;
          if (mx > 0 && mx < W && my > 0 && my < H) dentroLati.push(idx);
        }
      }
    };
    const nuovoCorridore = (): Corridore | null =>
      dentroLati.length ? { lato: dentroLati[(Math.random() * dentroLati.length) | 0], verso: Math.random() < 0.5 ? 1 : -1, t: 0 } : null;
    const fuori = (i: number) => {
      const L = lati[i];
      const m = 90;
      const mx = (L.ax + L.bx) / 2;
      const my = (L.ay + L.by) / 2;
      return mx < -m || mx > W + m || my < -m || my > H + m;
    };
    const avanti = (c: Corridore) => {
      const L = lati[c.lato];
      const kArrivo = c.verso === 1 ? L.b : L.a;
      const scelte = (vert[kArrivo] ?? []).filter((i) => i !== c.lato);
      const riparti = () => {
        const n = nuovoCorridore();
        if (n) Object.assign(c, n);
      };
      if (!scelte.length) return riparti();
      const nuovo = scelte[(Math.random() * scelte.length) | 0];
      if (fuori(nuovo)) return riparti();
      c.lato = nuovo;
      c.verso = lati[nuovo].a === kArrivo ? 1 : -1;
      c.t = 0;
    };
    const linea = (L: Lato, da: number, a: number, alpha: number, spesso: boolean) => {
      const x1 = L.ax + (L.bx - L.ax) * da;
      const y1 = L.ay + (L.by - L.ay) * da;
      const x2 = L.ax + (L.bx - L.ax) * a;
      const y2 = L.ay + (L.by - L.ay) * a;
      const al = alpha * FORZA;
      ctx.save();
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.shadowColor = `rgba(${ALONE},${al.toFixed(3)})`;
      ctx.shadowBlur = spesso ? 12 : 9;
      ctx.strokeStyle = `rgba(${ALONE},${(al * 0.3).toFixed(3)})`;
      ctx.lineWidth = spesso ? 3.6 : 3;
      ctx.stroke();
      ctx.shadowBlur = 7;
      ctx.shadowColor = `rgba(${CALDO},${(al * 0.7).toFixed(3)})`;
      ctx.strokeStyle = `rgba(${CALDO},${al.toFixed(3)})`;
      ctx.lineWidth = spesso ? 2.3 : 1.8;
      ctx.stroke();
      ctx.restore();
    };
    const testa = (x: number, y: number) => {
      ctx.save();
      ctx.shadowColor = `rgba(${CALDO},${FORZA})`;
      ctx.shadowBlur = 16;
      ctx.fillStyle = `rgba(${CALDO},${FORZA})`;
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    const sfondo = () => {
      if (!fondo) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(fondo, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const disegna = (dt: number, ora: number) => {
      sfondo();
      // tessere sollevate: salgono di qualche pixel con un'ombra sotto e poi tornano giù
      if (ora - ultimaSollevata > 420 && sollevate.length < 7 && celle.length) {
        sollevate.push({ c: celle[(Math.random() * celle.length) | 0], da: ora });
        ultimaSollevata = ora;
      }
      sollevate = sollevate.filter((s) => {
        const p = (ora - s.da) / 3000;
        if (p >= 1) return false;
        const e = 0.5 - 0.5 * Math.cos(p * 2 * Math.PI);
        ctx.save();
        ctx.shadowColor = `rgba(0,0,0,${(0.6 * e).toFixed(3)})`;
        ctx.shadowBlur = 16 * e;
        ctx.shadowOffsetY = 6 * e;
        disegnaTessera(ctx, s.c.x, s.c.y - 4 * e, R - FUGA_PX, s.c.tono, e);
        ctx.restore();
        return true;
      });
      // fili di luce: la scia si spegne, la testa corre lungo le fughe
      for (let s = scia.length - 1; s >= 0; s--) {
        scia[s].eta += dt;
        if (scia[s].eta > SPEGNI) scia.splice(s, 1);
      }
      for (const v of scia) {
        const a = 1 - v.eta / SPEGNI;
        linea(lati[v.lato], 0, 1, a * a * 0.85, false);
      }
      for (const c of corridori) {
        c.t += dt / PASSO;
        while (c.t >= 1) {
          scia.unshift({ lato: c.lato, eta: 0 });
          if (scia.length > SCIA * corridori.length) scia.pop();
          avanti(c);
          c.t = Math.max(0, c.t - 1);
        }
        const L = lati[c.lato];
        const da = c.verso === 1 ? 0 : 1;
        const fino = c.verso === 1 ? c.t : 1 - c.t;
        linea(L, Math.min(da, fino), Math.max(da, fino), 1, true);
        testa(L.ax + (L.bx - L.ax) * fino, L.ay + (L.by - L.ay) * fino);
      }
    };
    // Con «riduci movimento»: tessere ferme e un tratto di filo acceso per corridore, come la home.
    const fermo = () => {
      sfondo();
      for (const c of corridori) {
        for (let i = 0; i < 7; i++) {
          linea(lati[c.lato], 0, 1, 0.75 - i * 0.09, i === 0);
          avanti(c);
        }
      }
    };

    const misura = () => {
      const r = hero.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      tela.width = Math.round(W * dpr);
      tela.height = Math.round(H * dpr);
      // esagoni con le punte a destra e a sinistra, come il marchio: colonne ogni 1,5 raggi, una sì e una no
      // scese di mezza altezza
      const passoX = 1.5 * R;
      const alt = Math.sqrt(3) * R;
      celle = [];
      for (let i = -1; i * passoX < W + R; i++) {
        for (let j = -1; j * alt < H + alt; j++) {
          // tono fisso per tessera, ricavato dalla posizione: lo stesso a ogni ridisegno
          const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
          celle.push({ x: i * passoX, y: j * alt + (Math.abs(i % 2) ? alt / 2 : 0), tono: (s - Math.floor(s)) * 0.22 });
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
      costruisciMaglia();
      corridori = [];
      scia = [];
      sollevate = [];
      const quanti = Math.max(3, Math.min(14, Math.round((W * H) / 115000)));
      for (let k = 0; k < quanti; k++) {
        const c = nuovoCorridore();
        if (c) {
          c.t = Math.random();
          corridori.push(c);
        }
      }
      if (riduci) fermo();
      else disegna(0, performance.now());
    };

    const quadro = (ora: number) => {
      giro = requestAnimationFrame(quadro);
      if (ora - ultimo < 33) return; // circa 30 immagini al secondo, come la home
      const dt = Math.min((ora - ultimo) / 1000, 0.1);
      ultimo = ora;
      disegna(dt, ora);
    };
    const aggiorna = () => {
      if (riduci) return;
      const deve = visibile && !document.hidden;
      if (deve && !giro) {
        ultimo = performance.now();
        giro = requestAnimationFrame(quadro);
      }
      if (!deve && giro) {
        cancelAnimationFrame(giro);
        giro = 0;
      }
    };

    // La finestra d'esempio galleggia piano: sale di qualche pixel e torna giù (composite "add": si somma
    // alle trasformazioni che ha già).
    const finestra = hero.querySelector<HTMLElement>("#esempio");
    let galleggio: Animation | undefined;
    if (finestra && !riduci && typeof finestra.animate === "function") {
      try {
        galleggio = finestra.animate(
          [{ transform: "translateY(0px)" }, { transform: "translateY(-9px)" }, { transform: "translateY(0px)" }],
          { duration: 6400, iterations: Infinity, easing: "ease-in-out", composite: "add" },
        );
      } catch {
        /* senza Web Animations la finestra resta ferma */
      }
    }

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
      galleggio?.cancel();
      hero.classList.remove("esagoni");
    };
  }, []);

  return <canvas ref={rif} aria-hidden="true" className="griglia-luce pointer-events-none absolute inset-0 -z-[5] size-full" />;
}
