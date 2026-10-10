import type { Metadata } from "next";
import Link from "next/link";
import DaPrezzare from "@/components/area/DaPrezzare";
import { TestataArea } from "@/components/area/TestataArea";
import { proposteAperte } from "@/lib/impresa/da-prezzare";
import { dizionario } from "@/lib/i18n/server";
import { richiediImpresa } from "@/lib/impresa/pagine";
import { elencoVoci } from "@/lib/impresa/voci";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await dizionario();
  return { title: `${d.area.titoli.daPrezzare} · Preventivi`, robots: { index: false, follow: false } };
}
export const dynamic = "force-dynamic";

export default async function PaginaDaPrezzare() {
  const a = await richiediImpresa();
  const [proposte, voci] = await Promise.all([proposteAperte(a.impresaId), elencoVoci(a.impresaId)]);
  const { d } = await dizionario();
  const D = d.area.daPrezzare;
  // Primo codice libero «V-nnnn» da proporre.
  const usati = new Set(voci.map((v) => v.codice));
  let primo = voci.length + 1;
  while (Array.from({ length: proposte.length }, (_, i) => `V-${String(primo + i).padStart(4, "0")}`).some((c) => usati.has(c))) primo++;
  return (
    <>
      <TestataArea impresa={a.impresa.ragione_sociale} attiva="da-prezzare" daPrezzare={a.daPrezzare} />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
        <h1 className="text-[34px] font-black leading-[1.02] [font-stretch:78%] sm:text-[44px]">{D.h1}</h1>
        <p className="mt-2 text-[17px] leading-relaxed text-testo-2">{D.sotto}</p>
        {proposte.length ? (
          <DaPrezzare proposte={proposte} primoCodice={primo} />
        ) : (
          <div className="mt-8 rounded-card border-2 border-dashed border-linea-2 px-6 py-10 text-center">
            <p className="text-[20px] font-extrabold">{D.niente}</p>
            <p className="mt-1 text-[17px] text-testo-2">
              {D.nienteTesto}{" "}
              <Link href="/area" className="font-semibold text-cielo-scuro">
                {D.torna}
              </Link>
            </p>
          </div>
        )}
      </main>
    </>
  );
}
