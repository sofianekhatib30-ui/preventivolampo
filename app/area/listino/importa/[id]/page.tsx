import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import RevisioneImport from "@/components/area/RevisioneImport";
import { TestataArea } from "@/components/area/TestataArea";
import { anteprima, leggiImport } from "@/lib/impresa/importa";
import { richiediImpresa } from "@/lib/impresa/pagine";

export const metadata: Metadata = { title: "Controlla l'import — PreventivoLampo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function RevisioneImportPagina({ params }: { params: Promise<{ id: string }> }) {
  const a = await richiediImpresa();
  const imp = await leggiImport(a.impresaId, (await params).id);
  if (!imp) notFound();
  if (imp.stato !== "da_rivedere") redirect("/area/listino");
  const { colonne, esempi } = anteprima(imp);
  return (
    <>
      <TestataArea impresa={a.impresa.ragione_sociale} attiva="listino" daPrezzare={a.daPrezzare} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <Link href="/area/listino/importa" className="text-[15px] font-semibold text-cielo-scuro">
          Carica un altro file
        </Link>
        <h1 className="mt-2 text-[34px] font-black leading-[1.02] [font-stretch:78%] sm:text-[44px]">Controlla prima di importare</h1>
        <p className="mt-2 text-[17px] leading-relaxed text-testo-2">
          Le righe in giallo hanno un dubbio: unità o prezzo che non si leggono. Correggile o togli la spunta.
        </p>
        <RevisioneImport
          id={imp.id}
          nomeFile={imp.nome_file ?? "il file"}
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
