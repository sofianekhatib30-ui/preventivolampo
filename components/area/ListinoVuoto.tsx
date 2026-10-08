"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Listino vuoto: tre modi di partire. Il più veloce è il file che l'impresa ha già.
export default function ListinoVuoto({ vociEsempio }: { vociEsempio: number }) {
  const router = useRouter();
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState("");

  async function esempio() {
    setInvio(true);
    setErrore("");
    const res = await fetch("/api/area/listino/esempio", { method: "POST" });
    setInvio(false);
    if (!res.ok) return setErrore((await res.json().catch(() => ({}))).errore ?? "Non sono riuscito a copiare il listino.");
    router.refresh();
  }

  const scheda = "flex flex-col rounded-card bg-superficie p-5 ring-1 ring-linea";
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      <div className={`${scheda} ring-2 ring-ardesia`}>
        <h2 className="text-xl font-extrabold">Hai già un listino?</h2>
        <p className="mt-1 flex-1 text-[16px] text-testo-2">Carica il file Excel o CSV: riconosciamo le colonne e tu controlli riga per riga.</p>
        <Link href="/area/listino/importa" className="bottone bottone-azione mt-4 min-h-12 text-[16px]">
          Importa il file
        </Link>
      </div>
      <div className={scheda}>
        <h2 className="text-xl font-extrabold">Parti da un esempio</h2>
        <p className="mt-1 flex-1 text-[16px] text-testo-2">
          Le {vociEsempio} voci della demo (bagni, cucine, pitture, impianti) con prezzi da prezzari pubblici. Poi metti i tuoi.
        </p>
        <button type="button" onClick={esempio} disabled={invio} className="bottone mt-4 min-h-12 border-2 border-ardesia text-[16px] disabled:opacity-50">
          {invio ? "Copio…" : "Usa l'esempio"}
        </button>
      </div>
      <div className={scheda}>
        <h2 className="text-xl font-extrabold">Una voce alla volta</h2>
        <p className="mt-1 flex-1 text-[16px] text-testo-2">Scrivi tu le lavorazioni che fai più spesso, con il tuo prezzo.</p>
        <Link href="/area/listino?aggiungi=1" className="bottone mt-4 min-h-12 border-2 border-ardesia text-[16px]">
          Aggiungi a mano
        </Link>
      </div>
      {errore && (
        <p role="alert" className="text-[15px] font-semibold text-errore sm:col-span-3">
          {errore}
        </p>
      )}
    </div>
  );
}
