import { lineAmountCents } from "@/lib/importi";
import { splitVat, vatRegime, type VatSplit } from "@/lib/motore/iva";
import type { Preventivo, RigaPreventivo } from "./modello";

// Conti del preventivo e controllo «si può approvare». Funzioni pure: le usa anche la pagina, dal telefono.

export type Mancanza = { riga: number | null; testo: string };

export function importoRiga(r: RigaPreventivo): number | null {
  if (r.quantity === null || r.unitPriceCents === null) return null;
  return lineAmountCents({ quantity: r.quantity, unitPriceCents: r.unitPriceCents });
}

export function regimeDi(p: Pick<Preventivo, "iva" | "righe">) {
  return vatRegime(p.iva, p.righe.some((r) => r.significantGood && r.code !== null));
}

export function mancanze(p: Pick<Preventivo, "iva" | "righe">): Mancanza[] {
  const out: Mancanza[] = [];
  p.righe.forEach((r, i) => {
    if (r.quantity === null) out.push({ riga: i, testo: "manca la quantità" });
    if (r.unit === null) out.push({ riga: i, testo: "manca l'unità di misura" });
    if (r.unitPriceCents === null) out.push({ riga: i, testo: "manca il prezzo" });
  });
  if (p.iva.dwelling === null) out.push({ riga: null, testo: "IVA: è un'abitazione?" });
  if (p.iva.intervention === null) out.push({ riga: null, testo: "IVA: tipo di intervento" });
  if (p.iva.goodsBoughtBy === null) out.push({ riga: null, testo: "IVA: chi compra i materiali" });
  if (regimeDi(p) === "agevolata_10_beni_significativi") {
    p.righe.forEach((r, i) => {
      if (!r.significantGood || r.code === null) return;
      const imp = importoRiga(r);
      if (r.goodsValueCents === null) out.push({ riga: i, testo: "valore del bene significativo" });
      else if (imp !== null && r.goodsValueCents > imp) out.push({ riga: i, testo: "il valore del bene supera l'importo della riga" });
    });
  }
  return out;
}

export type Conti = VatSplit & { beniSignificativiCents: number; regime: ReturnType<typeof regimeDi> };

export function conti(p: Pick<Preventivo, "iva" | "righe">): Conti | null {
  if (mancanze(p).length > 0) return null;
  const regime = regimeDi(p)!;
  const taxable = p.righe.reduce((s, r) => s + (importoRiga(r) ?? 0), 0);
  const beni =
    regime === "agevolata_10_beni_significativi"
      ? p.righe.reduce((s, r) => s + (r.significantGood && r.code !== null ? (r.goodsValueCents ?? 0) : 0), 0)
      : 0;
  return { ...splitVat(regime, taxable, beni), beniSignificativiCents: beni, regime };
}

// Imponibile parziale, anche con righe incomplete: per la pagina di revisione.
export function imponibileParziale(righe: RigaPreventivo[]): number {
  return righe.reduce((s, r) => s + (importoRiga(r) ?? 0), 0);
}
