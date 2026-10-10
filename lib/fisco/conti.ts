import type { Aliquota, ContestoFiscale, Fisco, ProfiloFiscale } from "./schema";

// I conti fiscali del preventivo. Funzioni pure: le usano il server (approvazione, PDF) e la pagina
// di revisione, dal telefono. Il codice non indovina: una risposta che manca diventa una domanda.
//
// Regole (ricerca del 10/10/2026; i casi incerti sono avvisi, non decisioni):
// - forfettario (L. 190/2014, c. 54-89): niente IVA, bollo da 2 € sopra 77,47 €, niente ritenute;
// - inversione contabile (art. 17 c. 6 DPR 633/1972) con un cliente impresa: lett. a subappalto edile,
//   lett. a-ter pulizia, demolizione, impianti e completamento di edifici: l'IVA la integra il cliente;
// - scissione dei pagamenti (art. 17-ter) con la PA: l'IVA è esposta ma la versa l'ente; non vale per i
//   compensi soggetti a ritenuta;
// - IVA edile per riga: manutenzione su abitazione 10% con i beni significativi (L. 488/1999, DM 29/12/1999);
//   manutenzione su non abitativo 22%; ristrutturazione 10% (n. 127-quaterdecies); nuova costruzione 10%
//   o 4% prima casa (n. 39 Tab. A parte II); barriere architettoniche 4% (n. 41-ter); fotovoltaico 10%
//   (n. 127-quinquies e septies); aree esterne e giardini 22%;
// - ritenuta del 4% del condominio (art. 25-ter DPR 600/1973) e del 20% sui lavoratori autonomi;
// - rivalsa INPS 4% (gestione separata), soggetta a IVA e a ritenuta.

export type RigaFiscale = {
  importoCents: number | null;
  aliquota?: Aliquota | null;
  significantGood: boolean;
  code: string | null;
  goodsValueCents: number | null;
};

export type Mancanza = { riga: number | null; testo: string };

// I testi delle domande: la pagina di revisione li riconosce per mostrarli nella lingua dell'interfaccia.
export const DOMANDE = {
  cliente: "Fisco: tipo di cliente",
  oggetto: "Fisco: su cosa si lavora",
  lavoro: "Fisco: tipo di lavoro",
  materiali: "Fisco: chi compra i materiali",
  primaCasa: "Fisco: prima casa",
  inversione: "Fisco: inversione contabile",
  valoreBene: "valore del bene significativo",
  valoreSupera: "il valore del bene supera l'importo della riga",
} as const;

const EDIFICIO = new Set<ContestoFiscale["oggetto"]>(["abitazione", "non_abitativo", "nuova_costruzione"]);
const MANUTENZIONE = new Set<ContestoFiscale["lavoro"]>(["manutenzione_ordinaria", "manutenzione_straordinaria"]);

// Su cosa si lavora, tenuto conto del profilo: chi non lavora sugli edifici non risponde a quella domanda.
export function oggettoDi(f: Fisco): ContestoFiscale["oggetto"] {
  return f.profilo.edifici ? f.contesto.oggetto : "nessuno";
}

function inversioneAttiva(f: Fisco): boolean {
  if (f.profilo.regime === "forfettario" || f.contesto.cliente !== "impresa") return false;
  return f.contesto.inversione === "subappalto" || f.contesto.inversione === "edificio";
}

export function chiedeInversione(f: Fisco): boolean {
  if (f.profilo.regime === "forfettario" || f.contesto.cliente !== "impresa") return false;
  return EDIFICIO.has(oggettoDi(f)) || f.profilo.pulizie;
}

// L'aliquota del lavoro sull'edificio, dalle risposte. null se manca una risposta.
export function aliquotaEdile(f: Fisco): Aliquota | null {
  const o = oggettoDi(f);
  const { lavoro, primaCasa } = f.contesto;
  if (o === "nuova_costruzione") return primaCasa === null ? null : primaCasa ? "4" : "10";
  if (o === "abitazione" || o === "non_abitativo") {
    if (lavoro === null) return null;
    if (lavoro === "barriere") return "4";
    if (lavoro === "fotovoltaico" || lavoro === "ristrutturazione") return "10";
    return o === "abitazione" ? "10" : "22";
  }
  if (o === "esterno") return "22";
  return null;
}

// L'aliquota di una riga e se viene dalle regole dell'edilizia (serve per i beni significativi).
export function aliquotaRiga(f: Fisco, r: Pick<RigaFiscale, "aliquota">): { aliquota: Aliquota | null; edile: boolean } {
  if (r.aliquota) return { aliquota: r.aliquota, edile: false };
  const o = oggettoDi(f);
  if (o !== null && o !== "nessuno") return { aliquota: aliquotaEdile(f), edile: true };
  if (o === null) return { aliquota: null, edile: true };
  return { aliquota: f.profilo.aliquotaBase, edile: false };
}

// Beni significativi: manutenzione su abitazione con i materiali dell'impresa.
function conBeniSignificativi(f: Fisco): boolean {
  return oggettoDi(f) === "abitazione" && MANUTENZIONE.has(f.contesto.lavoro) && f.contesto.materiali === "impresa";
}

const eBeneSignificativo = (f: Fisco, r: RigaFiscale) => conBeniSignificativi(f) && r.significantGood && r.code !== null && aliquotaRiga(f, r).aliquota === "10" && !r.aliquota;

// La riga chiede il valore del bene significativo: per la pagina di revisione.
export const chiedeValoreBene = (f: Fisco, r: RigaFiscale) => !inversioneAttiva(f) && eBeneSignificativo(f, r);

export function mancanzeFiscali(f: Fisco, righe: RigaFiscale[]): Mancanza[] {
  const out: Mancanza[] = [];
  const c = f.contesto;
  if (c.cliente === null) out.push({ riga: null, testo: DOMANDE.cliente });
  if (f.profilo.regime === "forfettario") return out;
  const o = oggettoDi(f);
  // L'oggetto serve solo se qualche riga segue le regole dell'edilizia (non ha un'aliquota propria).
  const serveEdile = righe.some((r) => !r.aliquota);
  if (serveEdile && o === null) out.push({ riga: null, testo: DOMANDE.oggetto });
  if (serveEdile && (o === "abitazione" || o === "non_abitativo") && c.lavoro === null) out.push({ riga: null, testo: DOMANDE.lavoro });
  if (serveEdile && o === "abitazione" && MANUTENZIONE.has(c.lavoro) && c.materiali === null) out.push({ riga: null, testo: DOMANDE.materiali });
  if (serveEdile && o === "nuova_costruzione" && c.primaCasa === null) out.push({ riga: null, testo: DOMANDE.primaCasa });
  if (chiedeInversione(f) && c.inversione === null) out.push({ riga: null, testo: DOMANDE.inversione });
  if (!inversioneAttiva(f)) {
    righe.forEach((r, i) => {
      if (!eBeneSignificativo(f, r)) return;
      if (r.goodsValueCents === null) out.push({ riga: i, testo: DOMANDE.valoreBene });
      else if (r.importoCents !== null && r.goodsValueCents > r.importoCents) out.push({ riga: i, testo: DOMANDE.valoreSupera });
    });
  }
  return out;
}

export type CodiceGruppo = Aliquota | "inversione" | "forfettario";
export type Gruppo = { codice: CodiceGruppo; percento: number; imponibileCents: number; ivaCents: number; natura: string | null };

export type Riepilogo = {
  imponibileCents: number; // somma delle righe (il compenso)
  rivalsaCents: number;
  gruppi: Gruppo[];
  ivaCents: number;
  bolloCents: number;
  totaleCents: number; // totale del documento
  scissione: boolean;
  ritenuta: { percento: number; baseCents: number; importoCents: number } | null;
  nettoCents: number; // quanto paga davvero il cliente
  beniSignificativiCents: number;
  diciture: string[]; // da stampare sul preventivo
  avvisi: string[]; // per l'artigiano: casi da confermare, non vanno sul PDF
};

const PERCENTO: Record<Aliquota, number> = { "22": 22, "10": 10, "4": 4, esente: 0 };
const ORDINE: CodiceGruppo[] = ["22", "10", "4", "esente", "inversione", "forfettario"];

function dicituraEdile(f: Fisco, aliquota: Aliquota): string | null {
  const o = oggettoDi(f);
  const l = f.contesto.lavoro;
  if (aliquota === "4" && o === "nuova_costruzione") return "IVA 4% per la costruzione della prima casa non di lusso (n. 39, Tabella A, parte II, DPR 633/1972).";
  if (aliquota === "4" && l === "barriere") return "IVA 4% per opere di superamento delle barriere architettoniche (n. 41-ter, Tabella A, parte II, DPR 633/1972).";
  if (aliquota !== "10") return null;
  if (o === "nuova_costruzione") return "IVA 10% per la costruzione di abitazioni non di lusso (n. 127-quaterdecies, Tabella A, parte III, DPR 633/1972).";
  if (l === "fotovoltaico") return "IVA 10% per impianti da fonte solare (nn. 127-quinquies e 127-septies, Tabella A, parte III, DPR 633/1972).";
  if (l === "ristrutturazione") return "IVA 10% per interventi di recupero edilizio (n. 127-quaterdecies, Tabella A, parte III, DPR 633/1972).";
  if (o === "abitazione" && MANUTENZIONE.has(l)) return "IVA 10% per manutenzione su abitazione (art. 7, comma 1, lett. b, L. 488/1999).";
  return null;
}

function avvisiContesto(f: Fisco): string[] {
  const out: string[] = [];
  const o = oggettoDi(f);
  const l = f.contesto.lavoro;
  if (o === "nuova_costruzione" && f.contesto.primaCasa === true)
    out.push("IVA 4% prima casa: serve la dichiarazione scritta del cliente sui requisiti, e la casa non deve essere di lusso (A/1, A/8, A/9).");
  if (o === "nuova_costruzione" && f.contesto.primaCasa === false) out.push("IVA 10% sulle nuove costruzioni: vale per le case non di lusso. Controlla la categoria catastale.");
  if ((o === "abitazione" || o === "non_abitativo") && l === "barriere")
    out.push("IVA 4% per le barriere architettoniche: serve un contratto d'appalto e opere conformi al DM 236/1989. La sola vendita con posa non basta.");
  if ((o === "abitazione" || o === "non_abitativo") && l === "ristrutturazione") out.push("IVA 10% per ristrutturazione: serve il titolo edilizio (CILA, SCIA o permesso di costruire).");
  if (o === "esterno") out.push("Giardini e aree esterne: IVA 22%. Le opere murarie su un'area di pertinenza dell'abitazione possono andare al 10%: verifica con il commercialista.");
  if (inversioneAttiva(f))
    out.push(
      f.contesto.inversione === "subappalto"
        ? "Inversione contabile per subappalto edile: vale se il cliente è un'impresa di costruzioni o l'appaltatore principale del lavoro."
        : "Inversione contabile per pulizia, demolizione, impianti o completamento: vale solo se il lavoro riguarda un edificio.",
    );
  if (f.contesto.cliente === "condominio" && f.profilo.regime === "ordinario" && !f.profilo.ritenuta)
    out.push("Il condominio trattiene il 4% a titolo di acconto: il netto che incassi è più basso del totale.");
  return out;
}

const round = Math.round;

export function riepilogoFiscale(f: Fisco, righe: RigaFiscale[]): Riepilogo | null {
  if (mancanzeFiscali(f, righe).length > 0 || righe.some((r) => r.importoCents === null)) return null;
  const p: ProfiloFiscale = f.profilo;
  const cliente = f.contesto.cliente!;
  const compenso = righe.reduce((s, r) => s + r.importoCents!, 0);
  const rivalsa = p.rivalsaInps ? round(compenso * 0.04) : 0;
  const sostituto = cliente === "impresa" || cliente === "condominio" || cliente === "pa";
  const diciture: string[] = [];
  const avvisi = [...avvisiContesto(f), ...p.avvisi];
  let beni = 0;

  // Le basi per gruppo, prima della rivalsa.
  const basi = new Map<CodiceGruppo, number>();
  const aggiungi = (k: CodiceGruppo, v: number) => basi.set(k, (basi.get(k) ?? 0) + v);
  if (p.regime === "forfettario") aggiungi("forfettario", compenso);
  else if (inversioneAttiva(f)) aggiungi("inversione", compenso);
  else {
    let edile10 = 0;
    righe.forEach((r) => {
      const a = aliquotaRiga(f, r).aliquota!;
      if (eBeneSignificativo(f, r)) beni += r.goodsValueCents!;
      if (a === "10" && aliquotaRiga(f, r).edile) edile10 += r.importoCents!;
      aggiungi(a, r.importoCents!);
    });
    // Beni significativi: il 10% vale sul bene fino alla differenza fra il valore dell'intervento e il valore
    // dei beni; l'eccedenza va al 22% (esempio dell'Agenzia: 10.000 con beni per 6.000 → 8.000 al 10%, 2.000 al 22%).
    const eccedenza = Math.max(0, 2 * beni - edile10);
    if (eccedenza > 0) {
      basi.set("10", (basi.get("10") ?? 0) - eccedenza);
      aggiungi("22", eccedenza);
    }
  }

  // La rivalsa si divide fra i gruppi in proporzione: segue la loro aliquota.
  const chiavi = ORDINE.filter((k) => (basi.get(k) ?? 0) > 0);
  let restante = rivalsa;
  const gruppi: Gruppo[] = chiavi.map((k, i) => {
    const base = basi.get(k)!;
    const quota = i === chiavi.length - 1 ? restante : round((rivalsa * base) / compenso);
    restante -= quota;
    const imponibile = base + quota;
    const percento = k === "inversione" || k === "forfettario" ? 0 : PERCENTO[k];
    const natura = k === "esente" ? "N4" : k === "forfettario" ? "N2.2" : k === "inversione" ? (f.contesto.inversione === "subappalto" ? "N6.3" : "N6.7") : null;
    return { codice: k, percento, imponibileCents: imponibile, ivaCents: round((imponibile * percento) / 100), natura };
  });
  const iva = gruppi.reduce((s, g) => s + g.ivaCents, 0);

  // Bollo da 2 € sulle somme senza IVA sopra 77,47 € (forfettario ed esenti; non sull'inversione contabile).
  const senzaIva = gruppi.filter((g) => g.codice === "forfettario" || g.codice === "esente").reduce((s, g) => s + g.imponibileCents, 0);
  const bollo = senzaIva > 7747 ? 200 : 0;

  // Ritenute: nessuna per il forfettario.
  let ritenuta: Riepilogo["ritenuta"] = null;
  if (p.regime === "ordinario" && p.ritenuta && sostituto) ritenuta = { percento: 20, baseCents: compenso + rivalsa, importoCents: round((compenso + rivalsa) * 0.2) };
  else if (p.regime === "ordinario" && cliente === "condominio") ritenuta = { percento: 4, baseCents: compenso, importoCents: round(compenso * 0.04) };

  const scissione = cliente === "pa" && p.regime === "ordinario" && !p.ritenuta && !inversioneAttiva(f) && iva > 0;
  const totale = compenso + rivalsa + iva + bollo;
  const netto = totale - (scissione ? iva : 0) - (ritenuta?.importoCents ?? 0);

  // Diciture del documento.
  if (p.regime === "forfettario") {
    diciture.push("Operazione effettuata ai sensi dell'art. 1, commi da 54 a 89, della Legge n. 190/2014 (regime forfettario): senza applicazione dell'IVA.");
    if (sostituto) diciture.push("Compenso non soggetto a ritenuta d'acconto ai sensi dell'art. 1, comma 67, della Legge n. 190/2014.");
  } else if (inversioneAttiva(f)) {
    diciture.push(
      f.contesto.inversione === "subappalto"
        ? "Operazione soggetta a inversione contabile ai sensi dell'art. 17, comma 6, lettera a), del DPR 633/1972: l'IVA è a carico del committente."
        : "Operazione soggetta a inversione contabile ai sensi dell'art. 17, comma 6, lettera a-ter), del DPR 633/1972: l'IVA è a carico del committente.",
    );
  } else {
    for (const g of gruppi) {
      if (g.codice === "esente") diciture.push(`Operazione esente da IVA ai sensi dell'${p.esenzione ?? "art. 10 del DPR 633/1972"}.`);
      else if (g.codice === "10" || g.codice === "4") {
        const d = dicituraEdile(f, g.codice);
        if (d) diciture.push(d);
      }
    }
    if (beni > 0) diciture.push(`Valore dei beni significativi compresi nell'intervento (DM 29/12/1999): ${(beni / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR", useGrouping: "always" })}.`);
    if (scissione) diciture.push("Scissione dei pagamenti ai sensi dell'art. 17-ter del DPR 633/1972: l'IVA è versata dall'ente committente.");
  }
  if (rivalsa > 0) diciture.push("Rivalsa INPS 4% ai sensi dell'art. 1, comma 212, della Legge n. 662/1996.");
  if (bollo > 0) diciture.push("Imposta di bollo di 2,00 € sulle somme non soggette a IVA, addebitata al cliente.");
  if (ritenuta?.percento === 20) diciture.push("Ritenuta d'acconto del 20% ai sensi dell'art. 25 del DPR 600/1973, operata dal cliente.");
  if (ritenuta?.percento === 4) diciture.push("Ritenuta del 4% a titolo di acconto ai sensi dell'art. 25-ter del DPR 600/1973, operata dal condominio.");

  return {
    imponibileCents: compenso,
    rivalsaCents: rivalsa,
    gruppi,
    ivaCents: iva,
    bolloCents: bollo,
    totaleCents: totale,
    scissione,
    ritenuta,
    nettoCents: netto,
    beniSignificativiCents: beni,
    diciture,
    avvisi: [...new Set(avvisi)],
  };
}
