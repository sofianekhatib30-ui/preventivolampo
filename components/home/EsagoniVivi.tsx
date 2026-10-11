"use client";

import { useEffect, useId, useRef } from "react";

// Fondo della hero: tessere esagonali scure in leggero rilievo, con le punte a destra e a sinistra come il marchio
// («anche gli esagoni delle hero devono essere posizionati cosi») (Sofiane, 11/10/2026: «e se usassimo questa con
// i nostri colori palette», «ovviamente sempre animata»), tessere che si sollevano con un'ombra sotto. I fili di
// luce che correvano lungo le fughe sono stati tolti il giorno stesso (Sofiane: «eliminiamo i fili di luce non mi
// piacciono distraggono troppo»), e la finestra d'esempio non galleggia più («questo non si deve muovere»).
// Stesso disegno e stessi tempi di griglia-luce.js su Smistatore Mail, Attestiamo e Agenzie e aziende. Il
// componente mette la classe "esagoni" sulla hero: il CSS nasconde allora matrice e griglia a quadratini, che
// restano come fondo senza JavaScript. Con «riduci movimento» le tessere sono ferme; fuori dallo schermo e con la
// scheda nascosta si ferma.
// Dall'11/10/2026 lo stesso fondo va anche nelle altre fasce scure del sito (Sofiane: «mettiamo questo effetto anche
// nelle zone bordeaux dove non ci sono effetti», «hai dimenticato questo e il footer»): numeri, demo, testata delle
// pagine, invito finale, scheda del programma pilota nei prezzi, piede. La sezione che
// lo ospita deve essere relative, isolate e overflow-hidden.

type Colore = readonly [number, number, number];
type Cella = { x: number; y: number; tono: number };

// Tessere: fuga quasi nera, espresso in leggero rilievo.
const FUGA = "#0E0408";
const TESSERA_A: Colore = [48, 20, 30];
const TESSERA_B: Colore = [31, 12, 19];
const R = 34; // raggio dell'esagono, dal centro al vertice
const FUGA_PX = 3; // metà della fuga fra due tessere
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
  const dall = mescola(TESSERA_A, [98, 40, 60], alza);
  const al = mescola(TESSERA_B, [62, 24, 38], alza);
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
  g.strokeStyle = `rgba(242,228,208,${(0.08 + 0.16 * alza).toFixed(3)})`;
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

// Lo stesso fondo fermo, disegnato dal server: si vede da subito, prima che la pagina si attivi, e senza
// JavaScript. Prima al suo posto c'erano la matrice e la griglia a quadratini, e per un attimo all'apertura si
// vedeva il fondo vecchio (Sofiane, 11/10/2026: «quando entro in preventivi mi mostra prima la vecchia versione per
// un secondo»). Tessere col tono medio (quello vero varia tessera per tessera) e lo stesso velo della tela.
const ALT = Math.sqrt(3) * R;
const r = R - FUGA_PX;
const punti = (cx: number, cy: number, q: number) =>
  [0, 1, 2, 3, 4, 5].map((k) => `${(cx + q * Math.cos((Math.PI / 3) * k)).toFixed(2)},${(cy + q * Math.sin((Math.PI / 3) * k)).toFixed(2)}`).join(" ");
const meta = (cx: number, cy: number, q: number, su: boolean) => {
  const s = su ? -1 : 1;
  const h = 0.866 * q;
  return `${(cx - q).toFixed(2)},${cy.toFixed(2)} ${(cx - q / 2).toFixed(2)},${(cy + s * h).toFixed(2)} ${(cx + q / 2).toFixed(2)},${(cy + s * h).toFixed(2)} ${(cx + q).toFixed(2)},${cy.toFixed(2)}`;
};
const CENTRI: readonly (readonly [number, number])[] = [[0, 0], [3 * R, 0], [0, ALT], [3 * R, ALT], [1.5 * R, ALT / 2]];

function FondoFermo({ principale }: { principale: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const tono = 0.89; // 1 - tono medio delle tessere (0,11)
  const c = (k: Colore) => `rgb(${Math.round(k[0] * tono)},${Math.round(k[1] * tono)},${Math.round(k[2] * tono)})`;
  return (
    <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute inset-0 -z-[6] size-full">
      <defs>
        <linearGradient id={`t${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c(TESSERA_A)} />
          <stop offset="1" stopColor={c(TESSERA_B)} />
        </linearGradient>
        <pattern id={`p${id}`} width={3 * R} height={ALT} patternUnits="userSpaceOnUse">
          <rect width={3 * R} height={ALT} fill={FUGA} />
          {CENTRI.map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <polygon points={punti(x, y, r)} fill={`url(#t${id})`} />
              <polyline points={meta(x, y, r - 0.5, true)} fill="none" stroke="rgba(242,228,208,.08)" />
              <polyline points={meta(x, y, r - 0.5, false)} fill="none" stroke="rgba(0,0,0,.42)" />
            </g>
          ))}
        </pattern>
        <linearGradient id={`v${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgb(14,4,8)" stopOpacity=".66" />
          <stop offset=".42" stopColor="rgb(14,4,8)" stopOpacity=".56" />
          <stop offset=".6" stopColor="rgb(14,4,8)" stopOpacity=".16" />
          <stop offset="1" stopColor="rgb(14,4,8)" stopOpacity=".12" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#p${id})`} />
      {principale ? (
        <>
          <rect width="100%" height="100%" fill="rgba(14,4,8,.5)" className="min-[1020px]:hidden" />
          <rect width="100%" height="100%" fill={`url(#v${id})`} className="hidden min-[1020px]:block" />
        </>
      ) : (
        <rect width="100%" height="100%" fill="rgba(14,4,8,.5)" />
      )}
    </svg>
  );
}

export function EsagoniVivi({ principale = false }: { principale?: boolean }) {
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
    let sollevate: { c: Cella; da: number }[] = [];
    let ultimaSollevata = 0;
    let giro = 0;
    let visibile = true;
    let ultimo = 0;

    // Velo sopra le tessere, per leggere bene i testi (Sofiane, 11/10: «ci vuole un filtro o simili per rendere
    // ben leggibili i testi»). Nella hero su schermi larghi è più scuro a sinistra, dove sta il testo, e quasi
    // trasparente dietro la finestra d'esempio; altrove è uniforme.
    const velo = () => {
      if (principale && W >= 1020) {
        const g = ctx.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, "rgba(14,4,8,.66)");
        g.addColorStop(0.42, "rgba(14,4,8,.56)");
        g.addColorStop(0.6, "rgba(14,4,8,.16)");
        g.addColorStop(1, "rgba(14,4,8,.12)");
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = "rgba(14,4,8,.5)";
      }
      ctx.fillRect(0, 0, W, H);
    };
    const sfondo = () => {
      if (!fondo) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(fondo, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const disegna = (ora: number) => {
      sfondo();
      // tessere sollevate: tante, sempre in movimento (Sofiane, 11/10: «fai muovere di piu gli esagoni e piu esagoni
      // cosi è animata davvero»). Ognuna sale di qualche pixel, cresce un poco con un'ombra sotto e torna giù; una
      // nuova parte ogni 150 ms, fino a una ogni 50.000 px² di fascia.
      const massimo = Math.max(8, Math.round((W * H) / 50000));
      if (ora - ultimaSollevata > 150 && sollevate.length < massimo && celle.length) {
        const scelta = celle[(Math.random() * celle.length) | 0];
        if (!sollevate.some((s) => s.c === scelta)) {
          sollevate.push({ c: scelta, da: ora });
          ultimaSollevata = ora;
        }
      }
      sollevate = sollevate.filter((s) => {
        const p = (ora - s.da) / 2600;
        if (p >= 1) return false;
        const e = 0.5 - 0.5 * Math.cos(p * 2 * Math.PI);
        ctx.save();
        ctx.shadowColor = `rgba(0,0,0,${(0.7 * e).toFixed(3)})`;
        ctx.shadowBlur = 20 * e;
        ctx.shadowOffsetY = 9 * e;
        disegnaTessera(ctx, s.c.x, s.c.y - 7 * e, (R - FUGA_PX) * (1 + 0.05 * e), s.c.tono, e);
        ctx.restore();
        return true;
      });
      velo();
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
      sollevate = [];
      tela.dataset.pronta = "";
      if (riduci) {
        sfondo();
        velo();
      } else disegna(performance.now());
    };

    const quadro = (ora: number) => {
      giro = requestAnimationFrame(quadro);
      if (ora - ultimo < 33) return; // circa 30 immagini al secondo, come la home
      ultimo = ora;
      disegna(ora);
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
  }, [principale]);

  // La tela compare piano sopra il fondo fermo, così il passaggio dal tono medio a quello di ogni tessera non scatta.
  return (
    <>
      <FondoFermo principale={principale} />
      <canvas
        ref={rif}
        aria-hidden="true"
        className="griglia-luce pointer-events-none absolute inset-0 -z-[5] size-full opacity-0 transition-opacity duration-700 data-[pronta]:opacity-100 motion-reduce:transition-none"
      />
    </>
  );
}
