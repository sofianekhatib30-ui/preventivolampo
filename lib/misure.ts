import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// Lettura dei report di misura (misure/*.md) per la pagina del caso di studio: i numeri
// non si ricopiano a mano, si leggono dai report che scrive `npm run misura`.

const cartella = () => path.join(process.cwd(), "misure");

export function valori(file: string): Map<string, string> {
  const m = new Map<string, string>();
  const testo = readFileSync(path.join(cartella(), file), "utf8");
  const tabella = testo.slice(testo.indexOf("| Misura |"), testo.indexOf("\n\nNote sul metodo"));
  for (const riga of tabella.split("\n").slice(2)) {
    const [, nome, valore] = riga.split("|").map((x) => x.trim());
    if (nome) m.set(nome.replace(/\*/g, ""), (valore ?? "").replace(/\*/g, ""));
  }
  return m;
}

export function reportMisure() {
  const tutti = readdirSync(cartella());
  const principali = tutti.filter((f) => /^\d{4}-\d{2}-\d{2}[a-z]?\.md$/.test(f)).sort();
  const verifica = tutti.filter((f) => /^\d{4}-\d{2}-\d{2}[a-z]?-verifica\.md$/.test(f)).sort().at(-1) ?? null;
  return { prima: principali[0] ?? null, ultima: principali.at(-1) ?? null, verifica };
}

export const CHIAVI = {
  righe: "Righe giuste senza correzioni (voce, quantità e unità)",
  listino: "Voci di listino abbinate correttamente",
  daPrezzare: "Voci «da prezzare» riconosciute come tali",
  sbagliati: "Abbinamenti sbagliati con prezzo di listino (l'errore pericoloso)",
  inventati: "Prezzi inventati",
  domande: "Domande di chiarimento corrette",
  iva: "IVA corretta al centesimo (casi calcolabili senza l'artigiano)",
  extra: "Righe in più rispetto all'atteso",
  tempo: "Tempo medio per preventivo",
  costo: "Costo medio per preventivo",
} as const;
