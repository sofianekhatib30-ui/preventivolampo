import { describe, expect, it } from "vitest";
import { aliquotaEdile, DOMANDE, mancanzeFiscali, riepilogoFiscale, type RigaFiscale } from "@/lib/fisco/conti";
import { profiloDa } from "@/lib/fisco/profilo";
import { CONTESTO_VUOTO, PROFILO_EDILE, type ContestoFiscale, type Fisco, type ProfiloFiscale } from "@/lib/fisco/schema";
import { normalizzaMestieri } from "@/lib/impresa/mestieri";

// Il fisco del preventivo sui casi della ricerca del 10/10/2026: IVA per lavoro e per riga, beni significativi
// con l'esempio dell'Agenzia, inversione contabile, scissione dei pagamenti, ritenute, forfettario.

const riga = (euro: number, extra: Partial<RigaFiscale> = {}): RigaFiscale => ({
  importoCents: euro * 100,
  significantGood: false,
  code: "X-1",
  goodsValueCents: null,
  ...extra,
});
const fisco = (contesto: Partial<ContestoFiscale>, profilo: Partial<ProfiloFiscale> = {}): Fisco => ({
  contesto: { ...CONTESTO_VUOTO, cliente: "privato", ...contesto },
  profilo: { ...PROFILO_EDILE, ...profilo },
});
const casa = { oggetto: "abitazione", lavoro: "manutenzione_straordinaria", materiali: "impresa" } as const;

describe("IVA edile per lavoro", () => {
  it("manutenzione su abitazione con beni significativi: l'esempio dell'Agenzia (10.000, beni 6.000)", () => {
    const r = riepilogoFiscale(fisco(casa), [riga(4000), riga(6000, { significantGood: true, goodsValueCents: 600000 })])!;
    expect(r.gruppi.map((g) => [g.codice, g.imponibileCents])).toEqual([
      ["22", 200000],
      ["10", 800000],
    ]);
    expect(r.ivaCents).toBe(44000 + 80000);
    expect(r.beniSignificativiCents).toBe(600000);
    expect(r.diciture.join(" ")).toMatch(/L\. 488\/1999/);
    expect(r.diciture.join(" ")).toMatch(/beni significativi/);
  });

  it("il valore del bene significativo si chiede, e non può superare la riga", () => {
    const f = fisco(casa);
    expect(mancanzeFiscali(f, [riga(500, { significantGood: true })])).toEqual([{ riga: 0, testo: DOMANDE.valoreBene }]);
    expect(mancanzeFiscali(f, [riga(500, { significantGood: true, goodsValueCents: 60000 })])).toEqual([{ riga: 0, testo: DOMANDE.valoreSupera }]);
    // Con i materiali del cliente i beni significativi non contano.
    expect(mancanzeFiscali(fisco({ ...casa, materiali: "cliente" }), [riga(500, { significantGood: true })])).toEqual([]);
  });

  it("aliquote secondo immobile e lavoro", () => {
    const a = (c: Partial<ContestoFiscale>) => aliquotaEdile(fisco(c));
    expect(a({ oggetto: "non_abitativo", lavoro: "manutenzione_ordinaria" })).toBe("22");
    expect(a({ oggetto: "non_abitativo", lavoro: "ristrutturazione" })).toBe("10");
    expect(a({ oggetto: "abitazione", lavoro: "barriere" })).toBe("4");
    expect(a({ oggetto: "non_abitativo", lavoro: "fotovoltaico" })).toBe("10");
    expect(a({ oggetto: "nuova_costruzione", primaCasa: true })).toBe("4");
    expect(a({ oggetto: "nuova_costruzione", primaCasa: false })).toBe("10");
    expect(a({ oggetto: "esterno" })).toBe("22");
    expect(a({ oggetto: "nuova_costruzione" })).toBeNull();
  });

  it("le domande arrivano in ordine e solo quando servono", () => {
    expect(mancanzeFiscali(fisco({ cliente: null }), [riga(100)]).map((m) => m.testo)).toEqual([DOMANDE.cliente, DOMANDE.oggetto]);
    expect(mancanzeFiscali(fisco({ oggetto: "abitazione" }), [riga(100)]).map((m) => m.testo)).toEqual([DOMANDE.lavoro]);
    expect(mancanzeFiscali(fisco({ oggetto: "abitazione", lavoro: "manutenzione_ordinaria" }), [riga(100)]).map((m) => m.testo)).toEqual([DOMANDE.materiali]);
    expect(mancanzeFiscali(fisco({ oggetto: "nuova_costruzione" }), [riga(100)]).map((m) => m.testo)).toEqual([DOMANDE.primaCasa]);
    // Tutte le righe hanno un'aliquota propria: niente domande sull'immobile.
    expect(mancanzeFiscali(fisco({}), [riga(100, { aliquota: "10" })])).toEqual([]);
    // Chi non lavora sugli edifici non risponde a quelle domande.
    expect(mancanzeFiscali(fisco({}, { edifici: false }), [riga(100)])).toEqual([]);
  });

  it("una riga con l'aliquota propria resta sua anche in un lavoro sulla casa (fiori al 10% in un lavoro al 22%)", () => {
    const r = riepilogoFiscale(fisco({ oggetto: "non_abitativo", lavoro: "manutenzione_ordinaria" }), [riga(100), riga(50, { aliquota: "10" })])!;
    expect(r.gruppi.map((g) => [g.codice, g.ivaCents])).toEqual([
      ["22", 2200],
      ["10", 500],
    ]);
  });

  it("4% prima casa e 10% ristrutturazione portano il loro avviso", () => {
    const r = riepilogoFiscale(fisco({ oggetto: "nuova_costruzione", primaCasa: true }), [riga(1000)])!;
    expect(r.gruppi[0]).toMatchObject({ codice: "4", ivaCents: 4000 });
    expect(r.avvisi.join(" ")).toMatch(/dichiarazione scritta/);
    expect(r.diciture.join(" ")).toMatch(/n\. 39/);
    const s = riepilogoFiscale(fisco({ oggetto: "abitazione", lavoro: "ristrutturazione" }), [riga(1000)])!;
    expect(s.avvisi.join(" ")).toMatch(/titolo edilizio/);
  });
});

describe("cliente e regimi", () => {
  it("impresa: si chiede l'inversione contabile; in subappalto niente IVA (N6.3)", () => {
    const f = fisco({ ...casa, cliente: "impresa" });
    expect(mancanzeFiscali(f, [riga(1000)]).map((m) => m.testo)).toEqual([DOMANDE.inversione]);
    const r = riepilogoFiscale({ ...f, contesto: { ...f.contesto, inversione: "subappalto" } }, [riga(1000)])!;
    expect(r.gruppi).toEqual([{ codice: "inversione", percento: 0, imponibileCents: 100000, ivaCents: 0, natura: "N6.3" }]);
    expect(r.totaleCents).toBe(100000);
    expect(r.diciture[0]).toMatch(/lettera a\)/);
    const t = riepilogoFiscale({ ...f, contesto: { ...f.contesto, inversione: "no" } }, [riga(1000)])!;
    expect(t.ivaCents).toBe(10000);
  });

  it("pulizie di edifici per un'impresa: lettera a-ter (N6.7)", () => {
    const f = fisco({ cliente: "impresa", inversione: "edificio" }, { edifici: false, pulizie: true });
    const r = riepilogoFiscale(f, [riga(300)])!;
    expect(r.gruppi[0].natura).toBe("N6.7");
    expect(r.diciture[0]).toMatch(/a-ter/);
  });

  it("ente pubblico: scissione dei pagamenti, il netto è senza IVA", () => {
    const r = riepilogoFiscale(fisco({ cliente: "pa" }, { edifici: false }), [riga(1000)])!;
    expect(r.scissione).toBe(true);
    expect(r.totaleCents).toBe(122000);
    expect(r.nettoCents).toBe(100000);
  });

  it("condominio: ritenuta del 4% sull'imponibile", () => {
    const r = riepilogoFiscale(fisco({ ...casa, cliente: "condominio" }), [riga(1000)])!;
    expect(r.ritenuta).toEqual({ percento: 4, baseCents: 100000, importoCents: 4000 });
    expect(r.nettoCents).toBe(110000 - 4000);
  });

  it("forfettario: niente IVA, bollo da 2 € sopra 77,47 €, niente ritenute", () => {
    const f = fisco({ cliente: "condominio" }, { regime: "forfettario" });
    expect(mancanzeFiscali(f, [riga(100)])).toEqual([]);
    const r = riepilogoFiscale(f, [riga(100)])!;
    expect(r).toMatchObject({ ivaCents: 0, bolloCents: 200, totaleCents: 10200, nettoCents: 10200, ritenuta: null });
    expect(r.gruppi[0]).toMatchObject({ codice: "forfettario", natura: "N2.2" });
    expect(r.diciture.join(" ")).toMatch(/190\/2014/);
    expect(r.diciture.join(" ")).toMatch(/comma 67/);
    expect(riepilogoFiscale(f, [riga(70)])!.bolloCents).toBe(0);
  });

  it("lavoratore autonomo con rivalsa INPS e cliente impresa: 1.000 € → rivalsa 40, IVA 228,80, ritenuta 208", () => {
    const r = riepilogoFiscale(fisco({ cliente: "impresa" }, { edifici: false, ritenuta: true, rivalsaInps: true }), [riga(1000)])!;
    expect(r).toMatchObject({ rivalsaCents: 4000, ivaCents: 22880, totaleCents: 126880, nettoCents: 126880 - 20800 });
    expect(r.ritenuta).toEqual({ percento: 20, baseCents: 104000, importoCents: 20800 });
    // Con un privato niente ritenuta.
    expect(riepilogoFiscale(fisco({}, { edifici: false, ritenuta: true }), [riga(1000)])!.ritenuta).toBeNull();
  });

  it("ripetizioni esenti: bollo e riferimento normativo", () => {
    const profilo = profiloDa({ regime_fiscale: "ordinario", ritenuta: false, rivalsa_inps: false, mestieri: ["Ripetizioni e lezioni private"] });
    const r = riepilogoFiscale({ contesto: { ...CONTESTO_VUOTO, cliente: "privato" }, profilo }, [riga(100)])!;
    expect(r.gruppi[0]).toMatchObject({ codice: "esente", natura: "N4", ivaCents: 0 });
    expect(r.bolloCents).toBe(200);
    expect(r.diciture.join(" ")).toMatch(/art\. 10, n\. 20/);
  });
});

describe("profilo dell'impresa dai mestieri", () => {
  it("catering: 10% su tutto, nessuna domanda sull'immobile", () => {
    const p = profiloDa({ regime_fiscale: "ordinario", ritenuta: false, rivalsa_inps: false, mestieri: ["Catering"] });
    expect(p).toMatchObject({ edifici: false, aliquotaBase: "10" });
    expect(p.avvisi[0]).toMatch(/somministrazione/);
  });

  it("mestieri misti: 22% e avviso; un mestiere edile accende le domande sull'immobile", () => {
    const p = profiloDa({ regime_fiscale: "ordinario", ritenuta: false, rivalsa_inps: false, mestieri: ["Catering", "Fotografo e video"] });
    expect(p.aliquotaBase).toBe("22");
    expect(p.avvisi[0]).toMatch(/aliquote diverse/);
    expect(profiloDa({ regime_fiscale: "ordinario", ritenuta: false, rivalsa_inps: false, mestieri: ["Vetraio"] }).edifici).toBe(true);
    expect(profiloDa({ regime_fiscale: "ordinario", ritenuta: false, rivalsa_inps: false, mestieri: [] }).edifici).toBe(true);
    expect(profiloDa({ regime_fiscale: "ordinario", ritenuta: false, rivalsa_inps: false, mestieri: ["Pulizie"] })).toMatchObject({ edifici: false, pulizie: true });
  });

  it("i nomi di prima restano validi", () => {
    expect(normalizzaMestieri(["Termoidraulico", "Idraulico", "Restauro", "Inventato"])).toEqual(["Idraulico", "Restauro edifici"]);
  });
});

describe("avvertenze nelle lingue dell'interfaccia", () => {
  it("ogni avvertenza del codice si ritrova nel dizionario", async () => {
    const { avvisoIn } = await import("@/lib/i18n/avvisi");
    const { DIZIONARI } = await import("@/lib/i18n/dizionari");
    const { ELENCO_MESTIERI } = await import("@/lib/impresa/mestieri");
    const testi = [
      ...ELENCO_MESTIERI.flatMap((m) => ("avviso" in m && m.avviso ? [m.avviso] : [])),
      ...profiloDa({ regime_fiscale: "ordinario", ritenuta: false, rivalsa_inps: false, mestieri: ["Catering", "Fotografo e video"] }).avvisi,
      ...riepilogoFiscale(fisco({ cliente: "condominio", oggetto: "nuova_costruzione", primaCasa: true }), [riga(100)])!.avvisi,
    ];
    for (const t of testi) expect(avvisoIn(DIZIONARI.en, t), t).not.toBe(t);
    expect(avvisoIn(DIZIONARI.it, testi[0])).toBe(testi[0]);
  });
});

describe("rilievi della verifica del 11/10/2026", () => {
  it("un'inversione rimasta da prima non toglie l'IVA a un lavoro che non la prevede", () => {
    const f = fisco({ cliente: "impresa", oggetto: "esterno", inversione: "edificio" });
    expect(riepilogoFiscale(f, [riga(1000)])!.gruppi[0]).toMatchObject({ codice: "22", ivaCents: 22000 });
    const catering = fisco({ cliente: "impresa", inversione: "edificio" }, { edifici: false, pulizie: false, aliquotaBase: "10" });
    expect(riepilogoFiscale(catering, [riga(1000)])!.gruppi[0]).toMatchObject({ codice: "10", ivaCents: 10000 });
  });
  it("i fiori al 10% non prendono la dicitura della manutenzione", () => {
    const f = fisco({ oggetto: "non_abitativo", lavoro: "manutenzione_ordinaria" });
    expect(riepilogoFiscale(f, [riga(100), riga(50, { aliquota: "10" })])!.diciture.join(" ")).not.toMatch(/488\/1999/);
  });
});
