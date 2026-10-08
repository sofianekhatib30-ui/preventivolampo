import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TestataArea } from "@/components/area/TestataArea";
import ModuloImpresa from "@/components/area/ModuloImpresa";
import { richiediSessione } from "@/lib/impresa/pagine";
import { membro } from "@/lib/impresa/sessione";

export const metadata: Metadata = { title: "La tua impresa — PreventivoLampo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Primo accesso: i dati dell'impresa, poi il listino.
export default async function Benvenuto() {
  const s = await richiediSessione();
  if (await membro()) redirect("/area");
  return (
    <>
      <TestataArea />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <p className="text-[15px] font-semibold text-testo-3">Passo 1 di 2</p>
        <h1 className="mt-1 text-[38px] font-black leading-[1] [font-stretch:76%] sm:text-[50px]">La tua impresa</h1>
        <p className="mt-3 text-[18px] leading-relaxed text-testo-2">Questi dati vanno in testa a ogni preventivo. Li puoi cambiare quando vuoi.</p>
        <ModuloImpresa
          modo="nuova"
          iniziali={{ ragione_sociale: "", piva: "", cf: "", indirizzo: "", telefono: "", email: s.email, iban: "", condizioni_pagamento: "", validita_giorni: "30", mestieri: [] }}
        />
      </main>
    </>
  );
}
