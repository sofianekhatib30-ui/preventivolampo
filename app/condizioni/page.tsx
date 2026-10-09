import type { Metadata } from "next";
import { PaginaLegale } from "@/components/PaginaLegale";
import { dizionario } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Condizioni · PreventivoLampo" };

// Testo in lib/i18n/it.ts (legale.condizioni): l'italiano fa fede, le altre lingue sono traduzioni di cortesia.
export default async function Page() {
  const { lingua, d } = await dizionario();
  return <PaginaLegale d={d} lingua={lingua} titolo={d.legale.condizioni.titolo} aggiornata="2026-10-09" blocchi={d.legale.condizioni.blocchi} />;
}
