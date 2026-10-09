"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { centesimi, euro } from "@/components/preventivo/formato";
import { ConNodi } from "@/components/Ricco";
import { useLingua } from "@/lib/i18n/client";
import { fmt } from "@/lib/i18n/testo";
import type { Proposta } from "@/lib/impresa/da-prezzare";

const piccolo = "mt-1 block min-h-12 w-full rounded-campo border border-linea-2 bg-superficie px-3 text-[17px] font-normal";

function Scheda({ p, codice }: { p: Proposta; codice: string }) {
  const router = useRouter();
  const { d } = useLingua();
  const D = d.area.daPrezzare;
  const UNITA: Record<string, string> = d.area.formato.unita;
  const PER_UNITA: Record<string, string> = d.area.formato.perUnita;
  const [nome, setNome] = useState(p.nome);
  const [unita, setUnita] = useState(p.unita ?? "cad");
  const [prezzo, setPrezzo] = useState(p.prezzo_cents === null ? "" : (p.prezzo_cents / 100).toFixed(2).replace(".", ","));
  const [cod, setCod] = useState(codice);
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState("");

  async function manda(corpo: object) {
    setInvio(true);
    setErrore("");
    const res = await fetch(`/api/area/da-prezzare/${p.id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo) });
    setInvio(false);
    if (!res.ok) return setErrore((await res.json().catch(() => ({}))).errore ?? D.erroreSalva);
    router.refresh();
  }

  function aggiungi() {
    const c = centesimi(prezzo);
    if (c === null) return setErrore(D.errorePrezzo);
    manda({
      azione: "aggiungi",
      voce: { codice: cod, nome, descrizione: null, unita, prezzo_cents: c, categoria: null, sinonimi: [p.nome.slice(0, 60)].filter((s) => s.length >= 2), bene_significativo: false, fornibile_dal_cliente: false },
    });
  }

  return (
    <li className="rounded-card bg-superficie p-4 ring-1 ring-linea sm:p-5">
      <p className="text-[14px] text-testo-3">
        <ConNodi testo={D.dalPreventivo} valori={{ numero: <span className="font-mono">{p.numero ?? "?"}</span> }} />
        {p.prezzo_cents !== null && p.unita && ` · ${fmt(D.haiMesso, { prezzo: euro(p.prezzo_cents), unita: PER_UNITA[p.unita] ?? p.unita })}`}
      </p>
      <label className="mt-2 block text-[15px] font-semibold text-testo-2">
        {D.nomeListino}
        <input className={piccolo} value={nome} onChange={(e) => setNome(e.target.value)} />
      </label>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <label className="block text-[15px] font-semibold text-testo-2">
          {D.prezzo}
          <input className={`${piccolo} font-mono`} inputMode="decimal" value={prezzo} onChange={(e) => setPrezzo(e.target.value)} />
        </label>
        <label className="block text-[15px] font-semibold text-testo-2">
          {D.unita}
          <select className={`${piccolo} px-2`} value={unita} onChange={(e) => setUnita(e.target.value)}>
            {Object.entries(UNITA).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[15px] font-semibold text-testo-2">
          {D.codice}
          <input className={`${piccolo} font-mono`} value={cod} onChange={(e) => setCod(e.target.value)} />
        </label>
      </div>
      {errore && (
        <p role="alert" className="mt-2 text-[15px] font-semibold text-errore">
          {errore}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={aggiungi} disabled={invio} className="bottone bottone-azione min-h-12 text-[16px] disabled:opacity-50">
          {D.aggiungi}
        </button>
        <button type="button" onClick={() => manda({ azione: "scarta" })} disabled={invio} className="bottone min-h-12 border-2 border-linea-2 text-[16px]">
          {D.nonServe}
        </button>
      </div>
    </li>
  );
}

// Le righe prezzate a mano nei preventivi, che l'artigiano ha chiesto di tenere: entrano nel listino solo se le conferma.
export default function DaPrezzare({ proposte, primoCodice }: { proposte: Proposta[]; primoCodice: number }) {
  return (
    <ul className="mt-6 space-y-3">
      {proposte.map((p, i) => (
        <Scheda key={p.id} p={p} codice={`V-${String(primoCodice + i).padStart(4, "0")}`} />
      ))}
    </ul>
  );
}
