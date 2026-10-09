import type { Metadata } from "next";
import { PaginaLegale } from "@/components/PaginaLegale";
import { Guscio } from "@/components/sito/Guscio";
import { contenutiDi } from "@/lib/contenuti";
import { linguaValida } from "@/lib/i18n/lingue";
import { dizionarioDi } from "@/lib/i18n/server";
import { metadati } from "@/lib/seo";

// Testo in lib/i18n/it.ts (legale.privacy): l'italiano fa fede, le altre lingue sono traduzioni di cortesia.
export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const lingua = linguaValida((await params).lang);
  const d = dizionarioDi(lingua);
  return metadati({ lingua, p: "/privacy", titolo: d.legale.privacy.titolo, descrizione: d.comune.servizioDi });
}

export default async function Page({ params }: PageProps<"/[lang]/privacy">) {
  const lingua = linguaValida((await params).lang);
  const d = dizionarioDi(lingua);
  const c = await contenutiDi(lingua);
  return (
    <Guscio d={d} c={c} lingua={lingua}>
      <PaginaLegale d={d} lingua={lingua} titolo={d.legale.privacy.titolo} aggiornata="2026-10-09" blocchi={d.legale.privacy.blocchi} />
    </Guscio>
  );
}
