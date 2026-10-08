import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined, set: () => {}, delete: () => {} }) }));

import { costruisciRighe, leggiCsv, mappaConRegole, prezzoDa, trovaIntestazione, unitaDa } from "@/lib/impresa/importa";
import { DatiImpresa, DatiVoce, ibanValido, partitaIvaValida, primoErrore } from "@/lib/impresa/schema";
import { creaToken, leggiToken } from "@/lib/impresa/sessione";
import { descrizioneDi, tipoLogo } from "@/lib/impresa/imprese";
import { extractionSystem, EXTRACTION_SYSTEM } from "@/lib/motore/estrazione";
import { sicuro } from "@/lib/preventivi/pdf";
import { RigaPreventivo } from "@/lib/preventivi/modello";

// L'area delle imprese: le parti che non toccano il database. Dati inventati.

describe("partita IVA e IBAN", () => {
  it("riconosce la cifra di controllo", () => {
    expect(partitaIvaValida("01234567897")).toBe(true);
    expect(partitaIvaValida("01234567890")).toBe(false);
    expect(partitaIvaValida("1234567897")).toBe(false);
  });
  it("controlla l'IBAN con il modulo 97", () => {
    expect(ibanValido("IT60 X054 2811 1010 0000 0123 456")).toBe(true);
    expect(ibanValido("IT60X0542811101000000123457")).toBe(false);
  });
  it("valida il modulo dell'impresa e spiega il primo errore", () => {
    const base = {
      ragione_sociale: "Edil Prova srl",
      piva: "IT 01234567897",
      cf: "",
      indirizzo: "via Roma 1, Monza",
      telefono: "039 000000",
      email: "Info@Esempio.it",
      iban: "",
      condizioni_pagamento: "",
      validita_giorni: "30",
      mestieri: ["Muratore"],
    };
    const ok = DatiImpresa.parse(base);
    expect(ok).toMatchObject({ piva: "01234567897", email: "info@esempio.it", iban: null, cf: null, validita_giorni: 30 });
    const ko = DatiImpresa.safeParse({ ...base, piva: "01234567890" });
    expect(ko.success).toBe(false);
    expect(primoErrore(ko.error!)).toBe("Partita IVA non valida");
  });
});

describe("voci del listino", () => {
  const voce = { codice: "A.01/2", nome: "Rasatura pareti", descrizione: null, unita: "m2", prezzo_cents: 1250, categoria: null, sinonimi: [], bene_significativo: false, fornibile_dal_cliente: false };
  it("accetta i codici delle imprese, non quelli con spazi o simboli", () => {
    expect(DatiVoce.safeParse(voce).success).toBe(true);
    expect(DatiVoce.safeParse({ ...voce, codice: "A 01" }).success).toBe(false);
    expect(DatiVoce.safeParse({ ...voce, codice: "<x>" }).success).toBe(false);
  });
  it("le righe del preventivo accettano gli stessi codici", () => {
    const r = { work: "Rasatura", spoken: "", quantity: 2, unit: "corpo", unitPriceCents: 100, code: "A.01/2", priceSource: "listino", flag: null, significantGood: false, goodsValueCents: null, addToPriceList: false };
    expect(RigaPreventivo.safeParse(r).success).toBe(true);
  });
});

describe("import da CSV ed Excel", () => {
  const csv = [
    "Listino 2026 - Edil Prova;;;;",
    ";;;;",
    "Codice;Descrizione lavorazione;U.M.;Prezzo unitario;Note",
    "DEMOLIZIONI;;;;",
    'A.01;"Demolizione tramezzo; forati da 8";mq;€ 18,50;',
    "A.02;Rimozione sanitario;n.;45;",
    "A.03;Posa piastrelle;metri quadri;1.234,00;",
    ";Assistenza muraria;a corpo;300;",
    "A.05;Voce senza unità;boh;12;",
    "A.01;Codice ripetuto;ml;10;",
  ].join("\r\n");

  it("legge il CSV con punto e virgola e virgolette", () => {
    const t = leggiCsv(csv);
    expect(t[4]).toEqual(["A.01", "Demolizione tramezzo; forati da 8", "mq", "€ 18,50", null]);
  });

  it("trova l'intestazione, le colonne e costruisce le righe", () => {
    const t = leggiCsv(csv).filter((r) => r.some((c) => c !== null));
    const h = trovaIntestazione(t);
    expect(h).toBe(1);
    const m = mappaConRegole(t[h]);
    expect(m).toMatchObject({ codice: 0, nome: 1, unita: 2, prezzo: 3 });
    const righe = costruisciRighe(t, h, m);
    expect(righe.map((r) => r.codice)).toEqual(["A.01", "A.02", "A.03", "V-0001", "A.05", "V-0002"]);
    expect(righe[0]).toMatchObject({ nome: "Demolizione tramezzo; forati da 8", unita: "m2", prezzo_cents: 1850, problemi: [] });
    expect(righe[2]).toMatchObject({ unita: "m2", prezzo_cents: 123400 });
    expect(righe[3]).toMatchObject({ unita: "corpo", prezzo_cents: 30000 });
    expect(righe[4].problemi).toEqual(["unità «boh» non riconosciuta"]);
    expect(righe[5].problemi[0]).toMatch(/ripetuto/);
  });

  it("normalizza unità e prezzi scritti in tanti modi", () => {
    expect(["mq", "MQ", "m²", "ml", "Nr.", "pz", "ore", "q.li", "lt", "forfait"].map(unitaDa)).toEqual([
      "m2", "m2", "m2", "m", "cad", "cad", "h", "100kg", "l", "corpo",
    ]);
    expect(["al metro", "€/ora", "euro al mq", "per pezzo", "a corpo", "all'ora"].map(unitaDa)).toEqual(["m", "h", "m2", "cad", "corpo", "h"]);
    expect([12.5, "12,50", "1.234,56", "1,234.56", "€ 7", "1.000", "abc", "", -3].map(prezzoDa)).toEqual([
      1250, 1250, 123456, 123456, 700, 100000, null, null, null,
    ]);
  });
});

describe("sessione dell'area", () => {
  process.env.SESSIONE_SEGRETO = "segreto-di-prova-abbastanza-lungo";
  it("firma e rilegge il cookie; respinge firme cambiate e scadute", () => {
    const t = creaToken("u-1", "a@b.it", 1_000_000);
    expect(leggiToken(t, 1_000_000)).toMatchObject({ userId: "u-1", email: "a@b.it" });
    const [dati] = t.split(".");
    const falso = Buffer.from(JSON.stringify({ u: "u-2", e: "a@b.it", x: 9e9 })).toString("base64url");
    expect(leggiToken(`${falso}.${t.split(".")[1]}`, 1_000_000)).toBeNull();
    expect(leggiToken(`${dati}.xxx`, 1_000_000)).toBeNull();
    expect(leggiToken(t, 1_000_000 + 31 * 86_400_000)).toBeNull();
  });
});

describe("dettagli dell'impresa", () => {
  it("riconosce i loghi dai byte, non dal nome", () => {
    expect(tipoLogo(new Uint8Array([0x89, 0x50, 0x4e, 0x47, ...Array(20).fill(0)]))).toBe("image/png");
    expect(tipoLogo(new Uint8Array([0xff, 0xd8, 0xff, ...Array(20).fill(0)]))).toBe("image/jpeg");
    expect(tipoLogo(new TextEncoder().encode("<svg onload=alert(1)></svg>"))).toBeNull();
  });
  it("dice al motore chi è l'impresa", () => {
    const d = descrizioneDi({ ragione_sociale: "Edil Prova srl", mestieri: ["Impresa edile", "Idraulico"] });
    expect(d).toBe("Edil Prova srl, impresa edile italiana (idraulico)");
    expect(extractionSystem(d)).toContain("Sei l'assistente di Edil Prova srl");
    expect(extractionSystem()).toBe(EXTRACTION_SYSTEM);
  });
  it("il PDF non si rompe con caratteri fuori da Windows-1252", () => {
    expect(sicuro("Bagno 🛁 – 3×2 m² “ok”\tŁ")).toBe("Bagno ? – 3×2 m² “ok” ?");
  });
});

describe("posti del programma pilota", () => {
  it("conta i posti liberi senza andare sotto zero", async () => {
    const { postiLiberi, etichettaPosti } = await import("@/lib/impresa/posti");
    expect(postiLiberi(0)).toBe(10);
    expect(postiLiberi(3)).toBe(7);
    expect(postiLiberi(12)).toBe(0);
    expect(postiLiberi(-1)).toBe(10);
    expect(etichettaPosti(7)).toBe("7 posti liberi su 10");
    expect(etichettaPosti(1)).toBe("Ultimo posto su 10");
    expect(etichettaPosti(0)).toBe("Posti esauriti");
  });
});

describe("prova su WhatsApp", () => {
  it("apre la chat del numero di prova con la parola di accesso già scritta", async () => {
    const { linkWhatsAppProva } = await import("@/lib/sito");
    expect(linkWhatsAppProva()).toBe("https://wa.me/14155238886?text=join%20law-valuable");
  });
});

describe("listino da PDF e foto", () => {
  it("riconosce il tipo di file dai byte", async () => {
    const { tipoFile } = await import("@/lib/impresa/importa");
    expect(tipoFile(new TextEncoder().encode("%PDF-1.7 ..."))).toBe("application/pdf");
    expect(tipoFile(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0]))).toBe("image/png");
    expect(tipoFile(new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0]))).toBe("image/jpeg");
    expect(tipoFile(new TextEncoder().encode("Codice;Voce;Prezzo\nA;B;1"))).toBe("foglio");
    expect(tipoFile(new Uint8Array([0x00, 0x01, 0x02, 0x03]))).toBeNull();
  });

  it("manda PDF e foto a Claude e ne fa righe da controllare, con le note", async () => {
    const { leggiConAI, costruisciRighe } = await import("@/lib/impresa/importa");
    let ricevuto: unknown = null;
    const call = async (c: { user: unknown }) => {
      ricevuto = c.user;
      return {
        input: {
          voci: [
            ["A.01", "Demolizione piastrelle", "mq", "18,50", ""],
            ["", "Posa sanitario", "cad", "", "prezzo poco leggibile"],
            ["", "Assistenza muraria", "a corpo", "300", "prezzo calcolato: totale diviso quantità"],
            ["", "", "", "", ""],
          ],
        },
        inputTokens: 1,
        outputTokens: 1,
      };
    };
    const pdf = { nome: "listino.pdf", bytes: new TextEncoder().encode("%PDF-1.7 finto") };
    const foto = { nome: "foto.jpg", bytes: new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]) };
    const { tabella, note } = await leggiConAI([pdf, foto], call);
    const blocchi = ricevuto as Array<{ type: string }>;
    expect(blocchi.map((b) => b.type)).toEqual(["document", "image", "text"]);
    expect(tabella).toHaveLength(4);
    const righe = costruisciRighe(tabella, 0, { codice: 0, nome: 1, unita: 2, prezzo: 3 }).map((r) =>
      note.has(r.n) ? { ...r, problemi: [...r.problemi, note.get(r.n)!] } : r,
    );
    expect(righe[0]).toMatchObject({ codice: "A.01", unita: "m2", prezzo_cents: 1850, problemi: [] });
    expect(righe[1].problemi).toEqual(["prezzo non leggibile", "prezzo poco leggibile"]);
    expect(righe[2]).toMatchObject({ unita: "corpo", prezzo_cents: 30000 });
    expect(righe[2].problemi).toEqual(["prezzo calcolato: totale diviso quantità"]);
  });

  it("rifiuta i file che non sono PDF né foto", async () => {
    const { leggiConAI } = await import("@/lib/impresa/importa");
    const call = async () => ({ input: { voci: [] }, inputTokens: 0, outputTokens: 0 });
    await expect(leggiConAI([{ nome: "x.zip", bytes: new Uint8Array([0x50, 0x4b, 0x03, 0x04]) }], call)).rejects.toThrow(/non è un PDF/);
  });
});
