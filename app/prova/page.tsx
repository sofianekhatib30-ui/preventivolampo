import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProvaForm from "@/components/preventivo/ProvaForm";
import { ConNodi } from "@/components/Ricco";
import { SceltaLingua } from "@/components/SceltaLingua";
import { TestataApp } from "@/components/TestataApp";
import { dizionario } from "@/lib/i18n/server";
import { provaAttiva, serveCodice } from "@/lib/preventivi/http";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { d } = await dizionario();
  return { title: `${d.area.titoli.prova} · PreventivoLampo`, robots: { index: false, follow: false } };
}

// Pagina di prova: incolli il testo di un vocale (o scegli uno dei 30 sopralluoghi inventati del banco di prova)
// e ricevi la bozza da rivedere. Al posto del vocale WhatsApp, finché il canale non è attivo.
function esempi() {
  const dir = path.join(process.cwd(), "testset");
  return readdirSync(path.join(dir, "copioni"))
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const id = f.slice(0, 2);
      // Nel titolo resta solo il mestiere: «(idraulico, Seregno)» → «(idraulico)».
      const titolo = (JSON.parse(readFileSync(path.join(dir, "atteso", `${id}.json`), "utf8")).title as string).replace(/\(([^,()]+),[^()]*\)\s*$/, "($1)");
      const testo = readFileSync(path.join(dir, "copioni", f), "utf8").replace(/<!--[\s\S]*?-->/g, "").trim();
      return { id, titolo, testo };
    });
}

export default async function Prova() {
  if (!provaAttiva()) notFound();
  const { d } = await dizionario();
  const P = d.area.prova;
  return (
    <>
      <TestataApp etichettaLogo={d.comune.logoHome}>
        <Link href="/#come" className="text-sm font-semibold text-scuro-testo">
          {d.comune.comeFunziona}
        </Link>
        <SceltaLingua />
      </TestataApp>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <h1 className="text-[34px] font-black leading-[1.05] [font-stretch:80%] sm:text-[44px]">{P.h1}</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-testo-2">{P.sotto}</p>
        <ProvaForm esempi={esempi()} chiediCodice={serveCodice()} />
        <p className="mt-10 text-sm leading-relaxed text-testo-3">
          <ConNodi
            testo={P.avviso}
            valori={{
              privacy: (
                <Link href="/privacy" className="font-semibold text-cielo-scuro">
                  {d.comune.privacy}
                </Link>
              ),
            }}
          />
        </p>
      </main>
    </>
  );
}
