"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Testi } from "@/lib/preventivi/lingua";

const ITALIANO: Testi["accetta"] = {
  titolo: "La tua risposta",
  nome: "Nome e cognome",
  letto: "Ho letto il preventivo e lo accetto alle condizioni indicate.",
  accetto: "Accetto il preventivo",
  invio: "Registro la risposta…",
  nonAccetto: "Non lo accetto",
  nota: "Accettando confermi il preventivo con il tuo nome, la data e l'ora di oggi. Non è una firma elettronica qualificata. Se sei un consumatore hai 14 giorni per recedere.",
  errore: "Non sono riuscito a registrare la risposta. Riprova.",
};

// La risposta del cliente: nome, spunta di presa visione, un pulsante. Nessuna registrazione.
// Cliente straniero: i testi nella sua lingua, con la clausola «prevale il testo italiano» nella spunta.
export default function Accetta({ token, testi }: { token: string; testi?: Testi["accetta"] }) {
  const t = testi ?? ITALIANO;
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
    else {
      const msg = (await res.json().catch(() => ({}))).errore as string | undefined;
      setErrore(testi ? t.errore : (msg ?? t.errore));
    }
    setInvio(false);
  }

  const nomeOk = nome.trim().length >= 3;

  return (
    <section id="accetta" className="mt-8 rounded-card bg-superficie p-5 ring-1 ring-linea sm:p-6">
      <h2 className="text-xl font-extrabold">{t.titolo}</h2>
      <label className="mt-3 block text-[15px] font-semibold text-testo-2">
        {t.nome}
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          autoComplete="name"
          className="mt-1 block min-h-12 w-full rounded-campo border border-linea-2 px-3 text-[17px]"
        />
      </label>
      <label className="mt-4 flex cursor-pointer items-start gap-3 text-[16px]">
        <input type="checkbox" className="mt-0.5 size-6 shrink-0 accent-[#343645]" checked={letto} onChange={(e) => setLetto(e.target.checked)} />
        {t.letto}
      </label>
      <button
        type="button"
        disabled={invio || !nomeOk || !letto}
        onClick={() => rispondi("accettato")}
        className="bottone bottone-azione mt-5 min-h-14 w-full text-[17px] disabled:opacity-50"
      >
        {invio ? t.invio : t.accetto}
      </button>
      <button
        type="button"
        disabled={invio || !nomeOk}
        onClick={() => rispondi("rifiutato")}
        className="bottone mt-2 min-h-12 w-full text-[16px] font-semibold text-testo-2 underline disabled:opacity-50"
      >
        {t.nonAccetto}
      </button>
      <p className="mt-4 text-sm leading-relaxed text-testo-3">
        {t.nota}
      </p>
      {errore && (
        <p role="alert" className="mt-3 rounded-campo border-l-4 border-errore px-4 py-3 font-semibold text-errore">
          {errore}
        </p>
      )}
    </section>
  );
}
