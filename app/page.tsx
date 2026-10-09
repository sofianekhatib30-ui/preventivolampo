import { Calcolo } from "@/components/home/Calcolo";
import { Candidatura } from "@/components/home/Candidatura";
import { ComeFunziona } from "@/components/home/ComeFunziona";
import { Confronto } from "@/components/home/Confronto";
import { CosaCambia } from "@/components/home/CosaCambia";
import { BannerDemo, Demo } from "@/components/home/Demo";
import { Domande } from "@/components/home/Domande";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { Mestieri } from "@/components/home/Mestieri";
import { Numeri } from "@/components/home/Numeri";
import { Prezzi } from "@/components/home/Prezzi";
import { SaltaAlContenuto } from "@/components/SaltaAlContenuto";
import { dizionario } from "@/lib/i18n/server";
import { serviceJsonLd } from "@/lib/json-ld";
import { candidatureAperte } from "@/lib/sito";

// Home di vendita: documentazione/index/SPEC.md. Server Components; JavaScript nel browser
// per la demo animata, il calcolo del tempo, il menu mobile e il modulo di candidatura. Nella demo pubblica (candidature chiuse)
// un banner in cima e la sezione Demo al posto del modulo.
// La pagina dipende dalla lingua scelta (cookie): si genera a ogni richiesta, con il contatore dei posti aggiornato.

export default async function Home() {
  const { d } = await dizionario();
  const aperte = candidatureAperte();
  return (
    <>
      <SaltaAlContenuto testo={d.comune.saltaAlContenuto} />
      {!aperte && <BannerDemo />}
      <Header d={d} />
      <main id="contenuto" tabIndex={-1} className="flex flex-col outline-none">
        <Hero d={d} />
        <Mestieri d={d} />
        <ComeFunziona d={d} />
        <Numeri d={d} />
        <CosaCambia d={d} />
        <Confronto d={d} />
        <Calcolo />
        <Prezzi d={d} />
        <Domande d={d} />
        {aperte ? <Candidatura d={d} /> : <Demo d={d} />}
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
