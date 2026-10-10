import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TestataArea } from "@/components/area/TestataArea";
import ModuloImpresa from "@/components/area/ModuloImpresa";
import { dizionario } from "@/lib/i18n/server";
import { fmt } from "@/lib/i18n/testo";
import { richiediContesto } from "@/lib/impresa/pagine";
import { ACCOUNT, membroDa } from "@/lib/impresa/sessione";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await dizionario();
  return { title: `${d.area.titoli.benvenuto} · Preventivi`, robots: { index: false, follow: false } };
}
export const dynamic = "force-dynamic";

// Primo accesso dell'organizzazione: i dati dell'impresa, poi il listino.
// Senza il modulo attivo, o senza i permessi per registrare l'impresa, si spiega cosa manca.
export default async function Benvenuto() {
  const c = await richiediContesto("/area/benvenuto");
  if (membroDa(c)) redirect("/area");
  const { d } = await dizionario();
  const B = d.area.benvenuto;
  const org = c.orgNome ?? "questa organizzazione";
  const puoRegistrare = c.lettura && c.scrittura && (c.ruoloOrg === "titolare" || c.ruoloOrg === "admin");

  if (!c.orgId || !c.lettura || !puoRegistrare) {
    const nonAttivo = !c.orgId || !c.lettura || !c.scrittura;
    return (
      <>
        <TestataArea />
        <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
          <h1 className="text-[38px] font-black leading-[1] [font-stretch:76%] sm:text-[50px]">{nonAttivo ? B.nonAttivoH1 : B.h1}</h1>
          <p className="mt-3 text-[18px] leading-relaxed text-testo-2">{fmt(nonAttivo ? B.nonAttivo : B.soloTitolare, { org })}</p>
          {nonAttivo && (
            <a href={`${ACCOUNT}/`} className="bottone bottone-azione mt-6 min-h-12 text-[17px]">
              {B.apriAccount}
            </a>
          )}
        </main>
      </>
    );
  }

  return (
    <>
      <TestataArea />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <p className="text-[15px] font-semibold text-testo-3">{B.passo}</p>
        <h1 className="mt-1 text-[38px] font-black leading-[1] [font-stretch:76%] sm:text-[50px]">{B.h1}</h1>
        <p className="mt-3 text-[18px] leading-relaxed text-testo-2">{B.sotto}</p>
        <ModuloImpresa
          modo="nuova"
          iniziali={{
            ragione_sociale: c.orgNome ?? "",
            piva: (c.orgPiva ?? "").replace(/^IT/i, ""),
            cf: "",
            indirizzo: "",
            telefono: "",
            email: c.sessione.email,
            iban: "",
            condizioni_pagamento: "",
            validita_giorni: "30",
            mestieri: [],
            regime_iva: "edile",
          }}
        />
      </main>
    </>
  );
}
