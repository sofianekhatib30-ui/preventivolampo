import type { Metadata } from "next";
import { Prezzi } from "@/components/home/Prezzi";
import { CtaFinale } from "@/components/sito/CtaFinale";
import { ElencoDomande } from "@/components/sito/ElencoDomande";
import { Guscio } from "@/components/sito/Guscio";
import { JsonLd } from "@/components/sito/JsonLd";
import { TestaPagina } from "@/components/sito/TestaPagina";
import { contenutiDi } from "@/lib/contenuti";
import { linguaValida } from "@/lib/i18n/lingue";
import { dizionarioDi } from "@/lib/i18n/server";
import { applicazione, briciole, grafo, organizzazione } from "@/lib/json-ld";
import { metadati } from "@/lib/seo";

// Rigenerata ogni dieci minuti per il contatore dei posti del pilota.
export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/[lang]/prezzi">): Promise<Metadata> {
  const lingua = linguaValida((await params).lang);
  const P = (await contenutiDi(lingua)).pagine.prezzi;
  return metadati({ lingua, p: "/prezzi", titolo: P.meta.titolo, descrizione: P.meta.descrizione });
}

export default async function PaginaPrezzi({ params }: PageProps<"/[lang]/prezzi">) {
  const lingua = linguaValida((await params).lang);
  const d = dizionarioDi(lingua);
  const c = await contenutiDi(lingua);
  const P = c.pagine.prezzi;
  const vie = [
    { nome: c.ui.home, p: "/" },
    { nome: d.nav.prezzi, p: "/prezzi" },
  ];
  return (
    <Guscio d={d} c={c} lingua={lingua}>
      <TestaPagina lingua={lingua} briciole={vie} etichettaBriciole={d.comune.briciole} h1={P.h1} sottotitolo={P.testo} />
      <Prezzi d={d} lingua={lingua} />
      <ElencoDomande titolo={P.domande.titolo} voci={P.domande.voci} lingua={lingua} />
      <CtaFinale d={d} lingua={lingua} titolo={d.candidatura.titolo} testo={c.ui.mestiere.ctaTesto} />
      <JsonLd dati={grafo(briciole(lingua, vie), organizzazione(), applicazione(lingua))} />
    </Guscio>
  );
}
