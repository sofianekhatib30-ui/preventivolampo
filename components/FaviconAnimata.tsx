"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { MARCHIO } from "@/lib/brand/marchio";

// Favicon animata: il fulmine si traccia nella scheda all'apertura e quando torni sulla scheda.
// I browser non animano da soli una favicon SVG (Chrome mostra il primo fotogramma), quindi
// disegno i fotogrammi su un canvas e li passo al <link rel="icon">. Poi resta l'icona ferma.
const FOTOGRAMMI = 18;
const PASSO_MS = 45;

function disegna(ctx: CanvasRenderingContext2D, t: number, lunghezza: number) {
  const { foglio, orecchia, fulmine, colori } = MARCHIO;
  const s = ctx.canvas.width / 40;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(s, 0, 0, s, 0, 0);
  ctx.fillStyle = colori.foglio;
  ctx.fill(new Path2D(foglio));

  // Orecchia: scatta nell'ultimo terzo
  const o = Math.min(1, Math.max(0, (t - 0.6) / 0.4));
  if (o > 0) {
    ctx.save();
    ctx.translate(40, 0);
    ctx.scale(o, o);
    ctx.translate(-40, 0);
    ctx.fillStyle = colori.orecchia;
    ctx.fill(new Path2D(orecchia));
    ctx.restore();
  }

  // Fulmine: prima il tratto, poi il riempimento con un lampo di luce
  const p = new Path2D(fulmine);
  const tratto = Math.min(1, t / 0.5);
  ctx.strokeStyle = colori.fulmine;
  ctx.lineWidth = 1.6;
  ctx.lineJoin = "round";
  ctx.setLineDash([lunghezza * tratto, lunghezza]);
  ctx.stroke(p);
  ctx.setLineDash([]);
  const r = Math.min(1, Math.max(0, (t - 0.45) / 0.25));
  if (r > 0) {
    ctx.globalAlpha = r;
    ctx.fillStyle = t < 0.8 ? "#E4FF8A" : colori.fulmine;
    ctx.fill(p);
    ctx.globalAlpha = 1;
  }
}

// Nell'area di Preventivi la scheda mostra il marchio di K Digital Solution, come gli altri strumenti.
const ICONA_KDS =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2A1018"/><g transform="translate(10 10) scale(0.44)"><rect x="14" y="10" width="15" height="80" rx="1.5" fill="#F2E4D0"/><path d="M82 10 L42 50 L82 90" fill="none" stroke="#C6A15B" stroke-width="15" stroke-miterlimit="8"/></g></svg>',
  );
const eArea = (p: string | null) => p === "/area" || Boolean(p?.startsWith("/area/"));

export function FaviconAnimata() {
  const pathname = usePathname();
  const area = eArea(pathname);
  useEffect(() => {
    if (!area) return;
    const link = document.querySelector<HTMLLinkElement>('link[rel~="icon"][type="image/svg+xml"]') ?? document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!link) return;
    const originale = { href: link.href, type: link.type };
    link.type = "image/svg+xml";
    link.href = ICONA_KDS;
    return () => {
      link.href = originale.href;
      link.type = originale.type;
    };
  }, [area]);
  useEffect(() => {
    if (area) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const link =
      document.querySelector<HTMLLinkElement>('link[rel~="icon"][type="image/svg+xml"]') ??
      document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!link) return;
    const originale = link.href;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const misura = document.createElementNS("http://www.w3.org/2000/svg", "path");
    misura.setAttribute("d", MARCHIO.fulmine);
    const lunghezza = misura.getTotalLength?.() || 70;

    let timer: number | undefined;
    function gioca() {
      window.clearInterval(timer);
      let f = 0;
      timer = window.setInterval(() => {
        disegna(ctx!, f / (FOTOGRAMMI - 1), lunghezza);
        link!.href = canvas.toDataURL("image/png");
        if (++f >= FOTOGRAMMI) {
          window.clearInterval(timer);
          link!.href = originale;
        }
      }, PASSO_MS);
    }
    const alRitorno = () => {
      if (document.visibilityState === "visible") gioca();
    };
    gioca();
    document.addEventListener("visibilitychange", alRitorno);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", alRitorno);
      link.href = originale;
    };
  }, [area]);
  return null;
}
