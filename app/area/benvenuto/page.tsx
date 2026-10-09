import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TestataArea } from "@/components/area/TestataArea";
import ModuloImpresa from "@/components/area/ModuloImpresa";
import { dizionario } from "@/lib/i18n/server";
import { richiediSessione } from "@/lib/impresa/pagine";
import { membro } from "@/lib/impresa/sessione";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await dizionario();
  return { title: `${d.area.titoli.benvenuto} · PreventivoLampo`, robots: { index: false, follow: false } };
}
export const dynamic = "force-dynamic";

// Primo accesso: i dati dell'impresa, poi il listino.
export default async function Benvenuto() {
  const s = await richiediSessione();
  if (await membro()) redirect("/area");
  const { d } = await dizionario();
  const B = d.area.benvenuto;
  return (
    <>
      <TestataArea />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <p className="text-[15px] font-semibold text-testo-3">{B.passo}</p>
        <h1 className="mt-1 text-[38px] font-black leading-[1] [font-stretch:76%] sm:text-[50px]">{B.h1}</h1>
        <p className="mt-3 text-[18px] leading-relaxed text-testo-2">{B.sotto}</p>
        <ModuloImpresa
          modo="nuova"
          iniziali={{ ragione_sociale: "", piva: "", cf: "", indirizzo: "", telefono: "", email: s.email, iban: "", condizioni_pagamento: "", validita_giorni: "30", mestieri: [] }}
        />
      </main>
    </>
  );
}
