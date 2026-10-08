"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// La risposta del cliente: nome, spunta di presa visione, un pulsante. Nessuna registrazione.
export default function Accetta({ token }: { token: string }) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [letto, setLetto] = useState(false);
  const [errore, setErrore] = useState("");
  const [invio, setInvio] = useState(false);

  // «Visto»: lo segna il browser dopo il caricamento, non l'anteprima del link su WhatsApp.
  // Una volta sola per caricamento (in sviluppo React esegue gli effetti due volte).
  const segnato = useRef(false);
  useEffect(() => {
    if (segnato.current) return;
    segnato.current = true;
    fetch(`/api/accetta/${token}/visto`, { method: "POST" }).catch(() => {});
  }, [token]);

  async function rispondi(esito: "accettato" | "rifiutato") {
    setInvio(true);
    setErrore("");
    const res = await fetch(`/api/accetta/${token}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nome, esito }),
    });
    if (res.ok) router.refresh();
    else setErrore((await res.json()).errore ?? "Non sono riuscito a registrare la risposta. Riprova.");
    setInvio(false);
  }

  const nomeOk = nome.trim().length >= 3;

  return (
    <section id="accetta" className="mt-8 rounded-card bg-superficie p-5 ring-1 ring-linea sm:p-6">
      <h2 className="text-xl font-extrabold">La tua risposta</h2>
      <label className="mt-3 block text-[15px] font-semibold text-testo-2">
        Nome e cognome
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          autoComplete="name"
          className="mt-1 block min-h-12 w-full rounded-campo border border-linea-2 px-3 text-[17px]"
        />
      </label>
      <label className="mt-4 flex cursor-pointer items-start gap-3 text-[16px]">
        <input type="checkbox" className="mt-0.5 size-6 shrink-0 accent-[#343645]" checked={letto} onChange={(e) => setLetto(e.target.checked)} />
        Ho letto il preventivo e lo accetto alle condizioni indicate.
      </label>
      <button
        type="button"
        disabled={invio || !nomeOk || !letto}
        onClick={() => rispondi("accettato")}
        className="bottone bottone-azione mt-5 min-h-14 w-full text-[17px] disabled:opacity-50"
      >
        {invio ? "Registro la risposta…" : "Accetto il preventivo"}
      </button>
      <button
        type="button"
        disabled={invio || !nomeOk}
        onClick={() => rispondi("rifiutato")}
        className="bottone mt-2 min-h-12 w-full text-[16px] font-semibold text-testo-2 underline disabled:opacity-50"
      >
        Non lo accetto
      </button>
      <p className="mt-4 text-sm leading-relaxed text-testo-3">
        Accettando confermi il preventivo con il tuo nome, la data e l&apos;ora di oggi. Non è una firma elettronica qualificata.
        Se sei un consumatore hai 14 giorni per recedere.
      </p>
      {errore && (
        <p role="alert" className="mt-3 rounded-campo border-l-4 border-errore px-4 py-3 font-semibold text-errore">
          {errore}
        </p>
      )}
    </section>
  );
}
