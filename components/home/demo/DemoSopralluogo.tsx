"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLingua } from "@/lib/i18n/client";
import type { Dizionario } from "@/lib/i18n/it";
import { fmt } from "@/lib/i18n/testo";
import { conti, euro, EVENTO_MESTIERE, numero, SCENARI, type Scenario } from "./scenari";

// La demo in cima alla home: il vocale si trascrive, le righe arrivano dal listino, una domanda
// su quello che manca, la voce da prezzare che prezza l'artigiano, l'IVA e l'accettazione.
// Tutto deriva da un solo numero, il tempo trascorso: pausa e «riduci movimento» lo fermano.
// Sul server (e senza JavaScript) si vede lo stato finale, completo.

const ALTRO = "altro";

type Tempi = ReturnType<typeof tempiDi>;

function tempiDi(s: Scenario) {
  const parole = s.vocale.split(" ").length;
  const parolaOgni = 68;
  const inizioParole = 450;
  const fineParole = inizioParole + parole * parolaOgni;
  const inizioRighe = fineParole + 450;
  const rigaOgni = 330;
  const domanda = inizioRighe + s.righe.length * rigaOgni + 250;
  const risposta = domanda + 1500;
  const prezzo = risposta + 900;
  const iva = prezzo + 1200;
  const invio = iva + 1300;
  const visto = invio + 900;
  const accettato = visto + 1000;
  const fine = accettato + 3800;
  return { parole, parolaOgni, inizioParole, fineParole, inizioRighe, rigaOgni, domanda, risposta, prezzo, iva, invio, visto, accettato, fine };
}

function riduciMovimento(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type IdScenario = keyof Dizionario["demo"]["vocali"];

export function DemoSopralluogo({ cta }: { cta: string }) {
  const { d: diz } = useLingua();
  const D = diz.demo;
  const [indice, setIndice] = useState(0);
  const [altro, setAltro] = useState(false);
  // Sul server lo stato finale: la demo completa, leggibile anche senza JavaScript.
  const [trascorso, setStatoTrascorso] = useState(Number.POSITIVE_INFINITY);
  const trascorsoRef = useRef(Number.POSITIVE_INFINITY);
  const setTrascorso = useCallback((n: number) => {
    trascorsoRef.current = n;
    setStatoTrascorso(n);
  }, []);
  const [inPausa, setInPausa] = useState(true);
  const [visibile, setVisibile] = useState(true);
  const sceltoDaTe = useRef(false);
  const radice = useRef<HTMLDivElement>(null);

  // Il racconto nella lingua della pagina; voci, prezzi e domanda restano quelli italiani del motore.
  const base = SCENARI[indice];
  const scenario: Scenario = { ...base, vocale: D.vocali[base.id as IdScenario] ?? base.vocale };
  const t = tempiDi(scenario);

  const scegli = useCallback((id: string, daTe: boolean) => {
    if (id === ALTRO) {
      setAltro(true);
      setInPausa(true);
      return;
    }
    const i = SCENARI.findIndex((s) => s.id === id);
    if (i < 0) return;
    sceltoDaTe.current = daTe || sceltoDaTe.current;
    setAltro(false);
    setIndice(i);
    if (riduciMovimento()) {
      setTrascorso(Number.POSITIVE_INFINITY);
      setInPausa(true);
    } else {
      setTrascorso(0);
      setInPausa(false);
    }
  }, [setTrascorso]);

  // All'avvio parte da sola, se il movimento è consentito, dopo un attimo.
  useEffect(() => {
    if (riduciMovimento()) return;
    const id = setTimeout(() => {
      setTrascorso(0);
      setInPausa(false);
    }, 350);
    return () => clearTimeout(id);
  }, [setTrascorso]);

  // Dalla sezione dei mestieri più in basso: «Guarda l'esempio» cambia mestiere qui.
  useEffect(() => {
    function suEvento(e: Event) {
      const id = (e as CustomEvent<string>).detail;
      scegli(id, true);
    }
    window.addEventListener(EVENTO_MESTIERE, suEvento);
    return () => window.removeEventListener(EVENTO_MESTIERE, suEvento);
  }, [scegli]);

  // Fuori dallo schermo o con la scheda nascosta si ferma.
  useEffect(() => {
    const el = radice.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([voce]) => setVisibile(voce.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    const suVisibilita = () => setVisibile(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", suVisibilita);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", suVisibilita);
    };
  }, []);

  const corre = !inPausa && visibile && !altro && Number.isFinite(trascorso);

  // Il giro: a fine giro stesso mestiere se l'hai scelto tu, altrimenti il prossimo.
  const fine = t.fine;
  useEffect(() => {
    if (!corre) return;
    let ultimo = performance.now();
    let id = 0;
    const passo = (ora: number) => {
      const dt = Math.min(ora - ultimo, 100);
      ultimo = ora;
      const e = trascorsoRef.current + dt;
      if (e >= fine) {
        setTrascorso(0);
        if (!sceltoDaTe.current) {
          setIndice((i) => (i + 1) % SCENARI.length);
          return;
        }
      } else setTrascorso(e);
      id = requestAnimationFrame(passo);
    };
    id = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(id);
  }, [corre, fine, indice, setTrascorso]);

  const finito = !Number.isFinite(trascorso) || trascorso >= t.accettato;

  return (
    <div ref={radice} id="esempio" className="flex min-w-0 flex-col gap-3 lg:gap-4">
      <div role="group" aria-label={D.gruppo} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {SCENARI.map((s, i) => {
          const attivo = !altro && i === indice;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={attivo}
              onClick={() => scegli(s.id, true)}
              className={`min-h-10 shrink-0 cursor-pointer rounded-full border-[1.5px] px-3 text-[14px] font-semibold transition-colors ${
                attivo ? "border-lime bg-lime text-inchiostro" : "border-scuro-linea bg-transparent text-fondo hover:border-lime"
              }`}
            >
              {D.mestieri[s.id as IdScenario] ?? s.mestiere}
            </button>
          );
        })}
        <button
          type="button"
          aria-pressed={altro}
          onClick={() => scegli(ALTRO, true)}
          className={`min-h-10 shrink-0 cursor-pointer rounded-full border-[1.5px] border-dashed px-3 text-[14px] font-semibold ${
            altro ? "border-lime bg-lime text-inchiostro" : "border-scuro-linea bg-transparent text-fondo hover:border-lime"
          }`}
        >
          {D.altroMestiere}
        </button>
      </div>

      <figure className="relative m-0 flex min-w-0 flex-col rounded-[26px] bg-ardesia-2 p-2.5 ring-1 ring-scuro-linea lg:rounded-[34px] lg:p-3.5">
        {altro ? <PannelloAltro cta={cta} D={D} /> : <Pannello s={scenario} t={t} e={trascorso} D={D} />}
        <figcaption className="flex min-h-11 items-center justify-between gap-3 px-2 pt-2 text-[12.5px] text-scuro-nota lg:text-[13px]">
          <span>{D.didascalia}</span>
          {!altro && (
            <button
              type="button"
              onClick={() => {
                if (finito && inPausa) {
                  setTrascorso(0);
                  setInPausa(false);
                } else setInPausa((p) => !p);
              }}
              className="flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-scuro-linea bg-transparent px-3 font-semibold text-fondo hover:border-lime"
            >
              {inPausa ? (finito ? D.riguarda : D.riprendi) : D.pausa}
            </button>
          )}
        </figcaption>
      </figure>
    </div>
  );
}

function Pannello({ s, t, e, D }: { s: Scenario; t: Tempi; e: number; D: Dizionario["demo"] }) {
  const parole = s.vocale.split(" ");
  const visteParole = e === Number.POSITIVE_INFINITY ? parole.length : Math.max(0, Math.floor((e - t.inizioParole) / t.parolaOgni));
  const scrive = visteParole > 0 && visteParole < parole.length;
  const avanzamento = Math.min(1, visteParole / parole.length);
  const righeViste = Math.max(0, Math.floor((e - t.inizioRighe) / t.rigaOgni) + 1);
  const conDomanda = e >= t.domanda;
  const risposto = e >= t.risposta;
  const prezzato = e >= t.prezzo;
  const conIva = e >= t.iva;
  const c = conti(s);
  const quota = conIva ? Math.min(1, (e - t.iva) / 700) : 0;
  const totaleMostrato = Math.round(c.totale * (1 - (1 - quota) ** 3));
  const stato = e >= t.accettato ? 3 : e >= t.visto ? 2 : e >= t.invio ? 1 : 0;

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-[18px] bg-chat text-inchiostro lg:rounded-[24px]">
      {/* Il vocale */}
      <div className="flex flex-col gap-2.5 border-b border-linea bg-superficie px-3.5 py-3 lg:px-5 lg:py-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] font-semibold text-testo-3 lg:text-sm">
            {D.mestieri[s.id as IdScenario] ?? s.mestiere} · {D.lavori[s.id as IdScenario] ?? s.lavoro} {D.sig} {s.cliente}
          </span>
          <span className="font-mono text-[12px] text-testo-3">{s.durata}</span>
        </div>
        <div className="flex items-center gap-2.5 self-start rounded-[14px_14px_4px_14px] bg-bolla-mia px-3 py-2">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="size-5 shrink-0">
            <circle cx="12" cy="12" r="11" fill="#1F2029" />
            {scrive ? <path d="M9 8h2v8H9zM13 8h2v8h-2z" fill="#fff" /> : <path d="M10 8 L16 12 L10 16 Z" fill="#fff" />}
          </svg>
          <Onda avanzamento={avanzamento} />
        </div>
        <p className="m-0 text-[13.5px] leading-[1.45] text-testo-2 lg:text-[14.5px]">
          {parole.map((p, i) => (
            <span key={i} className={i < visteParole ? "" : "opacity-0"}>
              {p}{" "}
            </span>
          ))}
        </p>
      </div>

      {/* La bozza */}
      <div className="flex flex-col gap-2 px-3.5 py-3 lg:px-5 lg:py-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[14px] font-bold lg:text-[15px]">{D.bozza}</span>
          <span className="font-mono text-[12px] text-testo-3">{fmt(D.voci, { n: s.righe.length })}</span>
        </div>
        <ul lang="it" dir="ltr" className="m-0 flex list-none flex-col gap-1 p-0">
          {s.righe.map((r, i) => {
            const vista = i < righeViste;
            const qta = r.quantita ?? (risposto ? s.domanda.quantita : null);
            const prezzo = r.prezzo ?? (prezzato ? s.prezzoTuo : null);
            const daPrezzare = r.prezzo === null && !prezzato;
            return (
              <li
                key={r.voce}
                className={`grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 rounded-[10px] px-2 py-1.5 font-mono text-[12px] transition-[opacity,transform,background-color] duration-300 lg:text-[13px] ${
                  vista ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                } ${daPrezzare ? "bg-ambra text-ambra-testo" : r.prezzo === null ? "bg-bolla-mia" : "bg-superficie"}`}
              >
                <span className="min-w-0">
                  <span className="font-sans text-[13px] font-semibold lg:text-[14px]">{r.voce}</span>
                  <span className="text-testo-3">
                    {" · "}
                    {qta === null ? (
                      <span className="rounded bg-cielo px-1 font-bold text-inchiostro">?</span>
                    ) : (
                      numero(qta)
                    )}{" "}
                    {r.unita}
                    {r.nota && <span> ({r.nota})</span>}
                  </span>
                </span>
                <span className="whitespace-nowrap text-right font-semibold">
                  {daPrezzare ? D.daPrezzare : qta === null || prezzo === null ? "?" : euro(Math.round(qta * prezzo))}
                </span>
                {r.prezzo === null && prezzato && (
                  <span className="col-span-2 text-[11.5px] text-lime-scuro">{D.prezzoTuo}</span>
                )}
              </li>
            );
          })}
        </ul>

        {/* La domanda su quello che manca: lo spazio è riservato, così la scheda non salta */}
        <div className={`flex flex-wrap items-center gap-2 rounded-[12px] border border-cielo-scuro/30 bg-superficie px-3 py-2 transition-opacity duration-300 ${conDomanda ? "opacity-100" : "opacity-0"}`}>
          <span className="text-[13px] font-semibold lg:text-[14px]">{s.domanda.testo}</span>
          <span className="flex gap-1.5">
            {s.domanda.scelte.map((sc, i) => (
              <span
                key={sc}
                className={`rounded-full border-[1.5px] px-2.5 py-0.5 font-mono text-[12px] font-semibold ${
                  risposto && i === s.domanda.risposta ? "border-inchiostro bg-lime" : "border-linea-2"
                }`}
              >
                {sc}
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* IVA, totale e accettazione */}
      <div className="flex flex-col gap-2.5 border-t border-dashed border-linea-2 bg-scontrino px-3.5 py-3 lg:px-5 lg:py-4">
        <div className={`flex items-baseline justify-between gap-3 transition-opacity duration-300 ${conIva ? "opacity-100" : "opacity-0"}`}>
          <span className="text-[12.5px] text-testo-2 lg:text-[13px]">
            {fmt(D.iva, { aliquota: s.iva.aliquota })}
          </span>
          <span className="whitespace-nowrap font-mono text-[17px] font-bold lg:text-[19px]">{euro(totaleMostrato)}</span>
        </div>
        <ol className="m-0 grid list-none grid-cols-3 gap-1.5 p-0 text-center text-[12px] font-semibold lg:text-[13px]">
          {D.stati.map((nome, i) => (
            <li
              key={nome}
              className={`rounded-full px-2 py-1.5 transition-colors duration-300 ${
                stato > i ? (i === 2 ? "bg-lime text-inchiostro" : "bg-ardesia text-fondo") : "bg-riga text-testo-3"
              }`}
            >
              {nome}
            </li>
          ))}
        </ol>
        <p className={`m-0 text-center text-[12px] text-testo-2 transition-opacity duration-300 lg:text-[12.5px] ${stato === 3 ? "opacity-100" : "opacity-0"}`}>
          {fmt(D.accettato, { cliente: s.cliente })}
        </p>
      </div>
    </div>
  );
}

function Onda({ avanzamento }: { avanzamento: number }) {
  const barre = [6, 12, 8, 16, 10, 4, 14, 9, 18, 7, 12, 5, 15, 9, 6, 13, 10, 16, 8, 11, 5, 14, 9, 7];
  const fino = Math.round(avanzamento * barre.length);
  return (
    <svg viewBox={`0 0 ${barre.length * 6} 20`} aria-hidden="true" focusable="false" className="h-5 w-[132px] lg:w-[150px]">
      {barre.map((h, i) => (
        <rect key={i} x={i * 6} y={(20 - h) / 2} width="3" height={h} rx="1.5" fill={i < fino ? "#1F2029" : "#8A8D9C"} />
      ))}
    </svg>
  );
}

function PannelloAltro({ cta, D }: { cta: string; D: Dizionario["demo"] }) {
  return (
    <div className="flex min-h-[420px] flex-col justify-center gap-4 rounded-[18px] bg-chat p-5 text-inchiostro lg:min-h-[520px] lg:rounded-[24px] lg:p-8">
      <p className="m-0 text-[26px] font-extrabold leading-[1.02] [font-stretch:75%] lg:text-[34px]">
        {D.altroTitolo}
      </p>
      <p className="m-0 text-[16px] leading-[1.55] text-testo-2 lg:text-[17px]">
        {D.altroTesto}
      </p>
      <a href={cta} className="bottone bottone-azione self-start py-3.5 text-[16px]">
        {D.altroCta}
      </a>
    </div>
  );
}
