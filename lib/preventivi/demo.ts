import { readFileSync } from "node:fs";
import path from "node:path";
import { PriceList, type PriceListItem } from "@/lib/listino/schema";
import { leggi, salva, salvaProposte } from "./archivio";
import type { Azienda, Contesto } from "./contesto";

// La demo pubblica: impresa inventata, listino di prova in dati/listino.json, preventivi su file o Blob.

let cache: PriceList | null = null;
export function listino(): PriceList {
  cache ??= PriceList.parse(JSON.parse(readFileSync(path.join(process.cwd(), "dati", "listino.json"), "utf8")));
  return cache;
}
export function perCodice(): Map<string, PriceListItem> {
  return new Map(listino().items.map((i) => [i.code, i]));
}

export function aziendaDemo(): Azienda {
  const c = listino().company;
  return {
    name: c.name,
    address: c.address,
    vatNumber: c.vatNumber,
    phone: c.phone,
    email: c.email,
    quoteValidityDays: c.quoteValidityDays,
    avviso: `${c.fictitiousNotice} Documento generato da PreventivoLampo a scopo dimostrativo.`,
    iban: null,
    condizioniPagamento: null,
    logo: async () => null,
  };
}

export const demo: Contesto = {
  tipo: "demo",
  azienda: async () => aziendaDemo(),
  voci: async () => listino().items,
  leggi,
  crea: async (p) => {
    await salva(p);
    return p;
  },
  salva: async (p) => salva(p),
  impara: async (p, righe) => {
    await salvaProposte(
      p.numero,
      righe.map((r) => ({ nome: r.work, unita: r.unit, prezzoCents: r.unitPriceCents, daPreventivo: p.numero, il: p.approvatoIl })),
    );
  },
};
