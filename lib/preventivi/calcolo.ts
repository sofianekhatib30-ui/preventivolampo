import { lineAmountCents } from "@/lib/importi";
import { mancanzeFiscali, riepilogoFiscale, type Mancanza, type Riepilogo } from "@/lib/fisco/conti";
import { PROFILO_EDILE, type ContestoFiscale, type ProfiloFiscale } from "@/lib/fisco/schema";
import { splitVat, vatRegime, VAT_NOTICE, type VatSplit } from "@/lib/motore/iva";
import type { Preventivo, RigaPreventivo } from "./modello";

// Conti del preventivo e controllo «si può approvare». Funzioni pure: le usa anche la pagina, dal telefono.
// Dal 10/10/2026 sera i preventivi nuovi hanno il fisco (lib/fisco): IVA per lavoro e per riga, cliente,
// ritenute, forfettario. Quelli nati prima (senza «fisco») restano con le regole di allora: un preventivo
// approvato non cambia i suoi conti.

export type { Mancanza, Riepilogo };

export function importoRiga(r: RigaPreventivo): number | null {
  if (r.quantity === null || r.unitPriceCents === null) return null;
  return lineAmountCents({ quantity: r.quantity, unitPriceCents: r.unitPriceCents });
}

type PerConti = Pick<Preventivo, "iva" | "righe"> & { ivaFissa?: Preventivo["ivaFissa"]; fisco?: Preventivo["fisco"] };

const righeFiscali = (righe: RigaPreventivo[]) =>
  righe.map((r) => ({ importoCents: importoRiga(r), aliquota: r.aliquota ?? null, significantGood: r.significantGood, code: r.code, goodsValueCents: r.goodsValueCents }));

function mancanzeRighe(righe: RigaPreventivo[]): Mancanza[] {
  const out: Mancanza[] = [];
  righe.forEach((r, i) => {
    if (r.quantity === null) out.push({ riga: i, testo: "manca la quantità" });
    if (r.unit === null) out.push({ riga: i, testo: "manca l'unità di misura" });
    if (r.unitPriceCents === null) out.push({ riga: i, testo: "manca il prezzo" });
  });
  return out;
}

export function mancanze(p: PerConti): Mancanza[] {
  if (p.fisco) return [...mancanzeRighe(p.righe), ...mancanzeFiscali(p.fisco, righeFiscali(p.righe))];
  return [...mancanzeRighe(p.righe), ...mancanzeLegacy(p)];
}

export function riepilogo(p: PerConti): Riepilogo | null {
  if (mancanze(p).length > 0) return null;
  if (p.fisco) return riepilogoFiscale(p.fisco, righeFiscali(p.righe));
  return riepilogoLegacy(p);
}

// Imponibile parziale, anche con righe incomplete: per la pagina di revisione.
export function imponibileParziale(righe: RigaPreventivo[]): number {
  return righe.reduce((s, r) => s + (importoRiga(r) ?? 0), 0);
}

// Un preventivo in bozza nato prima del fisco: lo si porta alle regole nuove con le risposte che aveva.
export function conFisco(p: Preventivo, profilo: ProfiloFiscale): Preventivo {
  if (p.fisco || p.stato !== "bozza") return p;
  const contesto: ContestoFiscale = {
    cliente: null,
    oggetto: p.ivaFissa ? "nessuno" : p.iva.dwelling === null ? null : p.iva.dwelling ? "abitazione" : "non_abitativo",
    lavoro: p.ivaFissa ? null : p.iva.intervention,
    materiali: p.ivaFissa ? null : p.iva.goodsBoughtBy,
    primaCasa: null,
    inversione: null,
  };
  return { ...p, fisco: { contesto, profilo }, ivaFissa: null };
}

export function profiloDemo(): ProfiloFiscale {
  return PROFILO_EDILE;
}

// --- Regole di prima del 10/10/2026 sera: solo per i preventivi già fatti senza fisco. ---

export function regimeDi(p: PerConti) {
  if (p.ivaFissa) return p.ivaFissa;
  return vatRegime(p.iva, p.righe.some((r) => r.significantGood && r.code !== null));
}

function mancanzeLegacy(p: PerConti): Mancanza[] {
  const out: Mancanza[] = [];
  if (!p.ivaFissa && p.iva.dwelling === null) out.push({ riga: null, testo: "IVA: è un'abitazione?" });
  if (!p.ivaFissa && p.iva.intervention === null) out.push({ riga: null, testo: "IVA: tipo di intervento" });
  if (!p.ivaFissa && p.iva.goodsBoughtBy === null) out.push({ riga: null, testo: "IVA: chi compra i materiali" });
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

export function conti(p: PerConti): Conti | null {
  if (mancanze(p).length > 0) return null;
  const regime = regimeDi(p)!;
  const taxable = p.righe.reduce((s, r) => s + (importoRiga(r) ?? 0), 0);
  const beni =
    regime === "agevolata_10_beni_significativi"
      ? p.righe.reduce((s, r) => s + (r.significantGood && r.code !== null ? (r.goodsValueCents ?? 0) : 0), 0)
      : 0;
  return { ...splitVat(regime, taxable, beni), beniSignificativiCents: beni, regime };
}

const REGIME_LEGACY: Record<string, string> = {
  ordinaria_22: "IVA ordinaria 22%",
  agevolata_10: "IVA agevolata 10% (manutenzione su abitazione)",
  agevolata_10_beni_significativi: "IVA agevolata 10% con beni significativi (DM 29/12/1999)",
};

function riepilogoLegacy(p: PerConti): Riepilogo | null {
  const c = conti(p);
  if (!c) return null;
  const gruppi = [
    ...(c.at22Cents > 0 ? [{ codice: "22" as const, percento: 22, imponibileCents: c.at22Cents, ivaCents: Math.round(c.at22Cents * 0.22), natura: null }] : []),
    ...(c.at10Cents > 0 ? [{ codice: "10" as const, percento: 10, imponibileCents: c.at10Cents, ivaCents: Math.round(c.at10Cents * 0.1), natura: null }] : []),
  ];
  const avviso = p.ivaFissa ? "Verifica con il tuo commercialista." : VAT_NOTICE;
  const beni = c.beniSignificativiCents > 0 ? ` Valore dei beni significativi: ${(c.beniSignificativiCents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}.` : "";
  return {
    imponibileCents: c.taxableCents,
    rivalsaCents: 0,
    gruppi,
    ivaCents: c.vatCents,
    bolloCents: 0,
    totaleCents: c.totalCents,
    scissione: false,
    ritenuta: null,
    nettoCents: c.totalCents,
    beniSignificativiCents: c.beniSignificativiCents,
    diciture: [`${REGIME_LEGACY[c.regime!]}.${beni} ${avviso}`],
    avvisi: [],
  };
}
