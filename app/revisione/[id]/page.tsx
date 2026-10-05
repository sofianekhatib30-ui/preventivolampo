import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Approvato from "@/components/preventivo/Approvato";
import Revisione from "@/components/preventivo/Revisione";
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
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      {p.stato === "bozza" ? <Revisione iniziale={p} voci={voci} /> : <Approvato p={p} />}
    </main>
  );
}
