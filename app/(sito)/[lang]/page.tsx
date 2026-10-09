import type { Metadata } from "next";
import { Calcolo } from "@/components/home/Calcolo";
import { Candidatura } from "@/components/home/Candidatura";
import { ComeFunziona } from "@/components/home/ComeFunziona";
import { Confronto } from "@/components/home/Confronto";
import { CosaCambia } from "@/components/home/CosaCambia";
import { BannerDemo, Demo } from "@/components/home/Demo";
import { Domande } from "@/components/home/Domande";
import { Hero } from "@/components/home/Hero";
import { Mestieri } from "@/components/home/Mestieri";
import { Numeri } from "@/components/home/Numeri";
import { Prezzi } from "@/components/home/Prezzi";
import { Guscio } from "@/components/sito/Guscio";
import { JsonLd } from "@/components/sito/JsonLd";
import { contenutiDi } from "@/lib/contenuti";
import { linguaValida } from "@/lib/i18n/lingue";
import { dizionarioDi } from "@/lib/i18n/server";
import { applicazione, grafo, organizzazione, sitoWeb } from "@/lib/json-ld";
import { metadati } from "@/lib/seo";
import { candidatureAperte, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/sito";

// Home di vendita: documentazione/index/SPEC.md. Server Components; JavaScript nel browser
// per la demo animata, il calcolo del tempo, il menu mobile e il modulo di candidatura. Nella demo pubblica (candidature chiuse)
// un banner in cima e la sezione Demo al posto del modulo.
// Una pagina statica per lingua, rigenerata ogni dieci minuti per il contatore dei posti del pilota.
export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lingua = linguaValida((await params).lang);
  // Titolo e descrizione della home: in italiano quelli di lib/sito.ts, nelle altre lingue dal dizionario.
  const d = dizionarioDi(lingua);
  const titolo = lingua === "it" ? SITE_TITLE : `PreventivoLampo · ${d.hero.titolo}`;
  const descrizione = lingua === "it" ? SITE_DESCRIPTION : d.hero.garanzia;
  return metadati({ lingua, p: "/", titolo, descrizione, titoloCompleto: true });
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lingua = linguaValida((await params).lang);
  const d = dizionarioDi(lingua);
  const c = await contenutiDi(lingua);
  const aperte = candidatureAperte();
  return (
    <Guscio d={d} c={c} lingua={lingua}>
      {!aperte && <BannerDemo />}
      <Hero d={d} lingua={lingua} />
      <Mestieri d={d} lingua={lingua} />
      <ComeFunziona d={d} />
      <Numeri d={d} />
      <CosaCambia d={d} />
      <Confronto d={d} />
      <Calcolo />
      <Prezzi d={d} lingua={lingua} />
      <Domande d={d} lingua={lingua} />
      {aperte ? <Candidatura d={d} /> : <Demo d={d} />}
      {/* Con le candidature chiuse il servizio non è in vendita: niente offerte nei dati strutturati. */}
      {aperte && <JsonLd dati={grafo(organizzazione(), sitoWeb(lingua), applicazione(lingua))} />}
    </Guscio>
  );
}
