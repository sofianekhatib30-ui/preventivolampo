import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { POST as accetta } from "@/app/api/accetta/[token]/route";
import { POST as approvaRoute } from "@/app/api/preventivi/[id]/approva/route";
import { GET as pdfRoute } from "@/app/api/preventivi/[id]/pdf/route";
import { PUT as aggiorna } from "@/app/api/preventivi/[id]/route";
import type { ToolCaller } from "@/lib/motore/claude";
import { leggi } from "@/lib/preventivi/archivio";
import { conti } from "@/lib/preventivi/calcolo";
import { creaDaTesto } from "@/lib/preventivi/servizio";

// Da bozza a PDF e accettazione del cliente, passando dalle route. Claude è un finto; dati inventati.

let dir: string;
beforeAll(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "preventivi-"));
  process.env.PREVENTIVI_DIR = path.join(dir, "preventivi");
});
afterAll(async () => {
  delete process.env.PREVENTIVI_DIR;
  await rm(dir, { recursive: true, force: true });
});

const fake: ToolCaller = async ({ tool }) =>
  tool.name === "registra_sopralluogo"
    ? {
        input: {
          customer: { name: "Colombo", address: "via Bergamo 14, Monza" },
          vat: { dwelling: true, intervention: "manutenzione_straordinaria", goodsBoughtBy: null },
          lines: [
            { spoken: "togliamo il water", work: "rimozione vaso", quantity: 1, unit: "cad", quantityNote: null, clientSuppliesMaterial: false },
            { spoken: "mettiamo il water a terra", work: "vaso a pavimento", quantity: 1, unit: "cad", quantityNote: null, clientSuppliesMaterial: false },
            { spoken: "il rivestimento, non so quanto", work: "rivestimento pareti gres 20x20", quantity: null, unit: "m2", quantityNote: null, clientSuppliesMaterial: false },
            { spoken: "sistemo la mensola", work: "fissaggio mensola", quantity: 1, unit: "cad", quantityNote: null, clientSuppliesMaterial: false },
          ],
          exclusions: ["Pavimento: da definire"],
          notes: [],
        },
        inputTokens: 100,
        outputTokens: 50,
      }
    : {
        input: {
          choices: [
            { index: 0, code: "DEM-08", confidence: 0.95, reason: "rimozione sanitario" },
            { index: 1, code: "BAG-01", confidence: 0.95, reason: "vaso a pavimento" },
            { index: 2, code: "BAG-12", confidence: 0.9, reason: "gres 20x20" },
            { index: 3, code: null, confidence: 0.1, reason: "nessuna voce" },
          ],
        },
        inputTokens: 100,
        outputTokens: 50,
      };

const req = (body: unknown, method = "POST") =>
  new Request("http://localhost/x", { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

describe("preventivo da bozza a PDF", () => {
  it("non si approva finché mancano risposte; poi PDF, link al cliente e accettazione", async () => {
    const p = await creaDaTesto("Sopralluogo inventato dalla sciura Colombo, bagno da sistemare.", fake);
    expect(p.righe[3].flag).toMatch(/Da prezzare/);
    const ctx = { params: Promise.resolve({ id: p.id }) };

    // Mancano: quantità del rivestimento, prezzo della mensola, chi compra i materiali, valore dei beni.
    const prima = await approvaRoute(req({}), ctx);
    expect(prima.status).toBe(422);

    const righe = p.righe.map((r) => ({ ...r }));
    righe[2].quantity = 16;
    righe[3].unitPriceCents = 2500; // prezzo dell'artigiano
    righe[3].addToPriceList = true;
    righe[1].goodsValueCents = 15000; // valore del vaso
    const put = await aggiorna(req({ cliente: p.cliente, iva: { ...p.iva, goodsBoughtBy: "impresa" }, righe, esclusioni: p.esclusioni }, "PUT"), ctx);
    expect(put.status).toBe(200);

    const salvato = (await leggi(p.id))!;
    expect(salvato.righe[3].priceSource).toBe("artigiano");
    expect(salvato.righe[1].priceSource).toBe("listino");
    const c = conti(salvato)!;
    expect(c.regime).toBe("agevolata_10_beni_significativi");
    expect(c.at10Cents + c.at22Cents).toBe(c.taxableCents);

    const ok = await approvaRoute(req({}), ctx);
    expect(ok.status).toBe(200);
    const { pdf, accettazione } = await ok.json();
    expect(pdf).toBe(`/api/preventivi/${p.id}/pdf`);

    // Dopo l'approvazione la bozza non si tocca più.
    const tardi = await aggiorna(req({ cliente: p.cliente, iva: salvato.iva, righe, esclusioni: [] }, "PUT"), ctx);
    expect(tardi.status).toBe(409);

    const res = await pdfRoute(new Request("http://localhost/x"), ctx);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    const doc = await PDFDocument.load(new Uint8Array(await res.arrayBuffer()));
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(doc.getTitle()).toBe(`Preventivo ${salvato.numero}`);

    const token = accettazione.split("/").pop();
    expect(token).not.toBe(p.id);
    const corto = await accetta(req({ nome: "x" }), { params: Promise.resolve({ token }) });
    expect(corto.status).toBe(400);
    const si = await accetta(req({ nome: "Maria Colombo", esito: "accettato" }), { params: Promise.resolve({ token }) });
    expect(si.status).toBe(200);
    expect((await leggi(p.id))!.stato).toBe("accettato");
    const di_nuovo = await accetta(req({ nome: "Maria Colombo" }), { params: Promise.resolve({ token }) });
    expect(di_nuovo.status).toBe(409);

    // Listino che impara: la riga prezzata a mano è una proposta, non una voce del listino.
    const proposte = JSON.parse(await readFile(path.join(dir, "proposte", `${salvato.numero}.json`), "utf8"));
    expect(proposte[0]).toMatchObject({ prezzoCents: 2500, daPreventivo: salvato.numero });
  });

  it("un id inventato non apre niente", async () => {
    const res = await pdfRoute(new Request("http://localhost/x"), { params: Promise.resolve({ id: "../../etc/passwd" }) });
    expect(res.status).toBe(404);
  });
});
