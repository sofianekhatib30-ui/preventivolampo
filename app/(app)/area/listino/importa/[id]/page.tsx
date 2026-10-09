import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import RevisioneImport from "@/components/area/RevisioneImport";
import { TestataArea } from "@/components/area/TestataArea";
import { anteprima, leggiImport } from "@/lib/impresa/importa";
import { dizionario } from "@/lib/i18n/server";
import { richiediImpresa } from "@/lib/impresa/pagine";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await dizionario();
  return { title: `${d.area.titoli.revisioneImport} · PreventivoLampo`, robots: { index: false, follow: false } };
}
export const dynamic = "force-dynamic";

export default async function RevisioneImportPagina({ params }: { params: Promise<{ id: string }> }) {
  const a = await richiediImpresa();
  const imp = await leggiImport(a.impresaId, (await params).id);
  if (!imp) notFound();
  if (imp.stato !== "da_rivedere") redirect("/area/listino");
  const { colonne, esempi } = anteprima(imp);
  const { d } = await dizionario();
  const R = d.area.revisioneImport;
  return (
    <>
      <TestataArea impresa={a.impresa.ragione_sociale} attiva="listino" daPrezzare={a.daPrezzare} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <Link href="/area/listino/importa" className="text-[15px] font-semibold text-cielo-scuro">
          {R.altroFile}
        </Link>
        <h1 className="mt-2 text-[34px] font-black leading-[1.02] [font-stretch:78%] sm:text-[44px]">{R.h1}</h1>
        <p className="mt-2 text-[17px] leading-relaxed text-testo-2">
          {R.sotto}
        </p>
        <RevisioneImport
          id={imp.id}
          nomeFile={imp.nome_file ?? R.ilFile}
          metodo={imp.mappatura.metodo}
          mappa={imp.mappatura.mappa}
          colonne={colonne}
          esempi={esempi}
          righe={imp.righe}
        />
      </main>
    </>
  );
}
