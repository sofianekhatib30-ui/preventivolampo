"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { conti, importoRiga, imponibileParziale, mancanze, regimeDi } from "@/lib/preventivi/calcolo";
import type { Preventivo, RigaPreventivo } from "@/lib/preventivi/modello";
import { centesimi, euro, numero, REGIME, UNITA } from "./formato";

type Voce = { code: string; name: string; unit: string; priceCents: number; significantGood: boolean };

const campo = "mt-1 block w-full rounded-campo border border-linea-2 bg-superficie px-3 py-2.5";

export default function Revisione({ iniziale, voci }: { iniziale: Preventivo; voci: Voce[] }) {
  const router = useRouter();
  const [p, setP] = useState<Preventivo>(iniziale);
  const [testiPrezzo, setTestiPrezzo] = useState<string[]>(iniziale.righe.map((r) => (r.unitPriceCents === null ? "" : (r.unitPriceCents / 100).toFixed(2).replace(".", ","))));
  const [stato, setStato] = useState<"pronto" | "invio">("pronto");
  const [messaggio, setMessaggio] = useState("");
  const byCode = useMemo(() => new Map(voci.map((v) => [v.code, v])), [voci]);

  const m = mancanze(p);
  const c = conti(p);
  const regime = regimeDi(p);

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
  }

  function togliRiga(i: number) {
    setP((prev) => ({ ...prev, righe: prev.righe.filter((_, j) => j !== i) }));
    setTestiPrezzo((t) => t.filter((_, j) => j !== i));
  }

  async function salva(): Promise<boolean> {
    const res = await fetch(`/api/preventivi/${p.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ cliente: p.cliente, iva: p.iva, righe: p.righe, esclusioni: p.esclusioni }),
    });
    if (!res.ok) {
      setMessaggio((await res.json()).errore ?? "Errore nel salvataggio");
      return false;
    }
    return true;
  }

  async function approva() {
    setStato("invio");
    setMessaggio("");
    if (await salva()) {
      const res = await fetch(`/api/preventivi/${p.id}/approva`, { method: "POST" });
      if (res.ok) {
        router.refresh();
        return;
      }
      setMessaggio((await res.json()).errore ?? "Errore");
    }
    setStato("pronto");
  }

  async function soloSalva() {
    setStato("invio");
    setMessaggio((await salva()) ? "Bozza salvata." : "");
    setStato("pronto");
  }

  const dubbie = p.righe.filter((r) => r.flag).length;
  // Le mancanze raggruppate: «valore del bene significativo (righe 4, 5, 6)».
  const gruppi = new Map<string, number[]>();
  for (const x of m) gruppi.set(x.testo, [...(gruppi.get(x.testo) ?? []), ...(x.riga === null ? [] : [x.riga + 1])]);
  const riassunto = [...gruppi].map(([testo, righe]) => (righe.length ? `${testo} (riga ${righe.join(", ")})` : testo));

  return (
    <div>
      <p className="font-mono text-sm text-testo-3">Bozza n. {p.numero} · preparata in {(p.motore.elapsedMs / 1000).toFixed(0)} s</p>
      <h1 className="mt-2 text-3xl font-black leading-tight">Controlla e approva</h1>
      <p className="mt-2 text-testo-2">
        {p.righe.length} righe{dubbie ? `, ${dubbie} da guardare (in giallo)` : ""}. Nessun prezzo è inventato: quelli che vedi
        vengono dal tuo listino, quelli vuoti li metti tu.
      </p>

      <section className="mt-8 rounded-card bg-superficie p-5">
        <h2 className="text-lg font-extrabold">Cliente</h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Nome
            <input className={campo} value={p.cliente.name ?? ""} onChange={(e) => setP({ ...p, cliente: { ...p.cliente, name: e.target.value || null } })} />
          </label>
          <label className="text-sm font-semibold">
            Indirizzo del lavoro
            <input className={campo} value={p.cliente.address ?? ""} onChange={(e) => setP({ ...p, cliente: { ...p.cliente, address: e.target.value || null } })} />
          </label>
        </div>
      </section>

      <section className="mt-4 rounded-card bg-superficie p-5">
        <h2 className="text-lg font-extrabold">IVA: tre domande</h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          <label className="text-sm font-semibold">
            È un&apos;abitazione?
            <select className={campo} value={p.iva.dwelling === null ? "" : String(p.iva.dwelling)} onChange={(e) => setP({ ...p, iva: { ...p.iva, dwelling: e.target.value === "" ? null : e.target.value === "true" } })}>
              <option value="">— da rispondere —</option>
              <option value="true">Sì</option>
              <option value="false">No (negozio, ufficio…)</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            Tipo di intervento
            <select className={campo} value={p.iva.intervention ?? ""} onChange={(e) => setP({ ...p, iva: { ...p.iva, intervention: (e.target.value || null) as Preventivo["iva"]["intervention"] } })}>
              <option value="">— da rispondere —</option>
              <option value="manutenzione_ordinaria">Manutenzione ordinaria</option>
              <option value="manutenzione_straordinaria">Manutenzione straordinaria</option>
              <option value="ristrutturazione">Ristrutturazione</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            Chi compra i materiali?
            <select className={campo} value={p.iva.goodsBoughtBy ?? ""} onChange={(e) => setP({ ...p, iva: { ...p.iva, goodsBoughtBy: (e.target.value || null) as Preventivo["iva"]["goodsBoughtBy"] } })}>
              <option value="">— da rispondere —</option>
              <option value="impresa">Li compro io</option>
              <option value="cliente">Il cliente</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-sm text-testo-2">
          {regime ? `Regime: ${REGIME[regime]}.` : "Rispondi alle tre domande per calcolare l'IVA."} Verifica sempre con il tuo commercialista.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-extrabold">Lavorazioni</h2>
        <ol className="mt-3 space-y-3">
          {p.righe.map((r, i) => {
            const imp = importoRiga(r);
            return (
              <li key={i} className={`rounded-card p-4 ${r.flag ? "border-2 border-segnale bg-scontrino" : "bg-superficie"}`}>
                {r.flag && <p className="mb-2 rounded-campo bg-segnale px-3 py-2 text-sm font-semibold">{r.flag}</p>}
                <label className="block text-sm font-semibold">
                  Voce del listino
                  <select className={campo} value={r.code ?? ""} onChange={(e) => scegliVoce(i, e.target.value)}>
                    <option value="">— fuori listino (prezzo a mano) —</option>
                    {voci.map((v) => (
                      <option key={v.code} value={v.code}>
                        {v.code} · {v.name} · {euro(v.priceCents)}/{UNITA[v.unit]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="mt-2 block text-sm font-semibold">
                  Descrizione sul preventivo
                  <input className={campo} value={r.work} onChange={(e) => setRiga(i, { work: e.target.value })} />
                </label>
                {r.spoken && <p className="mt-1 text-xs text-testo-3">Hai detto: «{r.spoken}»</p>}
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <label className="text-sm font-semibold">
                    Quantità
                    <input inputMode="decimal" className={campo} defaultValue={r.quantity === null ? "" : String(r.quantity).replace(".", ",")} onChange={(e) => setRiga(i, { quantity: numero(e.target.value) })} />
                  </label>
                  <label className="text-sm font-semibold">
                    Unità
                    <select className={campo} value={r.unit ?? ""} onChange={(e) => setRiga(i, { unit: (e.target.value || null) as RigaPreventivo["unit"] })}>
                      <option value="">—</option>
                      {Object.entries(UNITA).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-semibold">
                    Prezzo (€)
                    <input
                      inputMode="decimal"
                      className={campo}
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
                  <label className="mt-2 block text-sm font-semibold">
                    Di cui valore del bene (sanitario, rubinetteria…), per l&apos;IVA
                    <input inputMode="decimal" className={campo} defaultValue={r.goodsValueCents === null ? "" : (r.goodsValueCents / 100).toFixed(2).replace(".", ",")} onChange={(e) => setRiga(i, { goodsValueCents: centesimi(e.target.value) })} />
                  </label>
                )}
                {r.code === null && r.priceSource === "artigiano" && (
                  <label className="mt-2 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={r.addToPriceList} onChange={(e) => setRiga(i, { addToPriceList: e.target.checked })} />
                    Proponi di aggiungerla al mio listino con questo prezzo
                  </label>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <button type="button" onClick={() => togliRiga(i)} className="text-sm underline">
                    Togli la riga
                  </button>
                  <span className="font-mono font-semibold">{imp === null ? "—" : euro(imp)}</span>
                </div>
              </li>
            );
          })}
        </ol>
        <button type="button" onClick={aggiungiRiga} className="mt-3 rounded-campo border-2 border-inchiostro px-4 py-3 font-bold">
          Aggiungi una riga
        </button>
      </section>

      <section className="mt-6 rounded-card bg-superficie p-5">
        <h2 className="text-lg font-extrabold">Esclusi dal preventivo</h2>
        <textarea
          rows={3}
          className={campo}
          value={p.esclusioni.join("\n")}
          onChange={(e) => setP({ ...p, esclusioni: e.target.value.split("\n").filter((x) => x.trim()) })}
          placeholder="Una per riga"
        />
        {p.note.length > 0 && (
          <>
            <h3 className="mt-4 font-bold">Note dal sopralluogo (non vanno sul PDF)</h3>
            <ul className="mt-1 list-disc pl-5 text-sm text-testo-2">
              {p.note.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="mt-6 rounded-card bg-inchiostro p-5 text-fondo su-scuro">
        <div className="flex items-baseline justify-between font-mono">
          <span>Imponibile</span>
          <span className="text-lg font-semibold">{euro(c ? c.taxableCents : imponibileParziale(p.righe))}</span>
        </div>
        {c && (
          <>
            {c.at10Cents > 0 && (
              <div className="flex justify-between font-mono text-sm text-scuro-testo">
                <span>IVA 10% su {euro(c.at10Cents)}</span>
                <span>{euro(Math.round(c.at10Cents * 0.1))}</span>
              </div>
            )}
            {c.at22Cents > 0 && (
              <div className="flex justify-between font-mono text-sm text-scuro-testo">
                <span>IVA 22% su {euro(c.at22Cents)}</span>
                <span>{euro(Math.round(c.at22Cents * 0.22))}</span>
              </div>
            )}
            <div className="mt-1 flex justify-between font-mono text-xl font-semibold">
              <span>Totale</span>
              <span>{euro(c.totalCents)}</span>
            </div>
          </>
        )}
        {m.length > 0 && (
          <>
            <p className="mt-4 font-bold">Prima di approvare</p>
            <ul className="mt-1 list-disc pl-5 text-sm text-scuro-testo">
              {riassunto.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </>
        )}
        <button type="button" onClick={soloSalva} disabled={stato === "invio"} className="mt-4 rounded-campo border border-scuro-linea px-5 py-3 font-bold">
          Salva la bozza
        </button>
        {messaggio && (
          <p role="status" className="mt-3 text-sm">
            {messaggio}
          </p>
        )}
      </section>

      {/* Barra sottile sempre visibile: totale e approvazione. I dettagli sono nel riquadro qui sopra. */}
      <div className="sticky bottom-0 -mx-4 mt-6 flex items-center gap-3 border-t border-linea bg-fondo/95 px-4 py-3 backdrop-blur">
        <div className="min-w-0 flex-1 font-mono text-sm leading-tight">
          <span className="block text-testo-3">{c ? "Totale" : "Imponibile"}</span>
          <span className="text-base font-semibold">{euro(c ? c.totalCents : imponibileParziale(p.righe))}</span>
        </div>
        <button type="button" onClick={approva} disabled={m.length > 0 || stato === "invio"} className="rounded-campo bg-segnale px-4 py-3 font-bold text-inchiostro disabled:bg-linea disabled:text-testo-3">
          {m.length > 0 ? `Mancano ${m.length} dati` : "Approva e genera il PDF"}
        </button>
      </div>
    </div>
  );
}
