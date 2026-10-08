import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

// Promesse della home = requisiti di prodotto (SPEC, sezione «Promesse della pagina =
// requisiti di prodotto»). Per ogni riga della tabella della SPEC:
//   1. la frase è davvero nel testo della pagina renderizzata;
//   2. il requisito ha una prova (un test o una consegna nel repository).
// In modalità normale una promessa senza prova è solo elencata; con PRODUZIONE=1 fa fallire.

type Prova = {
  file: string; // percorso dal repository
  contiene: string; // testo che deve comparire nel file: il nome del test o la frase della consegna
};

type Promessa = {
  rigaSpec: string; // prima cella della riga della SPEC, copiata alla lettera
  frasi: string[]; // come compaiono nella pagina (senza distinzione maiuscole/minuscole)
  requisito: string;
  prova: Prova | null;
};

const PROMESSE: Promessa[] = [
  {
    rigaSpec: "«Lo racconti a voce o lo scrivi»",
    frasi: ["Lo racconti a voce o lo scrivi"],
    requisito: "Dettatura nel browser e testo libero nell'area",
    prova: { file: "components/preventivo/Dettatura.tsx", contiene: "SpeechRecognition" },
  },
  {
    rigaSpec: "«Ti chiede cosa manca»",
    frasi: ["Ti chiede cosa manca"],
    requisito: "Domande di chiarimento su quantità/unità mancanti (banco F2/F3)",
    prova: { file: "test/motore.test.ts", contiene: "misura mancante → domanda" },
  },
  {
    rigaSpec: "«Nessun prezzo inventato» / «da prezzare»",
    frasi: ["Nessun prezzo inventato", "da prezzare"],
    requisito: "Nessun prezzo fuori listino; voce non abbinata = «da prezzare» (misura F3)",
    prova: { file: "misure/2026-10-08.md", contiene: "| **Prezzi inventati** | **0** |" },
  },
  {
    rigaSpec: "«l'IVA giusta» / ripartizione 10% e 22%",
    frasi: ["l'IVA giusta", "IVA 10% e 22%"],
    requisito: "Motore IVA con beni significativi, esempio AdE 4.000 + 6.000 → totale 11.240,00",
    prova: { file: "test/motore.test.ts", contiene: "esempio dell'Agenzia delle Entrate" },
  },
  {
    rigaSpec: "«il cliente riceve il PDF da accettare con un clic»",
    frasi: ["il cliente riceve il PDF da accettare con un clic"],
    requisito: "Link di accettazione senza registrazione (F5)",
    prova: { file: "test/preventivo-e2e.test.ts", contiene: "poi PDF, link al cliente e accettazione" },
  },
  {
    rigaSpec: "«Tu vedi quando lo apre e quando dice sì»",
    frasi: ["Tu vedi quando lo apre e quando dice sì"],
    requisito: "Stati inviato / visto / accettato / rifiutato / scaduto (F5)",
    prova: { file: "test/esempi-visto.test.ts", contiene: "si segna una volta sola e solo sui preventivi approvati" },
  },
  {
    rigaSpec: "«Le voci nuove che prezzi entrano nel tuo listino»",
    frasi: ["Le voci nuove che prezzi entrano nel tuo listino"],
    requisito: "Voce prezzata in revisione → proposta di aggiunta al listino (F5)",
    prova: { file: "lib/impresa/da-prezzare.ts", contiene: "Entrano nel listino solo quando lui le conferma" },
  },
  {
    rigaSpec: "«server nell'Unione Europea»",
    frasi: ["server nell'Unione Europea"],
    requisito: "Database, storage e funzioni in regione UE; elenco sub-responsabili",
    prova: null,
  },
  {
    rigaSpec: "«Ai nostri server arriva solo il testo, non l'audio»",
    frasi: ["Ai nostri server arriva solo il testo, non l'audio"],
    requisito: "La dettatura avviene nel browser; nessun audio salvato",
    prova: { file: "components/preventivo/Dettatura.tsx", contiene: "niente audio sul nostro server" },
  },
  {
    rigaSpec: "«firmiamo l'accordo per il trattamento dei dati»",
    frasi: ["firmiamo l'accordo per il trattamento dei dati"],
    requisito: "Modello DPA pronto (Notaio)",
    prova: null,
  },
  {
    rigaSpec: "«Nessun rinnovo automatico» / «Disdici quando vuoi»",
    frasi: ["Nessun rinnovo automatico", "Disdici quando vuoi"],
    requisito: "Condizioni coerenti (Notaio)",
    prova: { file: "app/condizioni/page.tsx", contiene: "Nessun rinnovo automatico" },
  },
  {
    rigaSpec: "«99,4%» / «26 su 26»",
    frasi: ["99,4%", "26 su 26"],
    requisito: "Numeri pubblicati = misure generate da npm run misura",
    prova: { file: "misure/2026-10-08.md", contiene: "| 158 su 159 (99,4%) |" },
  },
];

const ROOT = path.resolve(__dirname, "..");
const PRODUZIONE = process.env.PRODUZIONE === "1";

function normalizza(testo: string): string {
  return testo
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function testoDellaPagina(): string {
  const html = renderToStaticMarkup(createElement(Home));
  const senzaScript = html.replace(/<script[^>]*>[^<]*<\/script>/g, " ");
  const testo = senzaScript
    .replace(/<[^>]*>/g, "")
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
  return normalizza(testo);
}

// Righe della tabella nella sezione della SPEC, lette dal testo del titolo e non dalla posizione.
function righeDellaSpec(): string[] {
  const spec = readFileSync(path.join(ROOT, "documentazione/index/SPEC.md"), "utf8");
  const titolo = "## Promesse della pagina = requisiti di prodotto";
  const inizio = spec.indexOf(titolo);
  expect(inizio, `sezione «${titolo}» non trovata nella SPEC`).toBeGreaterThanOrEqual(0);
  const dopo = spec.slice(inizio + titolo.length);
  const fine = dopo.search(/^## /m);
  const sezione = fine === -1 ? dopo : dopo.slice(0, fine);
  return sezione
    .split(/\r?\n/)
    .filter((riga) => riga.startsWith("|"))
    .map((riga) => riga.split("|")[1].trim())
    .filter((cella) => cella !== "" && !/^-+$/.test(cella) && cella !== "Promessa nella pagina");
}

describe("promesse della home", () => {
  const pagina = testoDellaPagina();

  it("ogni riga della tabella della SPEC ha la sua promessa qui, e nessuna in più", () => {
    const righe = righeDellaSpec();
    // Minimo: una tabella che sparisce o si svuota non deve far passare il test.
    expect(righe.length).toBeGreaterThanOrEqual(12);
    expect(PROMESSE.map((p) => p.rigaSpec).sort()).toEqual([...righe].sort());
  });

  it.each(PROMESSE.map((p) => [p.rigaSpec, p] as const))(
    "%s: la frase è nella pagina",
    (_riga, promessa) => {
      expect(promessa.frasi.length).toBeGreaterThan(0);
      for (const frase of promessa.frasi) {
        expect(pagina, `frase mancante nella pagina: «${frase}»`).toContain(normalizza(frase));
      }
    },
  );

  it("le prove dichiarate esistono e contengono quello che dicono", () => {
    for (const { rigaSpec, prova } of PROMESSE) {
      if (!prova) continue;
      const file = path.join(ROOT, prova.file);
      expect(existsSync(file), `${rigaSpec}: file di prova assente ${prova.file}`).toBe(true);
      expect(readFileSync(file, "utf8"), `${rigaSpec}: ${prova.file}`).toContain(prova.contiene);
    }
  });

  it(`ogni promessa ha una prova (${PRODUZIONE ? "PRODUZIONE=1: obbligatorio" : "solo elenco"})`, () => {
    const senzaProva = PROMESSE.filter((p) => p.prova === null);
    if (senzaProva.length > 0) {
      const elenco = senzaProva.map((p) => `  - ${p.rigaSpec} → ${p.requisito}`).join("\n");
      console.warn(`Promesse della home senza prova (${senzaProva.length}/${PROMESSE.length}):\n${elenco}`);
    }
    if (PRODUZIONE) {
      expect(senzaProva.map((p) => p.rigaSpec)).toEqual([]);
    }
  });
});
