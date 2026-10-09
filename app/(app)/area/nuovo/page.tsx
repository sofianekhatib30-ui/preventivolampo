import type { Metadata } from "next";
import Link from "next/link";
import NuovoPreventivo from "@/components/area/NuovoPreventivo";
import { TestataArea } from "@/components/area/TestataArea";
import { dizionario } from "@/lib/i18n/server";
import { fmt } from "@/lib/i18n/testo";
import { richiediImpresa } from "@/lib/impresa/pagine";
import { elencoVoci } from "@/lib/impresa/voci";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await dizionario();
  return { title: `${d.area.titoli.nuovo} · PreventivoLampo`, robots: { index: false, follow: false } };
}
export const dynamic = "force-dynamic";

export default async function Nuovo() {
  const a = await richiediImpresa();
  const voci = (await elencoVoci(a.impresaId)).length;
  const { d } = await dizionario();
  const N = d.area.nuovo;
  return (
    <>
      <TestataArea impresa={a.impresa.ragione_sociale} attiva="preventivi" daPrezzare={a.daPrezzare} />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
        <Link href="/area" className="text-[15px] font-semibold text-cielo-scuro">
          {N.torna}
        </Link>
        <h1 className="mt-2 text-[34px] font-black leading-[1.02] [font-stretch:78%] sm:text-[44px]">{N.h1}</h1>
        {voci === 0 ? (
          <div className="mt-6 rounded-card border-2 border-ambra-bordo bg-ambra p-5 text-ambra-testo">
            <p className="text-[17px] font-semibold">{N.serveListino}</p>
            <Link href="/area/listino" className="bottone bottone-azione mt-4 min-h-12 text-[16px]">
              {N.preparaListino}
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-[17px] leading-relaxed text-testo-2">
              {fmt(N.sotto, { n: voci })}
            </p>
            <NuovoPreventivo />
            <p className="mt-8 text-sm leading-relaxed text-testo-3">{N.claude}</p>
          </>
        )}
      </main>
    </>
  );
}
