import type { Metadata } from "next";
import Listino from "@/components/area/Listino";
import ListinoVuoto from "@/components/area/ListinoVuoto";
import { TestataArea } from "@/components/area/TestataArea";
import { richiediImpresa } from "@/lib/impresa/pagine";
import { elencoVoci, vociDemo } from "@/lib/impresa/voci";

export const metadata: Metadata = { title: "Listino · PreventivoLampo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PaginaListino({ searchParams }: { searchParams: Promise<{ nuovo?: string; aggiungi?: string; importate?: string }> }) {
  const a = await richiediImpresa();
  const q = await searchParams;
  const voci = await elencoVoci(a.impresaId);
  const esempio = voci.filter((v) => v.origine === "demo").length;
  return (
    <>
      <TestataArea impresa={a.impresa.ragione_sociale} attiva="listino" daPrezzare={a.daPrezzare} />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
        {q.nuovo && voci.length === 0 && <p className="text-[15px] font-semibold text-testo-3">Passo 2 di 2</p>}
        <h1 className="text-[34px] font-black leading-[1.02] [font-stretch:78%] sm:text-[44px]">{voci.length ? "Il tuo listino" : "Il tuo listino è vuoto"}</h1>
        <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-testo-2">
          {voci.length
            ? "I prezzi dei preventivi vengono solo da qui. Quello che non c'è resta da prezzare: lo decidi tu."
            : "I prezzi dei preventivi vengono solo dal tuo listino, mai inventati. Scegli come riempirlo."}
        </p>
        {q.importate && /^\d+$/.test(q.importate) && (
          <p role="status" className="mt-4 rounded-card bg-lime px-4 py-3 text-[16px] font-semibold text-inchiostro">
            {q.importate} voci importate. Controlla i prezzi e aggiungi come le chiami a voce: aiuta il riconoscimento.
          </p>
        )}
        {esempio > 0 && (
          <p className="mt-4 rounded-card border-2 border-ambra-bordo bg-ambra px-4 py-3 text-[16px] text-ambra-testo">
            {esempio} voci hanno ancora il prezzo d&apos;esempio. Controllale prima di mandare preventivi veri.
          </p>
        )}
        {voci.length || q.aggiungi ? <Listino voci={voci} apriNuova={Boolean(q.aggiungi)} /> : <ListinoVuoto vociEsempio={vociDemo().length} />}
      </main>
    </>
  );
}
