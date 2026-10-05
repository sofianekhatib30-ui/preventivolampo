import { describe, expect, it } from "vitest";
import {
  formDataToInput,
  normalizeItalianMobile,
  validateCandidatura,
} from "@/lib/candidatura/schema";

// Dati di prova inventati.
const valida = {
  nome: "Mario Prova",
  mestiere: "Idraulico",
  comune: "Lissone",
  telefono: "333 123 4567",
  volume: "da 3 a 5",
  privacy: "on",
};

describe("normalizeItalianMobile", () => {
  it.each([
    ["333 123 4567", "+393331234567"],
    ["+39 333.123.4567", "+393331234567"],
    ["0039-333-1234567", "+393331234567"],
    ["(333) 1234567", "+393331234567"],
    ["3331234567", "+393331234567"],
    ["333123456", "+39333123456"],
  ])("%s → %s", (raw, atteso) => {
    expect(normalizeItalianMobile(raw)).toBe(atteso);
  });

  it.each(["039 1234567", "02 1234 5678", "+44 7700 900123", "33312", "333abc4567", ""])(
    "rifiuta %s",
    (raw) => {
      expect(normalizeItalianMobile(raw)).toBeNull();
    },
  );
});

describe("validateCandidatura", () => {
  it("accetta una candidatura completa e normalizza il cellulare", () => {
    const r = validateCandidatura(valida);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data).toEqual({
      nome: "Mario Prova",
      mestiere: "Idraulico",
      comune: "Lissone",
      telefono: "+393331234567",
      volume: "da 3 a 5",
      privacy: "on",
    });
  });

  it("i preventivi a settimana sono facoltativi: vuoto o assente diventa undefined", () => {
    for (const volume of ["", undefined]) {
      const r = validateCandidatura({ ...valida, volume });
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.data.volume).toBeUndefined();
    }
  });

  it("toglie gli spazi ai bordi dei testi", () => {
    const r = validateCandidatura({ ...valida, nome: "  Mario Prova  ", comune: " Lissone " });
    expect(r.ok && r.data.nome).toBe("Mario Prova");
    expect(r.ok && r.data.comune).toBe("Lissone");
  });

  it.each(["nome", "mestiere", "comune", "telefono", "privacy"] as const)(
    "senza %s è invalida, con un errore proprio su quel campo",
    (campo) => {
      const { [campo]: _tolto, ...resto } = valida;
      void _tolto;
      const r = validateCandidatura(resto);
      expect(r.ok).toBe(false);
      if (r.ok) return;
      expect(Object.keys(r.errors)).toEqual([campo]);
      expect(r.errors[campo]).toMatch(/\S/);
    },
  );

  it("campi obbligatori fatti di soli spazi sono vuoti", () => {
    const r = validateCandidatura({ ...valida, nome: "   ", comune: "  " });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["comune", "nome"]);
  });

  it("rifiuta mestiere e volume fuori elenco, cellulare non italiano, consenso non 'on'", () => {
    const r = validateCandidatura({
      ...valida,
      mestiere: "Astronauta",
      volume: "tantissimi",
      telefono: "02 1234 5678",
      privacy: "true",
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.errors).sort()).toEqual(["mestiere", "privacy", "telefono", "volume"]);
    }
  });

  it("rispetta le lunghezze massime", () => {
    const r = validateCandidatura({
      ...valida,
      nome: "a".repeat(101),
      comune: "b".repeat(81),
      telefono: "3".repeat(31),
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["comune", "nome", "telefono"]);
    expect(validateCandidatura({ ...valida, nome: "a".repeat(100) }).ok).toBe(true);
  });
});

describe("formDataToInput", () => {
  it("prende solo i campi del modulo", () => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(valida)) fd.set(k, v);
    fd.set("sito_web", "esca");
    fd.set("altro", "x");
    expect(formDataToInput(fd)).toEqual(valida);
  });
});
