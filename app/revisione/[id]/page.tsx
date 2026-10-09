import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Approvato from "@/components/preventivo/Approvato";
import Revisione from "@/components/preventivo/Revisione";
import { SceltaLingua } from "@/components/SceltaLingua";
import { TestataApp } from "@/components/TestataApp";
import { dizionario } from "@/lib/i18n/server";
import { leggi } from "@/lib/preventivi/archivio";
import { listino } from "@/lib/preventivi/servizio";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await dizionario();
  return { title: `${d.area.titoli.revisione} · PreventivoLampo`, robots: { index: false, follow: false } };
}
export const dynamic = "force-dynamic";

// Il link di revisione è l'id del preventivo: 128 bit casuali, non indovinabile.
export default async function PaginaRevisione({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await leggi(id);
  if (!p) notFound();
  const { d } = await dizionario();
  const voci = listino().items.map((i) => ({ code: i.code, name: i.name, unit: i.unit, priceCents: i.priceCents, significantGood: i.significantGood }));
  return (
    <>
      <TestataApp etichettaLogo={d.comune.logoHome}>
        <SceltaLingua compatto />
        <a href="/prova" className="text-sm font-semibold text-scuro-testo">
          {d.area.prova.nuovaProva}
        </a>
      </TestataApp>
      <main className="mx-auto max-w-3xl px-4 pt-6 pb-8 sm:pt-10">
        {p.stato === "bozza" ? <Revisione iniziale={p} voci={voci} /> : <Approvato p={p} />}
      </main>
    </>
  );
}
