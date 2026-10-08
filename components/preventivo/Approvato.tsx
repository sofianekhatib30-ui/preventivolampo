"use client";

import { useState, useSyncExternalStore } from "react";
import { conti } from "@/lib/preventivi/calcolo";
import type { Preventivo } from "@/lib/preventivi/modello";
import { euro } from "./formato";

const quando = (iso: string) =>
  new Date(iso).toLocaleString("it-IT", { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

// Dopo l'approvazione: il preventivo è pronto, adesso va mandato. Il primo pulsante è WhatsApp,
// il canale che usano artigiano e cliente. Sotto, la linea del tempo: approvato, visto, risposta.
export default function Approvato({ p, pdf = `/api/preventivi/${p.id}/pdf` }: { p: Preventivo; pdf?: string }) {
  const c = conti(p);
  // L'indirizzo del sito si conosce solo nel browser: sul server il link resta relativo.
  const origine = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );
  const [copiato, setCopiato] = useState(false);

  const linkCliente = p.tokenAccettazione ? `${origine}/accetta/${p.tokenAccettazione}` : "";
  const messaggio = `Buongiorno${p.cliente.name ? ` ${p.cliente.name}` : ""}, le mando il preventivo n. ${p.numero}${
    c ? ` (totale ${euro(c.totalCents)} IVA inclusa)` : ""
  }. Lo può vedere e accettare da qui, senza registrarsi: ${linkCliente}`;

  async function copia() {
    try {
      await navigator.clipboard.writeText(linkCliente);
      setCopiato(true);
      window.setTimeout(() => setCopiato(false), 2500);
    } catch {
      setCopiato(false);
    }
  }

  const risposta = p.accettazione;
  const passi: { fatto: boolean; titolo: string; nota: string }[] = [
    { fatto: true, titolo: "Approvato da te", nota: p.approvatoIl ? quando(p.approvatoIl) : "" },
    { fatto: Boolean(p.vistoIl || risposta), titolo: "Visto dal cliente", nota: p.vistoIl ? quando(p.vistoIl) : "quando apre il link" },
    {
      fatto: Boolean(risposta),
      titolo: risposta ? (risposta.esito === "accettato" ? `Accettato da ${risposta.nome}` : `Rifiutato da ${risposta.nome}`) : "Risposta del cliente",
      nota: risposta ? quando(risposta.il) : "accetta con nome e data",
    },
  ];

  const titolo =
    p.stato === "accettato" ? "Il cliente ha accettato." : p.stato === "rifiutato" ? "Il cliente ha rifiutato." : "Preventivo pronto. Ora mandalo.";

  return (
    <section>
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className={`flex size-14 shrink-0 items-center justify-center rounded-full ${p.stato === "rifiutato" ? "bg-fondo-2 text-testo-2" : "bg-lime text-inchiostro"}`}
        >
          <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {p.stato === "rifiutato" ? <path d="M7 7l10 10M17 7 7 17" /> : <path d="M5 12.5l4.5 4.5L19 7.5" />}
          </svg>
        </span>
        <div>
          <p className="text-sm text-testo-3">
            Preventivo n. <span className="font-mono">{p.numero}</span>
          </p>
          <h1 className="text-[30px] font-black leading-[1.05] [font-stretch:80%] sm:text-[40px]">{titolo}</h1>
        </div>
      </div>

      {c && (
        <p className="mt-6 flex items-baseline justify-between rounded-card bg-superficie px-5 py-4 ring-1 ring-linea">
          <span className="text-[17px] text-testo-2">Totale IVA inclusa</span>
          <span className="font-mono text-[26px] font-semibold">{euro(c.totalCents)}</span>
        </p>
      )}

      {p.stato === "approvato" && p.tokenAccettazione && (
        <div className="mt-5 flex flex-col gap-2.5">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(messaggio)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bottone bottone-azione min-h-14 text-[17px]"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2c.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
            </svg>
            Invia su WhatsApp
          </a>
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" onClick={copia} className="bottone min-h-12 border-2 border-ardesia text-[16px]">
              {copiato ? "Link copiato" : "Copia il link"}
            </button>
            <a href={pdf} className="bottone min-h-12 border-2 border-ardesia text-[16px]">
              Apri il PDF
            </a>
          </div>
          <a href={`/accetta/${p.tokenAccettazione}`} className="mt-1 self-start text-[15px] font-semibold text-cielo-scuro">
            Guarda la pagina che vede il cliente
          </a>
        </div>
      )}
      {p.stato !== "approvato" && (
        <a href={pdf} className="bottone mt-5 min-h-12 border-2 border-ardesia text-[16px]">
          Apri il PDF
        </a>
      )}

      <h2 className="mt-10 text-xl font-extrabold">A che punto è</h2>
      <ol className="mt-4">
        {passi.map((x, i) => (
          <li key={x.titolo} className="relative flex gap-4 pb-6 last:pb-0">
            {i < passi.length - 1 && (
              <span aria-hidden="true" className={`absolute left-[13px] top-8 bottom-0 w-0.5 ${passi[i + 1].fatto ? "bg-lime-scuro" : "bg-linea-2"}`} />
            )}
            <span
              aria-hidden="true"
              className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full ${
                x.fatto ? "bg-lime-scuro text-superficie" : "border-2 border-linea-2 bg-superficie"
              }`}
            >
              {x.fatto && (
                <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                </svg>
              )}
            </span>
            <div>
              <p className={`text-[17px] font-bold ${x.fatto ? "" : "text-testo-3"}`}>
                {x.titolo}
                <span className="sr-only">{x.fatto ? " (fatto)" : " (in attesa)"}</span>
              </p>
              <p className="text-[15px] text-testo-3">{x.nota}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-sm text-testo-3">
        Il cliente apre il link, vede il preventivo e lo accetta con nome e data, senza registrarsi. Ricarica la pagina per vedere
        se l&apos;ha aperto.
      </p>
    </section>
  );
}
