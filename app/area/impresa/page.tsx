import type { Metadata } from "next";
import CaricaLogo from "@/components/area/CaricaLogo";
import ModuloImpresa from "@/components/area/ModuloImpresa";
import { TestataArea } from "@/components/area/TestataArea";
import { richiediImpresa } from "@/lib/impresa/pagine";

export const metadata: Metadata = { title: "Dati dell'impresa · PreventivoLampo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PaginaImpresa() {
  const a = await richiediImpresa();
  const i = a.impresa;
  return (
    <>
      <TestataArea impresa={i.ragione_sociale} attiva="impresa" daPrezzare={a.daPrezzare} />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
        <h1 className="text-[34px] font-black leading-[1.02] [font-stretch:78%] sm:text-[44px]">Dati dell&apos;impresa</h1>
        <p className="mt-2 text-[17px] text-testo-2">Quello che il cliente legge in testa e in fondo al preventivo.</p>
        <CaricaLogo presente={Boolean(i.logo_path)} />
        <ModuloImpresa
          modo="modifica"
          iniziali={{
            ragione_sociale: i.ragione_sociale,
            piva: i.piva,
            cf: i.cf ?? "",
            indirizzo: i.indirizzo,
            telefono: i.telefono,
            email: i.email,
            iban: i.iban ?? "",
            condizioni_pagamento: i.condizioni_pagamento ?? "",
            validita_giorni: String(i.validita_giorni),
            mestieri: i.mestieri,
          }}
        />
        <p className="mt-10 text-[14px] text-testo-3">Accesso con {a.sessione.email}.</p>
      </main>
    </>
  );
}
