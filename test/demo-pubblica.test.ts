import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { POST as candidatura } from "@/app/api/candidatura/route";
import { POST as elabora } from "@/app/api/elabora/route";
import Home from "@/app/page";
import { codiceValido } from "@/lib/preventivi/http";

afterEach(() => {
  delete process.env.PROVA_CODICE;
  delete process.env.CANDIDATURE_APERTE;
});

describe("codice d'accesso della demo", () => {
  it("senza PROVA_CODICE non serve", () => {
    expect(codiceValido(undefined, undefined)).toBe(true);
  });
  it("con PROVA_CODICE pretende quello giusto", () => {
    expect(codiceValido("cantiere-42", "cantiere-42")).toBe(true);
    expect(codiceValido(" cantiere-42 ", "cantiere-42")).toBe(true);
    expect(codiceValido("cantiere-41", "cantiere-42")).toBe(false);
    expect(codiceValido(undefined, "cantiere-42")).toBe(false);
  });
  it("/api/elabora rifiuta senza codice prima di chiamare Claude", async () => {
    process.env.PROVA_CODICE = "cantiere-42";
    const res = await elabora(
      new Request("http://localhost/api/elabora", {
        method: "POST",
        headers: { "x-forwarded-for": "203.0.113.9" },
        body: JSON.stringify({ testo: "Bagno della signora Rossi, rifacimento completo." }),
      }),
    );
    expect(res.status).toBe(401);
  });
});

describe("home: pilota aperto, demo solo su richiesta", () => {
  it("senza CANDIDATURE_APERTE: home di vendita con il modulo e nessun riferimento tecnico", async () => {
    const html = renderToStaticMarkup(await Home());
    expect(html).toContain('id="candidatura"');
    expect(html).not.toContain("Progetto dimostrativo");
    for (const parola of [/github/i, /twilio/i, /href="\/progetto"/]) expect(html).not.toMatch(parola);
  });
  it("con CANDIDATURE_APERTE=0 torna la demo: banner, niente modulo, CTA verso la prova", async () => {
    process.env.CANDIDATURE_APERTE = "0";
    const html = renderToStaticMarkup(await Home());
    expect(html).toContain("Progetto dimostrativo");
    expect(html).toContain('href="/prova"');
    expect(html).not.toContain('id="candidatura"');
    expect(html).not.toContain("application/ld+json");
    for (const parola of [/github/i, /twilio/i]) expect(html).not.toMatch(parola);
  });
  it("nella demo il modulo di candidatura è spento", async () => {
    process.env.CANDIDATURE_APERTE = "0";
    const res = await candidatura(new Request("http://localhost/api/candidatura", { method: "POST" }));
    expect(res.status).toBe(404);
  });
});
