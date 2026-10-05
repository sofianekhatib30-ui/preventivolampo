"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Accetta({ token }: { token: string }) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [errore, setErrore] = useState("");
  const [invio, setInvio] = useState(false);

  async function rispondi(esito: "accettato" | "rifiutato") {
    setInvio(true);
    setErrore("");
    const res = await fetch(`/api/accetta/${token}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nome, esito }),
    });
    if (res.ok) router.refresh();
    else setErrore((await res.json()).errore ?? "Errore");
    setInvio(false);
  }

  return (
    <section className="mt-8 rounded-card bg-superficie p-5">
      <label className="block text-sm font-semibold">
        Nome e cognome
        <input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" className="mt-1 block w-full rounded-campo border border-linea-2 px-3 py-3" />
      </label>
      <p className="mt-2 text-sm text-testo-3">
        Accettando confermi il preventivo con il tuo nome e la data di oggi. Non è una firma elettronica qualificata. Se sei un
        consumatore hai 14 giorni per recedere.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button type="button" disabled={invio || nome.trim().length < 3} onClick={() => rispondi("accettato")} className="rounded-campo bg-inchiostro px-5 py-3 font-bold text-fondo disabled:opacity-50">
          Accetto il preventivo
        </button>
        <button type="button" disabled={invio || nome.trim().length < 3} onClick={() => rispondi("rifiutato")} className="rounded-campo border-2 border-inchiostro px-5 py-3 font-bold disabled:opacity-50">
          Non lo accetto
        </button>
      </div>
      {errore && (
        <p role="alert" className="mt-3 font-semibold">
          {errore}
        </p>
      )}
    </section>
  );
}
