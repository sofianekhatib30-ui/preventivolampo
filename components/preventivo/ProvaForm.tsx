"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Esempio = { id: string; titolo: string; testo: string };

// Quattro esempi in evidenza, uno per mestiere; gli altri 26 restano nel menu.
const IN_EVIDENZA: { id: string; mestiere: string; lavoro: string }[] = [
  { id: "01", mestiere: "Muratore", lavoro: "Bagno completo" },
  { id: "02", mestiere: "Imbianchino", lavoro: "Tinteggiatura bilocale" },
  { id: "04", mestiere: "Elettricista", lavoro: "Impianto cucina" },
  { id: "06", mestiere: "Piastrellista", lavoro: "Pavimento soggiorno" },
];

// Cosa sta facendo il motore, in ordine. Sono le fasi vere della pipeline, non numeri inventati.
const FASI = [
  "Leggo il sopralluogo…",
  "Separo lavorazioni, misure ed esclusioni…",
  "Cerco ogni voce nel listino…",
  "Controllo cosa manca e il regime IVA…",
  "Preparo la bozza da controllare…",
];

export default function ProvaForm({ esempi, chiediCodice }: { esempi: Esempio[]; chiediCodice: boolean }) {
  const router = useRouter();
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
  }, [invio, modo]);

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
      if (!res.ok) throw new Error(body.errore ?? "Non sono riuscito a preparare la bozza. Riprova.");
      router.push(body.revisione);
    } catch (err) {
      setErrore(err instanceof Error ? err.message : "Non sono riuscito a preparare la bozza. Riprova.");
      setInvio(false);
    }
  }

  const schede = "flex min-h-12 flex-1 items-center justify-center rounded-full px-4 text-[16px] font-bold";

  return (
    <div className="mt-8">
      <div role="tablist" aria-label="Da dove partire" className="flex gap-1 rounded-full bg-fondo-2 p-1">
        <button type="button" role="tab" aria-selected={modo === "esempio"} onClick={() => setModo("esempio")} className={`${schede} ${modo === "esempio" ? "bg-ardesia text-fondo" : "text-testo-2"}`}>
          Un esempio
        </button>
        <button type="button" role="tab" aria-selected={modo === "testo"} onClick={() => setModo("testo")} className={`${schede} ${modo === "testo" ? "bg-ardesia text-fondo" : "text-testo-2"}`}>
          Il tuo testo
        </button>
      </div>

      {modo === "esempio" ? (
        <section className="mt-6" aria-label="Esempi del banco di prova">
          <p className="text-[17px] text-testo-2">
            Sopralluoghi inventati del banco di prova. La bozza esce subito: è l&apos;uscita registrata del motore su quel caso.
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
                  <span className="text-[17px] font-extrabold leading-tight">{x.lavoro}</span>
                  <span className="text-sm text-testo-3">{x.mestiere}</span>
                </button>
              </li>
            ))}
          </ul>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-testo-2">Oppure scegli fra tutti i 30</span>
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
              <figcaption className="text-sm font-semibold text-testo-3">Il vocale, trascritto</figcaption>
              <blockquote className="mt-1 line-clamp-6 text-[16px] leading-relaxed text-testo-2">{esempio.testo}</blockquote>
            </figure>
          )}
          <button type="button" disabled={invio} onClick={() => invia({ esempio: scelto })} className="bottone bottone-azione mt-5 w-full text-[17px] disabled:opacity-60 sm:w-auto">
            {invio ? "Preparo la bozza…" : "Prepara la bozza"}
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
            <span className="text-[17px] font-semibold">Racconta il lavoro come lo diresti nel vocale</span>
            <textarea
              required
              minLength={30}
              maxLength={6000}
              rows={9}
              value={testo}
              onChange={(e) => setTesto(e.target.value)}
              placeholder="Bagno della signora Rossi, via Roma 3 a Monza. È casa sua. Togliamo vasca e piastrelle, alte due metri. Il bagno è due per uno e ottanta, piatto doccia 80x80, i sanitari li compro io…"
              className="mt-2 block w-full rounded-campo border border-linea-2 bg-superficie px-3 py-3 text-[17px] leading-relaxed"
            />
          </label>
          {chiediCodice && (
            <label className="block">
              <span className="text-[17px] font-semibold">Codice d&apos;accesso</span>
              <span className="block text-sm text-testo-3">Il tuo testo passa dall&apos;API di Claude e ogni prova ha un costo: il codice ferma i bot.</span>
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
            {invio ? "Ci vogliono circa 20 secondi…" : "Prepara la bozza"}
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
