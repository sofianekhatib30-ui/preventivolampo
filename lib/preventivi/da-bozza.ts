import { randomBytes } from "node:crypto";
import type { VoceMotore } from "@/lib/listino/schema";
import type { Draft } from "@/lib/motore/tipi";
import { CONTESTO_VUOTO, type ProfiloFiscale } from "@/lib/fisco/schema";
import type { Preventivo } from "./modello";

// Dalla bozza del motore al preventivo da rivedere. I prezzi restano quelli del listino o vuoti.

export function nuovoId(): string {
  return randomBytes(16).toString("base64url"); // 22 caratteri, 128 bit: non indovinabile
}

// Il profilo fiscale dell'impresa si fotografa sul preventivo: cambiarlo dopo non cambia i preventivi già fatti.
export function daBozza(draft: Draft, byCode: Map<string, VoceMotore>, profilo: ProfiloFiscale, adesso = new Date()): Preventivo {
  const id = nuovoId();
  const v = draft.vat.context;
  return {
    id,
    numero: `${adesso.getFullYear()}-${id.slice(0, 6).toUpperCase()}`,
    creatoIl: adesso.toISOString(),
    stato: "bozza",
    cliente: draft.customer,
    iva: draft.vat.context,
    fisco: {
      contesto: {
        ...CONTESTO_VUOTO,
        cliente: draft.clientKind ?? null,
        // Chi non lavora sugli edifici non risponde alle domande sull'immobile.
        oggetto: !profilo.edifici ? "nessuno" : v.dwelling === null ? null : v.dwelling ? "abitazione" : "non_abitativo",
        lavoro: profilo.edifici ? v.intervention : null,
        materiali: profilo.edifici ? v.goodsBoughtBy : null,
      },
      profilo,
    },
    righe: draft.lines.map((l, i) => {
      const code = l.match.kind === "listino" ? l.match.code : null;
      const item = code ? byCode.get(code) : undefined;
      const domande = draft.questions.filter((q) => q.lineIndex === i).map((q) => q.text);
      const flag =
        l.match.kind === "da_prezzare"
          ? `Da prezzare: ${l.match.reason}`
          : domande.length > 0
            ? domande.join(" ")
            : null;
      return {
        work: item ? item.name : l.work,
        spoken: l.spoken,
        quantity: l.quantity,
        unit: l.unit,
        unitPriceCents: item ? item.priceCents : null,
        code,
        priceSource: item ? "listino" : null,
        flag,
        significantGood: item?.significantGood ?? false,
        goodsValueCents: null,
        aliquota: item?.aliquota ?? null,
        addToPriceList: false,
      };
    }),
    esclusioni: draft.exclusions,
    note: draft.notes,
    approvatoIl: null,
    tokenAccettazione: null,
    accettazione: null,
    motore: { model: draft.model, inputTokens: draft.usage.inputTokens, outputTokens: draft.usage.outputTokens, elapsedMs: draft.elapsedMs },
  };
}
