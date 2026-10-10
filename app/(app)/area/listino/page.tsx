import type { Metadata } from "next";
import Listino from "@/components/area/Listino";
import ListinoVuoto from "@/components/area/ListinoVuoto";
import { TestataArea } from "@/components/area/TestataArea";
import { dizionario } from "@/lib/i18n/server";
import { fmt } from "@/lib/i18n/testo";
import { richiediImpresa } from "@/lib/impresa/pagine";
import { elencoVoci } from "@/lib/impresa/voci";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await dizionario();
  return { title: `${d.area.titoli.listino} · Preventivi`, robots: { index: false, follow: false } };
}
export const dynamic = "force-dynamic";

export default async function PaginaListino({ searchParams }: { searchParams: Promise<{ nuovo?: string; aggiungi?: string; importate?: string }> }) {
  const a = await richiediImpresa();
  const q = await searchParams;
  const voci = await elencoVoci(a.impresaId);
  const esempio = voci.filter((v) => v.origine === "demo").length;
  const { d } = await dizionario();
  const L = d.area.listino;
  return (
    <>
      <TestataArea impresa={a.impresa.ragione_sociale} attiva="listino" daPrezzare={a.daPrezzare} />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
        {q.nuovo && voci.length === 0 && <p className="text-[15px] font-semibold text-testo-3">{L.passo}</p>}
        <h1 className="text-[34px] font-black leading-[1.02] [font-stretch:78%] sm:text-[44px]">{voci.length ? L.h1 : L.h1Vuoto}</h1>
        <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-testo-2">
          {voci.length ? L.sotto : L.sottoVuoto}
        </p>
        {q.importate && /^\d+$/.test(q.importate) && (
          <p role="status" className="mt-4 rounded-card bg-lime px-4 py-3 text-[16px] font-semibold text-inchiostro">
            {fmt(L.importate, { n: q.importate })}
          </p>
        )}
        {esempio > 0 && (
          <p className="mt-4 rounded-card border-2 border-ambra-bordo bg-ambra px-4 py-3 text-[16px] text-ambra-testo">
            {fmt(L.esempio, { n: esempio })}
          </p>
        )}
        {voci.length || q.aggiungi ? <Listino voci={voci} apriNuova={Boolean(q.aggiungi)} /> : <ListinoVuoto />}
      </main>
    </>
  );
}
