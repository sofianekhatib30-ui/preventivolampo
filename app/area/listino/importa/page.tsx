import type { Metadata } from "next";
import Link from "next/link";
import CaricaListino from "@/components/area/CaricaListino";
import { TestataArea } from "@/components/area/TestataArea";
import { dizionario } from "@/lib/i18n/server";
import { richiediImpresa } from "@/lib/impresa/pagine";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await dizionario();
  return { title: `${d.area.titoli.importa} · PreventivoLampo`, robots: { index: false, follow: false } };
}
export const dynamic = "force-dynamic";

export default async function Importa() {
  const a = await richiediImpresa();
  const { d } = await dizionario();
  const I = d.area.importa;
  return (
    <>
      <TestataArea impresa={a.impresa.ragione_sociale} attiva="listino" daPrezzare={a.daPrezzare} />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
        <Link href="/area/listino" className="text-[15px] font-semibold text-cielo-scuro">
          {I.torna}
        </Link>
        <h1 className="mt-2 text-[34px] font-black leading-[1.02] [font-stretch:78%] sm:text-[44px]">{I.h1}</h1>
        <p className="mt-2 text-[17px] leading-relaxed text-testo-2">{I.sotto}</p>
        <CaricaListino />
        <h2 className="mt-10 text-xl font-extrabold">{I.cosaLeggiamo}</h2>
        <ul className="mt-3 space-y-2 text-[16px] text-testo-2">
          {I.punti.map((punto) => (
            <li key={punto}>{punto}</li>
          ))}
        </ul>
      </main>
    </>
  );
}
