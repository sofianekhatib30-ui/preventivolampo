import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProvaForm from "@/components/preventivo/ProvaForm";
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
      const titolo = JSON.parse(readFileSync(path.join(dir, "atteso", `${id}.json`), "utf8")).title as string;
      const testo = readFileSync(path.join(dir, "copioni", f), "utf8").replace(/<!--[\s\S]*?-->/g, "").trim();
      return { id, titolo, testo };
    });
}

export default function Prova() {
  if (!provaAttiva()) notFound();
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <p className="font-mono text-sm text-testo-3">PreventivoLampo · prova</p>
      <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">Dal sopralluogo alla bozza</h1>
      <p className="mt-3 text-testo-2">
        Incolla quello che diresti nel vocale dopo il sopralluogo, oppure scegli un esempio. Il motore estrae le lavorazioni, le
        abbina al listino e ti prepara la bozza da controllare. I prezzi vengono solo dal listino: quello che non trova resta da
        prezzare.
      </p>
      <ProvaForm esempi={esempi()} chiediCodice={serveCodice()} />
      <p className="mt-8 text-sm text-testo-3">
        Dati di prova inventati: l&apos;impresa del listino e i clienti degli esempi non esistono. Non inserire nomi, indirizzi o
        numeri di persone reali: le bozze della demo restano salvate e chiunque abbia il link può aprirle. Il testo viene elaborato
        con Claude di Anthropic.
      </p>
    </main>
  );
}
