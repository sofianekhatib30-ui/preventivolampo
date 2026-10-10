"use client";

import Link from "next/link";
import { useState } from "react";
import { useLingua } from "@/lib/i18n/client";

// Listino vuoto: due modi di partire, il file che l'impresa ha già o una voce alla volta.
// Nessun listino messo da noi: i prezzi li carica sempre l'impresa (Sofiane, 10/10/2026).
export default function ListinoVuoto() {
  const L = useLingua().d.area.listinoVuoto;
  const [errore] = useState("");

  const scheda = "flex flex-col rounded-card bg-superficie p-5 ring-1 ring-linea";
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <div className={`${scheda} ring-2 ring-ardesia`}>
        <h2 className="text-xl font-extrabold">{L.haiListino}</h2>
        <p className="mt-1 flex-1 text-[16px] text-testo-2">{L.haiListinoTesto}</p>
        <Link href="/area/listino/importa" className="bottone bottone-azione mt-4 min-h-12 text-[16px]">
          {L.importa}
        </Link>
      </div>
      <div className={scheda}>
        <h2 className="text-xl font-extrabold">{L.unaAllaVolta}</h2>
        <p className="mt-1 flex-1 text-[16px] text-testo-2">{L.unaAllaVoltaTesto}</p>
        <Link href="/area/listino?aggiungi=1" className="bottone mt-4 min-h-12 border-2 border-ardesia text-[16px]">
          {L.aMano}
        </Link>
      </div>
      {errore && (
        <p role="alert" className="text-[15px] font-semibold text-errore sm:col-span-2">
          {errore}
        </p>
      )}
    </div>
  );
}
