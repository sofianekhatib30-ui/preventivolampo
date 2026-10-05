// Genera dati/listino.json unendo:
//  - ricerca/2026-09-23-prezzi-listino.csv  → prezzo, unità, descrizione, fonte (mai scritti a mano)
//  - dati/listino-voci.json                 → codice interno, categoria, nome breve, sinonimi
//  - dati/impresa.json                      → impresa fittizia
// Uso: node scripts/genera-listino.mjs   (npm run genera:listino)

import { readFileSync, writeFileSync } from "node:fs";

const CSV = "ricerca/2026-09-23-prezzi-listino.csv";
const UNIT_MAP = { "m²": "m2", m: "m", "m³": "m3", cad: "cad", h: "h", "100 kg": "100kg" };

// "4.13" → 413, senza passare dalla virgola mobile.
function euroStringToCents(value) {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value.trim());
  if (!match) throw new Error(`Prezzo non leggibile: "${value}"`);
  return Number(match[1]) * 100 + Number((match[2] ?? "0").padEnd(2, "0"));
}

const [header, ...rows] = readFileSync(CSV, "utf8").trim().split(/\r?\n/);
const columns = header.split(";");
const bySourceCode = new Map();
for (const row of rows) {
  const fields = row.split(";");
  if (fields.length !== columns.length) throw new Error(`Riga CSV con ${fields.length} campi: ${row.slice(0, 60)}`);
  const record = Object.fromEntries(columns.map((c, i) => [c, fields[i]]));
  bySourceCode.set(record.codice_fonte, record);
}

const { voci } = JSON.parse(readFileSync("dati/listino-voci.json", "utf8"));
const company = JSON.parse(readFileSync("dati/impresa.json", "utf8"));

const items = voci.map((v) => {
  const r = bySourceCode.get(v.sourceCode);
  if (!r) throw new Error(`${v.code}: codice fonte ${v.sourceCode} assente dal CSV`);
  const unit = UNIT_MAP[r.unita];
  if (!unit) throw new Error(`${v.code}: unità "${r.unita}" non prevista`);
  return {
    code: v.code,
    category: v.category,
    name: v.name,
    description: r.descrizione,
    unit,
    priceCents: euroStringToCents(r.prezzo_eur),
    synonyms: v.synonyms,
    significantGood: v.significantGood,
    clientSuppliable: v.clientSuppliable,
    source: {
      document: r.fonte,
      edition: r.edizione,
      sourceCode: r.codice_fonte,
      url: r.url,
      reference: r.riferimento,
    },
  };
});

const excluded = [...bySourceCode.keys()].filter((code) => !voci.some((v) => v.sourceCode === code));

const priceList = {
  company,
  priceBasis:
    "Prezzi del Prezzario Regionale dei Lavori Pubblici di Regione Lombardia, edizione 2026: comprensivi di spese generali (15%) e utile d'impresa (10%), IVA esclusa. Sono prezzi per appalti pubblici, usati qui come listino di un'impresa inventata.",
  items,
};

writeFileSync("dati/listino.json", JSON.stringify(priceList, null, 2) + "\n");
console.log(`dati/listino.json: ${items.length} voci. Escluse dal CSV: ${excluded.length} (${excluded.join(", ")})`);
