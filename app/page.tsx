import { Candidatura } from "@/components/home/Candidatura";
import { ComeFunziona } from "@/components/home/ComeFunziona";
import { Confronto } from "@/components/home/Confronto";
import { CosaCambia } from "@/components/home/CosaCambia";
import { BannerDemo, Demo } from "@/components/home/Demo";
import { Domande } from "@/components/home/Domande";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { Prezzi } from "@/components/home/Prezzi";
import { SaltaAlContenuto } from "@/components/SaltaAlContenuto";
import { serviceJsonLd } from "@/lib/json-ld";
import { candidatureAperte } from "@/lib/sito";

// Home di vendita: documentazione/index/SPEC.md. Server Components; JavaScript nel browser
// solo per il menu mobile e il modulo di candidatura. Nella demo pubblica (candidature chiuse)
// un banner in cima e la sezione Demo al posto del modulo.
// Il contatore dei posti del pilota si rilegge al massimo ogni 10 minuti.
export const revalidate = 600;

export default function Home() {
  const aperte = candidatureAperte();
  return (
    <>
      <SaltaAlContenuto />
      {!aperte && <BannerDemo />}
      <Header />
      <main id="contenuto" tabIndex={-1} className="flex flex-col outline-none">
        <Hero />
        <ComeFunziona />
        <CosaCambia />
        <Confronto />
        <Prezzi />
        <Domande />
        {aperte ? <Candidatura /> : <Demo />}
      </main>
      {aperte && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </>
  );
}
