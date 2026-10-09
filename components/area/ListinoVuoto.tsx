"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLingua } from "@/lib/i18n/client";
import { fmt } from "@/lib/i18n/testo";

// Listino vuoto: tre modi di partire. Il più veloce è il file che l'impresa ha già.
export default function ListinoVuoto({ vociEsempio }: { vociEsempio: number }) {
  const router = useRouter();
  const L = useLingua().d.area.listinoVuoto;
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState("");

  async function esempio() {
    setInvio(true);
    setErrore("");
    const res = await fetch("/api/area/listino/esempio", { method: "POST" });
    setInvio(false);
    if (!res.ok) return setErrore((await res.json().catch(() => ({}))).errore ?? L.errore);
    router.refresh();
  }

  const scheda = "flex flex-col rounded-card bg-superficie p-5 ring-1 ring-linea";
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      <div className={`${scheda} ring-2 ring-ardesia`}>
        <h2 className="text-xl font-extrabold">{L.haiListino}</h2>
        <p className="mt-1 flex-1 text-[16px] text-testo-2">{L.haiListinoTesto}</p>
        <Link href="/area/listino/importa" className="bottone bottone-azione mt-4 min-h-12 text-[16px]">
          {L.importa}
        </Link>
      </div>
      <div className={scheda}>
        <h2 className="text-xl font-extrabold">{L.esempio}</h2>
        <p className="mt-1 flex-1 text-[16px] text-testo-2">
          {fmt(L.esempioTesto, { n: vociEsempio })}
        </p>
        <button type="button" onClick={esempio} disabled={invio} className="bottone mt-4 min-h-12 border-2 border-ardesia text-[16px] disabled:opacity-50">
          {invio ? L.copio : L.usaEsempio}
        </button>
      </div>
      <div className={scheda}>
        <h2 className="text-xl font-extrabold">{L.unaAllaVolta}</h2>
        <p className="mt-1 flex-1 text-[16px] text-testo-2">{L.unaAllaVoltaTesto}</p>
        <Link href="/area/listino?aggiungi=1" className="bottone mt-4 min-h-12 border-2 border-ardesia text-[16px]">
          {L.aMano}
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
