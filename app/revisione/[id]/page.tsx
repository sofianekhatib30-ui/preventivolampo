import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Approvato from "@/components/preventivo/Approvato";
import Revisione from "@/components/preventivo/Revisione";
import { TestataApp } from "@/components/TestataApp";
import { leggi } from "@/lib/preventivi/archivio";
import { listino } from "@/lib/preventivi/servizio";

export const metadata: Metadata = { title: "Revisione del preventivo — PreventivoLampo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Il link di revisione è l'id del preventivo: 128 bit casuali, non indovinabile.
export default async function PaginaRevisione({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await leggi(id);
  if (!p) notFound();
  const voci = listino().items.map((i) => ({ code: i.code, name: i.name, unit: i.unit, priceCents: i.priceCents, significantGood: i.significantGood }));
  return (
    <>
      <TestataApp>
        <a href="/prova" className="text-sm font-semibold text-scuro-testo">
          Nuova prova
        </a>
      </TestataApp>
      <main className="mx-auto max-w-3xl px-4 pt-6 pb-8 sm:pt-10">
        {p.stato === "bozza" ? <Revisione iniziale={p} voci={voci} /> : <Approvato p={p} />}
      </main>
    </>
  );
}
