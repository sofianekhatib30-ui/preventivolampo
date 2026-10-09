"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { centesimi, euro } from "@/components/preventivo/formato";
import { useLingua } from "@/lib/i18n/client";
import { fmt } from "@/lib/i18n/testo";
import type { Voce } from "@/lib/impresa/schema";

const campo = "mt-1 block min-h-12 w-full rounded-campo border border-linea-2 bg-superficie px-3 text-[17px] font-normal text-inchiostro";
const etichetta = "block text-[15px] font-semibold text-testo-2";
const MOSTRA = 60;

type Bozza = {
  codice: string;
  nome: string;
  descrizione: string;
  unita: string;
  prezzo: string;
  categoria: string;
  sinonimi: string;
  bene_significativo: boolean;
  fornibile_dal_cliente: boolean;
};

const daVoce = (v: Voce): Bozza => ({
  codice: v.codice,
  nome: v.nome,
  descrizione: v.descrizione ?? "",
  unita: v.unita,
  prezzo: (v.prezzo_cents / 100).toFixed(2).replace(".", ","),
  categoria: v.categoria ?? "",
  sinonimi: v.sinonimi.join(", "),
  bene_significativo: v.bene_significativo,
  fornibile_dal_cliente: v.fornibile_dal_cliente,
});

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function prossimoCodice(voci: Voce[]): string {
  let n = voci.length + 1;
  const usati = new Set(voci.map((v) => v.codice));
  while (usati.has(`V-${String(n).padStart(4, "0")}`)) n++;
  return `V-${String(n).padStart(4, "0")}`;
}

function Editor({ iniziale, id, onFatto, onAnnulla }: { iniziale: Bozza; id: string | null; onFatto: () => void; onAnnulla: () => void }) {
  const [b, setB] = useState(iniziale);
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState("");
  const [conferma, setConferma] = useState(false);
  const { d } = useLingua();
  const L = d.area.elencoListino;
  const UNITA: Record<string, string> = d.area.formato.unita;
  const set = <K extends keyof Bozza>(k: K, x: Bozza[K]) => setB((p) => ({ ...p, [k]: x }));

  async function salva(e: React.FormEvent) {
    e.preventDefault();
    const prezzo = centesimi(b.prezzo);
    if (prezzo === null) return setErrore(L.errorePrezzo);
    setInvio(true);
    setErrore("");
    const res = await fetch(id ? `/api/area/voci/${id}` : "/api/area/voci", {
      method: id ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        codice: b.codice,
        nome: b.nome,
        descrizione: b.descrizione,
        unita: b.unita,
        prezzo_cents: prezzo,
        categoria: b.categoria,
        sinonimi: b.sinonimi
          .split(/[,;\n]/)
          .map((s) => s.trim())
          .filter((s) => s.length >= 2)
          .slice(0, 20),
        bene_significativo: b.bene_significativo,
        fornibile_dal_cliente: b.fornibile_dal_cliente,
      }),
    });
    setInvio(false);
    if (!res.ok) return setErrore((await res.json().catch(() => ({}))).errore ?? L.erroreSalva);
    onFatto();
  }

  async function togli() {
    if (!id) return;
    setInvio(true);
    const res = await fetch(`/api/area/voci/${id}`, { method: "DELETE" });
    setInvio(false);
    if (!res.ok) return setErrore((await res.json().catch(() => ({}))).errore ?? L.erroreTogli);
    onFatto();
  }

  return (
    <form onSubmit={salva} className="space-y-3 border-t border-linea bg-fondo px-4 py-4 sm:px-5" noValidate>
      <label className={etichetta}>
        {L.nomeVoce}
        <input className={campo} value={b.nome} onChange={(e) => set("nome", e.target.value)} autoFocus />
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className={etichetta}>
          {L.prezzo}
          <input className={`${campo} font-mono`} inputMode="decimal" value={b.prezzo} onChange={(e) => set("prezzo", e.target.value)} />
        </label>
        <label className={etichetta}>
          {L.unita}
          <select className={`${campo} px-2`} value={b.unita} onChange={(e) => set("unita", e.target.value)}>
            {Object.entries(UNITA).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className={`${etichetta} col-span-2 sm:col-span-1`}>
          {L.codice}
          <input className={`${campo} font-mono`} value={b.codice} onChange={(e) => set("codice", e.target.value)} autoCapitalize="characters" />
        </label>
      </div>
      <label className={etichetta}>
        {L.descrizione}
        <textarea className={`${campo} min-h-20 py-2`} value={b.descrizione} onChange={(e) => set("descrizione", e.target.value)} />
      </label>
      <label className={etichetta}>
        {L.aVoce}
        <input className={campo} value={b.sinonimi} onChange={(e) => set("sinonimi", e.target.value)} placeholder={L.aVoceSegnaposto} />
        <span className="mt-1 block text-[14px] font-normal text-testo-3">{L.aVoceNota}</span>
      </label>
      <label className={etichetta}>
        {L.categoria}
        <input className={campo} value={b.categoria} onChange={(e) => set("categoria", e.target.value)} />
      </label>
      <label className="flex min-h-11 items-start gap-3 text-[16px]">
        <input type="checkbox" className="mt-1 size-5 shrink-0 accent-[#343645]" checked={b.bene_significativo} onChange={(e) => set("bene_significativo", e.target.checked)} />
        <span>
          {L.beneSignificativo}
          <span className="block text-[14px] text-testo-3">{L.beneNota}</span>
        </span>
      </label>
      <label className="flex min-h-11 items-start gap-3 text-[16px]">
        <input type="checkbox" className="mt-1 size-5 shrink-0 accent-[#343645]" checked={b.fornibile_dal_cliente} onChange={(e) => set("fornibile_dal_cliente", e.target.checked)} />
        <span>
          {L.materiale}
          <span className="block text-[14px] text-testo-3">{L.materialeNota}</span>
        </span>
      </label>
      {errore && (
        <p role="alert" className="text-[15px] font-semibold text-errore">
          {errore}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button type="submit" disabled={invio} className="bottone bottone-azione min-h-12 text-[16px] disabled:opacity-50">
          {invio ? L.salvo : id ? L.salva : L.aggiungi}
        </button>
        <button type="button" onClick={onAnnulla} className="bottone min-h-12 border-2 border-linea-2 text-[16px]">
          {L.annulla}
        </button>
        {id &&
          (conferma ? (
            <button type="button" onClick={togli} disabled={invio} className="min-h-12 px-3 text-[15px] font-bold text-errore underline">
              {L.togliConferma}
            </button>
          ) : (
            <button type="button" onClick={() => setConferma(true)} className="ml-auto min-h-12 px-3 text-[15px] font-semibold text-testo-3 underline">
              {L.togli}
            </button>
          ))}
      </div>
    </form>
  );
}

// Il listino dell'impresa: cerca, correggi un prezzo, aggiungi una voce.
export default function Listino({ voci, apriNuova = false }: { voci: Voce[]; apriNuova?: boolean }) {
  const router = useRouter();
  const [cerca, setCerca] = useState("");
  const [aperta, setAperta] = useState<string | null>(apriNuova ? "nuova" : null);
  const [quante, setQuante] = useState(MOSTRA);
  const { d } = useLingua();
  const L = d.area.elencoListino;
  const PER_UNITA: Record<string, string> = d.area.formato.perUnita;

  const trovate = useMemo(() => {
    const parole = norm(cerca).split(/\s+/).filter(Boolean);
    if (!parole.length) return voci;
    return voci.filter((v) => {
      const testo = norm(`${v.codice} ${v.nome} ${v.descrizione ?? ""} ${v.categoria ?? ""} ${v.sinonimi.join(" ")}`);
      return parole.every((p) => testo.includes(p));
    });
  }, [voci, cerca]);

  const fatto = () => {
    setAperta(null);
    router.refresh();
  };

  return (
    <div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className={`${etichetta} flex-1`}>
          {L.cerca}
          <input
            type="search"
            className={campo}
            value={cerca}
            onChange={(e) => {
              setCerca(e.target.value);
              setQuante(MOSTRA);
            }}
            placeholder={L.cercaSegnaposto}
          />
        </label>
        <button type="button" onClick={() => setAperta("nuova")} className="bottone bottone-azione min-h-12 text-[16px]">
          {L.aggiungiVoce}
        </button>
      </div>
      <p className="mt-3 text-[15px] text-testo-3" aria-live="polite">
        {cerca ? fmt(L.trovate, { n: trovate.length, totale: voci.length }) : fmt(L.voci, { n: voci.length })} ·{" "}
        <Link href="/area/listino/importa" className="font-semibold text-cielo-scuro">
          {L.importaLink}
        </Link>
      </p>

      {aperta === "nuova" && (
        <div className="mt-4 overflow-hidden rounded-card ring-2 ring-ardesia">
          <p className="bg-superficie px-4 pt-4 text-lg font-extrabold sm:px-5">{L.nuovaVoce}</p>
          <Editor
            id={null}
            iniziale={{ codice: prossimoCodice(voci), nome: "", descrizione: "", unita: "m2", prezzo: "", categoria: "", sinonimi: "", bene_significativo: false, fornibile_dal_cliente: false }}
            onFatto={fatto}
            onAnnulla={() => setAperta(null)}
          />
        </div>
      )}

      <ul className="mt-4 divide-y divide-linea overflow-hidden rounded-card bg-superficie ring-1 ring-linea">
        {trovate.slice(0, quante).map((v) => (
          <li key={v.id}>
            <button
              type="button"
              aria-expanded={aperta === v.id}
              onClick={() => setAperta(aperta === v.id ? null : v.id)}
              className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left sm:px-5"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-semibold leading-snug">{v.nome}</span>
                <span className="block font-mono text-[14px] text-testo-3">
                  {v.codice}
                  {v.categoria ? ` · ${v.categoria}` : ""}
                  {v.origine === "demo" ? ` · ${L.prezzoEsempio}` : ""}
                </span>
              </span>
              <span className="shrink-0 text-right font-mono">
                <span className="block text-[17px] font-semibold">{euro(v.prezzo_cents)}</span>
                <span className="block text-[14px] text-testo-3">{PER_UNITA[v.unita]}</span>
              </span>
            </button>
            {aperta === v.id && <Editor id={v.id} iniziale={daVoce(v)} onFatto={fatto} onAnnulla={() => setAperta(null)} />}
          </li>
        ))}
        {trovate.length === 0 && <li className="px-5 py-8 text-center text-[17px] text-testo-3">{fmt(L.nessunaVoce, { cerca })}</li>}
      </ul>
      {trovate.length > quante && (
        <button type="button" onClick={() => setQuante((q) => q + MOSTRA * 2)} className="bottone mt-4 min-h-12 w-full border-2 border-linea-2 text-[16px]">
          {fmt(L.mostraAltre, { n: Math.min(MOSTRA * 2, trovate.length - quante) })}
        </button>
      )}
    </div>
  );
}
