import type { Metadata } from "next";
import Link from "next/link";
import NuovoPreventivo from "@/components/area/NuovoPreventivo";
import { TestataArea } from "@/components/area/TestataArea";
import { richiediImpresa } from "@/lib/impresa/pagine";
import { elencoVoci } from "@/lib/impresa/voci";

export const metadata: Metadata = { title: "Nuovo preventivo — PreventivoLampo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Nuovo() {
  const a = await richiediImpresa();
  const voci = (await elencoVoci(a.impresaId)).length;
  return (
    <>
      <TestataArea impresa={a.impresa.ragione_sociale} attiva="preventivi" daPrezzare={a.daPrezzare} />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
        <Link href="/area" className="text-[15px] font-semibold text-cielo-scuro">
          Torna ai preventivi
        </Link>
        <h1 className="mt-2 text-[34px] font-black leading-[1.02] [font-stretch:78%] sm:text-[44px]">Nuovo preventivo</h1>
        {voci === 0 ? (
          <div className="mt-6 rounded-card border-2 border-ambra-bordo bg-ambra p-5 text-ambra-testo">
            <p className="text-[17px] font-semibold">Prima serve il listino: i prezzi vengono solo da lì.</p>
            <Link href="/area/listino" className="bottone bottone-azione mt-4 min-h-12 text-[16px]">
              Prepara il listino
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-[17px] leading-relaxed text-testo-2">
              Scrivi o detta il sopralluogo. La bozza usa le {voci} voci del tuo listino; quello che non trova resta da prezzare.
            </p>
            <NuovoPreventivo />
            <p className="mt-8 text-sm leading-relaxed text-testo-3">Il testo viene elaborato con Claude di Anthropic e salvato con il preventivo.</p>
          </>
        )}
      </main>
    </>
  );
}
