import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProvaForm from "@/components/preventivo/ProvaForm";
import { TestataApp } from "@/components/TestataApp";
import { provaAttiva, serveCodice } from "@/lib/preventivi/http";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Prova il motore — PreventivoLampo", robots: { index: false, follow: false } };

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

export default function Prova() {
  if (!provaAttiva()) notFound();
  return (
    <>
      <TestataApp>
        <Link href="/#come" className="text-sm font-semibold text-scuro-testo">
          Come funziona
        </Link>
      </TestataApp>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <h1 className="text-[34px] font-black leading-[1.05] [font-stretch:80%] sm:text-[44px]">Dal sopralluogo alla bozza</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-testo-2">
          Il motore estrae le lavorazioni, le abbina al listino e ti prepara la bozza da controllare. I prezzi vengono solo dal
          listino: quello che non trova resta da prezzare, quello che manca te lo chiede.
        </p>
        <ProvaForm esempi={esempi()} chiediCodice={serveCodice()} />
        <p className="mt-10 text-sm leading-relaxed text-testo-3">
          Dati di prova inventati: l&apos;impresa del listino e i clienti degli esempi non esistono. Non inserire nomi, indirizzi o
          numeri di persone reali: le bozze restano 7 giorni e chiunque abbia il link può aprirle. Il testo libero viene elaborato
          con Claude di Anthropic.{" "}
          <Link href="/privacy" className="font-semibold text-cielo-scuro">
            Privacy
          </Link>
        </p>
      </main>
    </>
  );
}
