import type { Metadata } from "next";
import Link from "next/link";
import CaricaListino from "@/components/area/CaricaListino";
import { TestataArea } from "@/components/area/TestataArea";
import { richiediImpresa } from "@/lib/impresa/pagine";

export const metadata: Metadata = { title: "Importa il listino — PreventivoLampo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Importa() {
  const a = await richiediImpresa();
  return (
    <>
      <TestataArea impresa={a.impresa.ragione_sociale} attiva="listino" daPrezzare={a.daPrezzare} />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
        <Link href="/area/listino" className="text-[15px] font-semibold text-cielo-scuro">
          Torna al listino
        </Link>
        <h1 className="mt-2 text-[34px] font-black leading-[1.02] [font-stretch:78%] sm:text-[44px]">Importa il tuo listino</h1>
        <p className="mt-2 text-[17px] leading-relaxed text-testo-2">
          Va bene il file che usi già: una riga per lavorazione, con descrizione, unità di misura e prezzo. Nulla entra nel listino prima che tu
          abbia controllato.
        </p>
        <CaricaListino />
        <h2 className="mt-10 text-xl font-extrabold">Cosa leggiamo</h2>
        <ul className="mt-3 space-y-2 text-[16px] text-testo-2">
          <li>Le colonne si riconoscono dai titoli (Descrizione, U.M., Prezzo…). Se il file non ha titoli chiari, le legge l&apos;intelligenza artificiale e tu puoi correggerle.</li>
          <li>Unità scritte in tanti modi (mq, ml, nr, pz, a corpo) diventano quelle del preventivo.</li>
          <li>I codici che mancano o si ripetono li assegniamo noi; le righe di titolo senza prezzo si saltano.</li>
          <li>I codici già nel tuo listino non vengono sovrascritti.</li>
        </ul>
      </main>
    </>
  );
}
