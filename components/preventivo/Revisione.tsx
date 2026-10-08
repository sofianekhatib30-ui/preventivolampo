"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { conti, importoRiga, imponibileParziale, mancanze, regimeDi, type Mancanza } from "@/lib/preventivi/calcolo";
import { LINGUE, linguaDi, mancanzaTraduzione, NOME_LINGUA, traduzioneAllineata, type Lingua } from "@/lib/preventivi/lingua";
import type { Preventivo, RigaPreventivo } from "@/lib/preventivi/modello";
import { centesimi, euro, numero, REGIME, UNITA } from "./formato";

type Voce = { code: string; name: string; unit: string; priceCents: number; significantGood: boolean };

const campo = "mt-1 block min-h-12 w-full rounded-campo border border-linea-2 bg-superficie px-3 text-[17px] font-normal";
const etichetta = "block text-[15px] font-semibold text-testo-2";

// Lo stato di una riga, in parole: è quello che l'artigiano deve sapere a colpo d'occhio.
type StatoRiga = { tipo: "pronta" } | { tipo: "manca"; motivi: string[] };

function statoRiga(m: Mancanza[], i: number): StatoRiga {
  const mie = m.filter((x) => x.riga === i).map((x) => x.testo);
  if (!mie.length) return { tipo: "pronta" };
  const motivi: string[] = [];
  if (mie.includes("manca il prezzo")) motivi.push("Da prezzare");
  if (mie.includes("manca la quantità") || mie.includes("manca l'unità di misura")) motivi.push("Manca la misura");
  if (mie.some((t) => t.includes("valore del bene"))) motivi.push("Manca il valore del bene");
  return { tipo: "manca", motivi };
}

function vaiA(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const fermo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: fermo ? "auto" : "smooth", block: "center" });
  const primo =
    el.querySelector<HTMLElement>("[data-manca] input, [data-manca] select, [data-manca] button") ?? el.querySelector<HTMLElement>("input, select");
  primo?.focus({ preventScroll: true });
}

function Icona({ tipo }: { tipo: "ok" | "euro" | "metro" | "avviso" }) {
  const d = {
    ok: "M4 10.5l3.5 3.5L16 5.5",
    euro: "M14 5.5a5 5 0 1 0 0 9M4 8.5h7M4 11.5h7",
    metro: "M3 13.5 13.5 3l3.5 3.5L6.5 17ZM7 9.5l1.5 1.5M9.5 7l1.5 1.5M12 4.5 13.5 6",
    avviso: "M10 3 18 17H2ZM10 8v4M10 14.5v.5",
  }[tipo];
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="size-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Scelta<T extends string>({
  nome,
  valore,
  opzioni,
  onScegli,
}: {
  nome: string;
  valore: T | null;
  opzioni: { v: T; testo: string }[];
  onScegli: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={nome} className="mt-2 flex flex-wrap gap-2">
      {opzioni.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={valore === o.v}
          onClick={() => onScegli(o.v)}
          className={`min-h-12 rounded-full border-2 px-4 text-[16px] font-bold ${
            valore === o.v ? "border-ardesia bg-ardesia text-fondo" : "border-linea-2 bg-superficie text-inchiostro"
          }`}
        >
          {o.testo}
        </button>
      ))}
    </div>
  );
}

// api: dove salvare (la demo usa /api/preventivi, l'area dell'impresa /api/area/preventivi).
export default function Revisione({
  iniziale,
  voci,
  api = "/api/preventivi",
  traduzioni = false,
}: {
  iniziale: Preventivo;
  voci: Voce[];
  api?: string;
  // Lingua del cliente e traduzione: solo nell'area delle imprese.
  traduzioni?: boolean;
}) {
  const router = useRouter();
  const [p, setP] = useState<Preventivo>(iniziale);
  const [testiPrezzo, setTestiPrezzo] = useState<string[]>(iniziale.righe.map((r) => (r.unitPriceCents === null ? "" : (r.unitPriceCents / 100).toFixed(2).replace(".", ","))));
  const [stato, setStato] = useState<"pronto" | "invio">("pronto");
  const [messaggio, setMessaggio] = useState("");
  const [soloDaSistemare, setSoloDaSistemare] = useState(false);
  const [conferma, setConferma] = useState(false);
  const [controllato, setControllato] = useState(false);
  const [traduco, setTraduco] = useState(false);
  const spunta = useRef<HTMLInputElement>(null);
  const byCode = useMemo(() => new Map(voci.map((v) => [v.code, v])), [voci]);

  const mDati = mancanze(p);
  const mTrad = traduzioni ? mancanzaTraduzione(p) : null;
  // Le mancanze dei dati, più la traduzione da fare quando il cliente è straniero.
  const m: Mancanza[] = mTrad ? [...mDati, { riga: null, testo: mTrad }] : mDati;
  const lingua = linguaDi(p);
  const allineata = traduzioneAllineata(p);
  const sezioneDi = (x: Mancanza) => (x.riga !== null ? `riga-${x.riga}` : x.testo === mTrad ? "sezione-lingua" : "sezione-iva");
  const c = conti(p);
  const regime = regimeDi(p);
  const stati = p.righe.map((_, i) => statoRiga(m, i));
  const pronte = stati.filter((s) => s.tipo === "pronta").length;
  const daPrezzare = stati.filter((s) => s.tipo === "manca" && s.motivi.includes("Da prezzare")).length;
  const senzaMisura = stati.filter((s) => s.tipo === "manca" && s.motivi.includes("Manca la misura")).length;
  const domandeIva = mDati.filter((x) => x.riga === null).length;
  const senzaValore = stati.filter((s) => s.tipo === "manca" && s.motivi.includes("Manca il valore del bene")).length;

  useEffect(() => {
    if (!conferma) return;
    spunta.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setConferma(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [conferma]);

  const setRiga = (i: number, patch: Partial<RigaPreventivo>) =>
    setP((prev) => ({ ...prev, righe: prev.righe.map((r, j) => (j === i ? { ...r, ...patch } : r)) }));

  function scegliVoce(i: number, code: string) {
    const v = byCode.get(code);
    if (!v) {
      setRiga(i, { code: null, significantGood: false, goodsValueCents: null });
      return;
    }
    setRiga(i, { code, work: v.name, unit: v.unit as RigaPreventivo["unit"], unitPriceCents: v.priceCents, priceSource: "listino", significantGood: v.significantGood, flag: null });
    setTestiPrezzo((t) => t.map((x, j) => (j === i ? (v.priceCents / 100).toFixed(2).replace(".", ",") : x)));
  }

  function aggiungiRiga() {
    setP((prev) => ({
      ...prev,
      righe: [...prev.righe, { work: "Nuova lavorazione", spoken: "", quantity: null, unit: null, unitPriceCents: null, code: null, priceSource: null, flag: null, significantGood: false, goodsValueCents: null, addToPriceList: false }],
    }));
    setTestiPrezzo((t) => [...t, ""]);
    setSoloDaSistemare(false);
  }

  function togliRiga(i: number) {
    setP((prev) => ({ ...prev, righe: prev.righe.filter((_, j) => j !== i) }));
    setTestiPrezzo((t) => t.filter((_, j) => j !== i));
  }

  function primoDaSistemare() {
    const prima = m[0];
    if (!prima) return;
    setSoloDaSistemare(false);
    window.setTimeout(() => vaiA(sezioneDi(prima)), 0);
  }

  async function salva(): Promise<boolean> {
    const res = await fetch(`${api}/${p.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        cliente: p.cliente,
        iva: p.iva,
        righe: p.righe,
        esclusioni: p.esclusioni,
        ...(traduzioni ? { lingua: p.lingua ?? "it", traduzione: p.traduzione ?? null } : {}),
      }),
    });
    if (!res.ok) {
      setMessaggio((await res.json()).errore ?? "Non sono riuscito a salvare. Riprova.");
      return false;
    }
    return true;
  }

  async function approva() {
    setStato("invio");
    setMessaggio("");
    if (await salva()) {
      const res = await fetch(`${api}/${p.id}/approva`, { method: "POST" });
      if (res.ok) {
        router.refresh();
        return;
      }
      setMessaggio((await res.json()).errore ?? "Non sono riuscito ad approvare. Riprova.");
    }
    setConferma(false);
    setStato("pronto");
  }

  async function traduci() {
    setTraduco(true);
    setMessaggio("");
    if (await salva()) {
      const res = await fetch(`${api}/${p.id}/traduci`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lingua }),
      });
      const b = await res.json().catch(() => ({}));
      if (res.ok) setP((prev) => ({ ...prev, lingua: b.lingua, traduzione: b.traduzione }));
      else setMessaggio(b.errore ?? "Non sono riuscito a tradurre. Riprova.");
    }
    setTraduco(false);
  }

  const setTradotta = (campo: "righe" | "esclusioni", i: number, testo: string) =>
    setP((prev) =>
      prev.traduzione ? { ...prev, traduzione: { ...prev.traduzione, [campo]: prev.traduzione[campo].map((x, j) => (j === i ? testo : x)) } } : prev,
    );

  async function soloSalva() {
    setStato("invio");
    setMessaggio((await salva()) ? "Bozza salvata." : "");
    setStato("pronto");
  }

  // Le mancanze raggruppate: «valore del bene significativo (righe 4, 5, 6)».
  const gruppi = new Map<string, number[]>();
  for (const x of m) gruppi.set(x.testo, [...(gruppi.get(x.testo) ?? []), ...(x.riga === null ? [] : [x.riga])]);
  const vaiAlGruppo = (testo: string, righe: number[]) => vaiA(righe.length ? `riga-${righe[0]}` : testo === mTrad ? "sezione-lingua" : "sezione-iva");

  const origine =
    p.origine?.tipo === "esempio"
      ? `esempio ${p.origine.caso} del banco di prova, uscita registrata del motore`
      : `preparata in ${(p.motore.elapsedMs / 1000).toFixed(0)} s`;

  return (
    <div>
      <p className="text-sm text-testo-3">
        Bozza n. <span className="font-mono">{p.numero}</span> · {origine}
      </p>
      <h1 className="mt-1 text-[34px] font-black leading-[1.05] [font-stretch:80%] sm:text-[44px]">Controlla e approva</h1>
      <p className="mt-2 text-[17px] text-testo-2">
        Nessun prezzo è inventato: quelli che vedi vengono dal listino, quelli vuoti li metti tu.
      </p>

      {/* Riepilogo dello stato: cosa è pronto, cosa va sistemato */}
      <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Stato delle righe">
        <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-superficie px-3.5 text-[15px] font-semibold text-lime-scuro ring-1 ring-linea">
          <Icona tipo="ok" /> {pronte} {pronte === 1 ? "pronta" : "pronte"}
        </span>
        {daPrezzare > 0 && (
          <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ambra px-3.5 text-[15px] font-semibold text-ambra-testo">
            <Icona tipo="euro" /> {daPrezzare} da prezzare
          </span>
        )}
        {senzaMisura > 0 && (
          <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ambra px-3.5 text-[15px] font-semibold text-ambra-testo">
            <Icona tipo="metro" /> {senzaMisura} senza misura
          </span>
        )}
        {senzaValore > 0 && (
          <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ambra px-3.5 text-[15px] font-semibold text-ambra-testo">
            <Icona tipo="avviso" /> {senzaValore} senza valore del bene
          </span>
        )}
        {domandeIva > 0 && (
          <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ambra px-3.5 text-[15px] font-semibold text-ambra-testo">
            <Icona tipo="avviso" /> IVA: {domandeIva} {domandeIva === 1 ? "domanda" : "domande"}
          </span>
        )}
      </div>

      <section id="sezione-cliente" className="mt-6 rounded-card bg-superficie p-5 ring-1 ring-linea">
        <h2 className="text-xl font-extrabold">Cliente</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className={etichetta}>
            Nome
            <input className={campo} value={p.cliente.name ?? ""} onChange={(e) => setP({ ...p, cliente: { ...p.cliente, name: e.target.value || null } })} />
          </label>
          <label className={etichetta}>
            Indirizzo del lavoro
            <input className={campo} value={p.cliente.address ?? ""} onChange={(e) => setP({ ...p, cliente: { ...p.cliente, address: e.target.value || null } })} />
          </label>
        </div>
      </section>

      {traduzioni && (
        <section id="sezione-lingua" className={`mt-4 rounded-card bg-superficie p-5 ring-1 ${mTrad ? "ring-2 ring-ambra-bordo" : "ring-linea"}`}>
          <h2 className="text-xl font-extrabold">Lingua del cliente</h2>
          <label className={`${etichetta} mt-3`}>
            In che lingua gli mandi il preventivo?
            <select className={campo} value={lingua} onChange={(e) => setP({ ...p, lingua: e.target.value as Lingua })}>
              {LINGUE.map((l) => (
                <option key={l} value={l}>
                  {l === "it" ? "Italiano" : `${NOME_LINGUA[l].proprio} (${NOME_LINGUA[l].italiano})`}
                </option>
              ))}
            </select>
          </label>
          {lingua !== "it" && (
            <>
              <p className="mt-3 text-[15px] leading-relaxed text-testo-2">
                Il cliente riceve messaggio, pagina e PDF in {NOME_LINGUA[lingua].italiano}, con il testo italiano accanto: in caso di
                dubbio vale l&apos;italiano. Controlla le voci tradotte, puoi correggerle.
              </p>
              {!allineata && p.traduzione?.lingua === lingua && (
                <p className="mt-3 rounded-campo bg-ambra px-4 py-3 text-[15px] font-semibold text-ambra-testo">
                  Hai cambiato le voci dopo la traduzione: rifalla, così il cliente legge le stesse cose che leggi tu.
                </p>
              )}
              {(!allineata || traduco) && (
                <button type="button" onClick={traduci} disabled={traduco} className="bottone bottone-azione mt-4 min-h-12 text-[16px] disabled:opacity-60">
                  {traduco ? "Traduco…" : p.traduzione?.lingua === lingua ? "Rifai la traduzione" : `Traduci in ${NOME_LINGUA[lingua].italiano}`}
                </button>
              )}
              {allineata && p.traduzione && (
                <ol className="mt-4 space-y-3">
                  {p.righe.map((r, i) => (
                    <li key={i}>
                      <label className="block text-[14px] text-testo-3">
                        {i + 1}. {r.work}
                        <input
                          lang={lingua}
                          className={campo}
                          value={p.traduzione!.righe[i]}
                          onChange={(e) => setTradotta("righe", i, e.target.value)}
                        />
                      </label>
                    </li>
                  ))}
                  {p.esclusioni.map((e, i) => (
                    <li key={`e${i}`}>
                      <label className="block text-[14px] text-testo-3">
                        Escluso: {e}
                        <input
                          lang={lingua}
                          className={campo}
                          value={p.traduzione!.esclusioni[i]}
                          onChange={(ev) => setTradotta("esclusioni", i, ev.target.value)}
                        />
                      </label>
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}
        </section>
      )}

      <section id="sezione-iva" className={`mt-4 rounded-card bg-superficie p-5 ring-1 ${domandeIva ? "ring-2 ring-ambra-bordo" : "ring-linea"}`}>
        <h2 className="text-xl font-extrabold">IVA: tre domande</h2>
        <div className="mt-3 space-y-4">
          <div data-manca={p.iva.dwelling === null || undefined}>
            <p className={etichetta}>È un&apos;abitazione?</p>
            <Scelta
              nome="È un'abitazione?"
              valore={p.iva.dwelling === null ? null : p.iva.dwelling ? "si" : "no"}
              opzioni={[
                { v: "si", testo: "Sì, ci abita qualcuno" },
                { v: "no", testo: "No, negozio o ufficio" },
              ]}
              onScegli={(v) => setP({ ...p, iva: { ...p.iva, dwelling: v === "si" } })}
            />
          </div>
          <div data-manca={p.iva.intervention === null || undefined}>
            <p className={etichetta}>Tipo di intervento</p>
            <Scelta
              nome="Tipo di intervento"
              valore={p.iva.intervention}
              opzioni={[
                { v: "manutenzione_ordinaria", testo: "Ordinaria" },
                { v: "manutenzione_straordinaria", testo: "Straordinaria" },
                { v: "ristrutturazione", testo: "Ristrutturazione" },
              ]}
              onScegli={(v) => setP({ ...p, iva: { ...p.iva, intervention: v } })}
            />
          </div>
          <div data-manca={p.iva.goodsBoughtBy === null || undefined}>
            <p className={etichetta}>Chi compra i materiali?</p>
            <Scelta
              nome="Chi compra i materiali?"
              valore={p.iva.goodsBoughtBy}
              opzioni={[
                { v: "impresa", testo: "Li compro io" },
                { v: "cliente", testo: "Il cliente" },
              ]}
              onScegli={(v) => setP({ ...p, iva: { ...p.iva, goodsBoughtBy: v } })}
            />
          </div>
        </div>
        <p className="mt-4 rounded-campo bg-fondo px-4 py-3 text-[15px] text-testo-2">
          {regime ? (
            <>
              <strong className="text-inchiostro">{REGIME[regime]}</strong>
              {c && c.at10Cents > 0 && c.at22Cents > 0 && (
                <>
                  {" "}
                  · 10% su <span className="font-mono">{euro(c.at10Cents)}</span>, 22% su <span className="font-mono">{euro(c.at22Cents)}</span>
                </>
              )}
              . Verifica sempre con il tuo commercialista.
            </>
          ) : (
            "Rispondi alle tre domande e calcolo io l'aliquota giusta."
          )}
        </p>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold">Lavorazioni · {p.righe.length}</h2>
          {pronte < p.righe.length && (
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-[15px] font-semibold">
              <input type="checkbox" className="size-5 accent-[#343645]" checked={soloDaSistemare} onChange={(e) => setSoloDaSistemare(e.target.checked)} />
              Solo da sistemare
            </label>
          )}
        </div>
        <ol className="mt-3 space-y-3">
          {p.righe.map((r, i) => {
            const imp = importoRiga(r);
            const st = stati[i];
            const manca = st.tipo === "manca";
            return (
              <li
                key={i}
                id={`riga-${i}`}
                hidden={soloDaSistemare && !manca}
                className={`relative overflow-hidden rounded-card bg-superficie p-4 pl-5 ring-1 ${manca ? "ring-2 ring-ambra-bordo" : "ring-linea"}`}
              >
                <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${manca ? "bg-ambra-bordo" : "bg-lime-scuro"}`} />
                <div className="flex items-start justify-between gap-3">
                  {manca ? (
                    <span className="inline-flex flex-wrap items-center gap-1.5 rounded-full bg-ambra px-3 py-1 text-[14px] font-bold text-ambra-testo">
                      <Icona tipo={st.motivi[0] === "Da prezzare" ? "euro" : st.motivi[0] === "Manca la misura" ? "metro" : "avviso"} />
                      {st.motivi.join(" · ")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[14px] font-bold text-lime-scuro">
                      <Icona tipo="ok" /> Pronta
                    </span>
                  )}
                  <span className="font-mono text-[17px] font-semibold">{imp === null ? "da completare" : euro(imp)}</span>
                </div>
                {manca && r.flag && <p className="mt-2 text-[15px] text-ambra-testo">{r.flag}</p>}
                {r.spoken && (
                  <p className="mt-3 border-l-2 border-linea-2 pl-3 text-[15px] leading-snug text-testo-3">
                    Hai detto: «{r.spoken}»
                  </p>
                )}
                <label className={`${etichetta} mt-3`}>
                  Voce del listino
                  <select className={campo} value={r.code ?? ""} onChange={(e) => scegliVoce(i, e.target.value)}>
                    <option value="">Fuori listino: prezzo a mano</option>
                    {voci.map((v) => (
                      <option key={v.code} value={v.code}>
                        {v.code} · {v.name} · {euro(v.priceCents)}/{UNITA[v.unit]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={`${etichetta} mt-3`}>
                  Descrizione sul preventivo
                  <input className={campo} value={r.work} onChange={(e) => setRiga(i, { work: e.target.value })} />
                </label>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <label className={etichetta} data-manca={r.quantity === null || undefined}>
                    Quantità
                    <input
                      inputMode="decimal"
                      className={`${campo} ${r.quantity === null ? "border-2 border-ambra-bordo bg-ambra" : ""}`}
                      defaultValue={r.quantity === null ? "" : String(r.quantity).replace(".", ",")}
                      onChange={(e) => setRiga(i, { quantity: numero(e.target.value) })}
                    />
                  </label>
                  <label className={etichetta} data-manca={r.unit === null || undefined}>
                    Unità
                    <select
                      className={`${campo} px-2 ${r.unit === null ? "border-2 border-ambra-bordo bg-ambra" : ""}`}
                      value={r.unit ?? ""}
                      onChange={(e) => setRiga(i, { unit: (e.target.value || null) as RigaPreventivo["unit"] })}
                    >
                      <option value="">Scegli</option>
                      {Object.entries(UNITA).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={etichetta} data-manca={r.unitPriceCents === null || undefined}>
                    Prezzo €
                    <input
                      inputMode="decimal"
                      className={`${campo} ${r.unitPriceCents === null ? "border-2 border-ambra-bordo bg-ambra" : ""}`}
                      value={testiPrezzo[i] ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setTestiPrezzo((t) => t.map((x, j) => (j === i ? v : x)));
                        const cents = centesimi(v);
                        const fromList = r.code && byCode.get(r.code)?.priceCents === cents;
                        setRiga(i, { unitPriceCents: cents, priceSource: cents === null ? null : fromList ? "listino" : "artigiano" });
                      }}
                    />
                  </label>
                </div>
                {regime === "agevolata_10_beni_significativi" && r.significantGood && r.code && (
                  <label className={`${etichetta} mt-3`} data-manca={r.goodsValueCents === null || undefined}>
                    Di cui valore del bene (sanitario, rubinetteria…), per l&apos;IVA
                    <input
                      inputMode="decimal"
                      className={`${campo} ${r.goodsValueCents === null ? "border-2 border-ambra-bordo bg-ambra" : ""}`}
                      defaultValue={r.goodsValueCents === null ? "" : (r.goodsValueCents / 100).toFixed(2).replace(".", ",")}
                      onChange={(e) => setRiga(i, { goodsValueCents: centesimi(e.target.value) })}
                    />
                  </label>
                )}
                {r.code === null && r.priceSource === "artigiano" && (
                  <label className="mt-3 flex min-h-11 items-center gap-2.5 text-[15px]">
                    <input type="checkbox" className="size-5 accent-[#343645]" checked={r.addToPriceList} onChange={(e) => setRiga(i, { addToPriceList: e.target.checked })} />
                    Proponi di aggiungerla al mio listino con questo prezzo
                  </label>
                )}
                <button type="button" onClick={() => togliRiga(i)} className="mt-2 min-h-11 text-[15px] font-semibold text-testo-3 underline">
                  Togli la riga
                </button>
              </li>
            );
          })}
        </ol>
        <button type="button" onClick={aggiungiRiga} className="bottone mt-4 border-2 border-ardesia text-[16px]">
          Aggiungi una riga
        </button>
      </section>

      <section className="mt-8 rounded-card bg-superficie p-5 ring-1 ring-linea">
        <h2 className="text-xl font-extrabold">Esclusi dal preventivo</h2>
        <textarea
          rows={3}
          className={`${campo} py-3`}
          value={p.esclusioni.join("\n")}
          onChange={(e) => setP({ ...p, esclusioni: e.target.value.split("\n").filter((x) => x.trim()) })}
          placeholder="Una per riga"
        />
        {p.note.length > 0 && (
          <>
            <h3 className="mt-4 font-bold">Note dal sopralluogo (non vanno sul PDF)</h3>
            <ul className="mt-1 list-disc pl-5 text-[15px] text-testo-2">
              {p.note.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="su-scuro mt-6 rounded-card bg-ardesia p-5 text-fondo">
        <h2 className="text-xl font-extrabold">Riepilogo</h2>
        <div className="mt-3 flex items-baseline justify-between">
          <span>Imponibile</span>
          <span className="font-mono text-lg font-semibold">{euro(c ? c.taxableCents : imponibileParziale(p.righe))}</span>
        </div>
        {c && (
          <>
            {c.at10Cents > 0 && (
              <div className="flex justify-between text-[15px] text-scuro-testo">
                <span>IVA 10% su {euro(c.at10Cents)}</span>
                <span className="font-mono">{euro(Math.round(c.at10Cents * 0.1))}</span>
              </div>
            )}
            {c.at22Cents > 0 && (
              <div className="flex justify-between text-[15px] text-scuro-testo">
                <span>IVA 22% su {euro(c.at22Cents)}</span>
                <span className="font-mono">{euro(Math.round(c.at22Cents * 0.22))}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t border-scuro-linea pt-2 text-xl font-bold">
              <span>Totale</span>
              <span className="font-mono">{euro(c.totalCents)}</span>
            </div>
          </>
        )}
        {m.length > 0 && (
          <>
            <p className="mt-5 font-bold">Prima di approvare manca:</p>
            <ul className="mt-2 space-y-1.5">
              {[...gruppi].map(([testo, righe]) => (
                <li key={testo}>
                  <button
                    type="button"
                    onClick={() => vaiAlGruppo(testo, righe)}
                    className="min-h-10 text-left text-[15px] text-cielo underline underline-offset-2"
                  >
                    {testo}
                    {righe.length ? ` (riga ${righe.map((r) => r + 1).join(", ")})` : ""}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        <button type="button" onClick={soloSalva} disabled={stato === "invio"} className="bottone mt-5 border-2 border-scuro-linea text-[16px]">
          Salva la bozza
        </button>
        {messaggio && (
          <p role="status" className="mt-3 text-[15px]">
            {messaggio}
          </p>
        )}
      </section>

      {/* Barra sempre visibile: totale e un solo pulsante, che porta al prossimo dato mancante o all'approvazione */}
      <div className="su-scuro sticky bottom-0 z-30 -mx-4 mt-6 flex items-center gap-3 bg-ardesia px-4 py-3 text-fondo shadow-[0_-8px_24px_rgba(31,32,41,0.18)] sm:bottom-4 sm:mx-0 sm:rounded-card">
        <div className="min-w-0 flex-1 leading-tight">
          <span className="block text-[13px] text-scuro-nota">{c ? "Totale IVA inclusa" : "Imponibile finora"}</span>
          <span className="font-mono text-[19px] font-semibold">{euro(c ? c.totalCents : imponibileParziale(p.righe))}</span>
        </div>
        {m.length > 0 ? (
          <button type="button" onClick={primoDaSistemare} className="bottone min-h-14 bg-ambra px-5 text-[16px] text-ambra-testo">
            Sistema {m.length} {m.length === 1 ? "dato" : "dati"}
          </button>
        ) : (
          <button type="button" onClick={() => setConferma(true)} disabled={stato === "invio"} className="bottone bottone-azione-scuro min-h-14 px-5 text-[16px]">
            Approva e genera il PDF
          </button>
        )}
      </div>

      {conferma && c && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-inchiostro/50 sm:items-center" onClick={() => setConferma(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titolo-conferma"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-card bg-superficie p-6 sm:rounded-card"
          >
            <h2 id="titolo-conferma" className="text-2xl font-black [font-stretch:85%]">
              Approvi il preventivo?
            </h2>
            <p className="mt-2 text-[16px] text-testo-2">
              Totale <span className="font-mono font-semibold text-inchiostro">{euro(c.totalCents)}</span> · {REGIME[c.regime!]}. Dopo
              l&apos;approvazione la bozza non si modifica più: genero il PDF e il link per il cliente.
            </p>
            <label className="mt-5 flex min-h-12 cursor-pointer items-center gap-3 rounded-campo bg-fondo px-4 text-[16px] font-semibold">
              <input ref={spunta} type="checkbox" className="size-6 accent-[#343645]" checked={controllato} onChange={(e) => setControllato(e.target.checked)} />
              Ho controllato prezzi e quantità
            </label>
            <div className="mt-5 flex flex-col gap-2">
              <button type="button" disabled={!controllato || stato === "invio"} onClick={approva} className="bottone bottone-azione min-h-14 text-[17px] disabled:opacity-50">
                {stato === "invio" ? "Genero il PDF…" : "Approva e genera il PDF"}
              </button>
              <button type="button" onClick={() => setConferma(false)} className="bottone min-h-12 text-[16px] font-semibold text-testo-2">
                Torna alla bozza
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
