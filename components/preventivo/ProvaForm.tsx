"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLingua } from "@/lib/i18n/client";
import type { Dizionario } from "@/lib/i18n/it";
import Dettatura from "./Dettatura";

type Esempio = { id: string; titolo: string; testo: string };

// Quattro esempi in evidenza, uno per mestiere; gli altri 26 restano nel menu. Le parole vengono dal dizionario.
const IN_EVIDENZA: { id: string; mestiere: keyof Dizionario["area"]["modulo"]["mestieri"]; lavoro: keyof Dizionario["area"]["prova"]["lavori"] }[] = [
  { id: "01", mestiere: "muratore", lavoro: "bagno" },
  { id: "02", mestiere: "imbianchino", lavoro: "tinteggiatura" },
  { id: "04", mestiere: "elettricista", lavoro: "cucina" },
  { id: "06", mestiere: "piastrellista", lavoro: "pavimento" },
];

export default function ProvaForm({ esempi, chiediCodice }: { esempi: Esempio[]; chiediCodice: boolean }) {
  const router = useRouter();
  const { d } = useLingua();
  const P = d.area.prova;
  // Cosa sta facendo il motore, in ordine. Sono le fasi vere della pipeline, non numeri inventati.
  const FASI = P.fasi;
  const [modo, setModo] = useState<"esempio" | "testo">("esempio");
  const [scelto, setScelto] = useState<string>("01");
  const [testo, setTesto] = useState("");
  const [codice, setCodice] = useState("");
  const [invio, setInvio] = useState(false);
  const [fase, setFase] = useState(0);
  const [errore, setErrore] = useState("");

  const esempio = esempi.find((x) => x.id === scelto);

  useEffect(() => {
    if (!invio || modo !== "testo") return;
    const t = window.setInterval(() => setFase((f) => Math.min(f + 1, FASI.length - 1)), 4500);
    return () => window.clearInterval(t);
  }, [invio, modo, FASI.length]);

  async function invia(corpo: Record<string, string>) {
    setFase(0);
    setInvio(true);
    setErrore("");
    try {
      const res = await fetch("/api/elabora", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(corpo),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.errore ?? P.errore);
      router.push(body.revisione);
    } catch (err) {
      setErrore(err instanceof Error ? err.message : P.errore);
      setInvio(false);
    }
  }

  const schede = "flex min-h-12 flex-1 items-center justify-center rounded-full px-4 text-[16px] font-bold";

  return (
    <div className="mt-8">
      <div role="tablist" aria-label={P.daDove} className="flex gap-1 rounded-full bg-fondo-2 p-1">
        <button type="button" role="tab" aria-selected={modo === "esempio"} onClick={() => setModo("esempio")} className={`${schede} ${modo === "esempio" ? "bg-ardesia text-fondo" : "text-testo-2"}`}>
          {P.unEsempio}
        </button>
        <button type="button" role="tab" aria-selected={modo === "testo"} onClick={() => setModo("testo")} className={`${schede} ${modo === "testo" ? "bg-ardesia text-fondo" : "text-testo-2"}`}>
          {P.tuoTesto}
        </button>
      </div>

      {modo === "esempio" ? (
        <section className="mt-6" aria-label={P.esempiBanco}>
          <p className="text-[17px] text-testo-2">
            {P.esempiTesto}
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2.5">
            {IN_EVIDENZA.map((x) => (
              <li key={x.id}>
                <button
                  type="button"
                  aria-pressed={scelto === x.id}
                  onClick={() => setScelto(x.id)}
                  className={`flex min-h-[76px] w-full flex-col items-start justify-center rounded-campo border-2 px-4 py-3 text-left ${
                    scelto === x.id ? "border-ardesia bg-superficie shadow-[inset_4px_0_0_var(--color-lime-scuro)]" : "border-linea bg-superficie"
                  }`}
                >
                  <span className="text-[17px] font-extrabold leading-tight">{P.lavori[x.lavoro]}</span>
                  <span className="text-sm text-testo-3">{d.area.modulo.mestieri[x.mestiere]}</span>
                </button>
              </li>
            ))}
          </ul>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-testo-2">{P.tutti}</span>
            <select
              className="mt-1 block min-h-12 w-full rounded-campo border border-linea-2 bg-superficie px-3 text-[16px]"
              value={scelto}
              onChange={(e) => setScelto(e.target.value)}
            >
              {esempi.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.id} · {x.titolo}
                </option>
              ))}
            </select>
          </label>
          {esempio && (
            <figure className="mt-4 rounded-campo border border-linea bg-superficie p-4">
              <figcaption className="text-sm font-semibold text-testo-3">{P.vocale}</figcaption>
              <blockquote className="mt-1 line-clamp-6 text-[16px] leading-relaxed text-testo-2">{esempio.testo}</blockquote>
            </figure>
          )}
          <button type="button" disabled={invio} onClick={() => invia({ esempio: scelto })} className="bottone bottone-azione mt-5 w-full text-[17px] disabled:opacity-60 sm:w-auto">
            {invio ? P.preparo : P.prepara}
          </button>
        </section>
      ) : (
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            invia({ testo, codice });
          }}
        >
          <label className="block">
            <span className="text-[17px] font-semibold">{P.racconta}</span>
            <textarea
              required
              minLength={30}
              maxLength={6000}
              rows={9}
              value={testo}
              onChange={(e) => setTesto(e.target.value)}
              placeholder={P.segnaposto}
              className="mt-2 block w-full rounded-campo border border-linea-2 bg-superficie px-3 py-3 text-[17px] leading-relaxed"
            />
          </label>
          <Dettatura onTesto={(pezzo) => setTesto((t) => (t ? `${t.trimEnd()} ${pezzo}` : pezzo))} />
          {chiediCodice && (
            <label className="block">
              <span className="text-[17px] font-semibold">{P.codice}</span>
              <span className="block text-sm text-testo-3">{P.codiceNota}</span>
              <input
                required
                autoComplete="off"
                value={codice}
                onChange={(e) => setCodice(e.target.value)}
                className="mt-2 block min-h-12 w-full rounded-campo border border-linea-2 bg-superficie px-3 text-[17px] sm:w-64"
              />
            </label>
          )}
          <button type="submit" disabled={invio} className="bottone bottone-azione w-full text-[17px] disabled:opacity-60 sm:w-auto">
            {invio ? P.attesa : P.prepara}
          </button>
          {invio && (
            <ol aria-live="polite" className="space-y-1.5 rounded-campo bg-ardesia p-4 text-[16px] text-scuro-testo">
              {FASI.slice(0, fase + 1).map((f, i) => (
                <li key={f} className={i === fase ? "font-semibold text-fondo" : ""}>
                  <span aria-hidden="true" className={i === fase ? "text-lime" : "text-scuro-nota"}>
                    {i === fase ? "● " : "✓ "}
                  </span>
                  {f}
                </li>
              ))}
            </ol>
          )}
        </form>
      )}

      {errore && (
        <p role="alert" className="mt-4 rounded-campo border-l-4 border-errore bg-superficie px-4 py-3 font-semibold text-errore">
          {errore}
        </p>
      )}
    </div>
  );
}
