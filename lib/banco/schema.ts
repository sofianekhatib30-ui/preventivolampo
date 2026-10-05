import { z } from "zod";
import { Unit } from "@/lib/listino/schema";

// Il risultato atteso di un caso del banco di prova (testset/atteso/NN.json).
// Si scrive PRIMA di eseguire il motore: descrive che cosa un artigiano esperto
// ricaverebbe dal copione, non che cosa il motore produce.

export const CASE_TAGS = [
  "misura_mancante", // una quantità o un'unità non è detta: il sistema deve chiedere
  "misura_approssimata", // «tre per due e mezzo più o meno»: la quantità si calcola, l'approssimazione si annota
  "bene_significativo", // almeno una voce è un bene significativo ai fini IVA
  "fuori_listino", // almeno una lavorazione non ha voce nel listino: «da prezzare»
  "esclusione", // l'artigiano esclude qualcosa dal preventivo
  "materiale_cliente", // il cliente fornisce del materiale
  "dialetto", // termini dialettali lombardi o gergo di cantiere
  "autocorrezione", // l'artigiano si corregge mentre parla
  "non_abitazione", // l'immobile non è un'abitazione
] as const;

export const QuestionKind = z.enum(["quantita_mancante", "unita_mancante"]);

// Le tre domande del motore IVA. null = il copione non lo dice: il sistema dovrà chiederlo.
export const VatContext = z.strictObject({
  dwelling: z.boolean().nullable(),
  intervention: z.enum(["manutenzione_ordinaria", "manutenzione_straordinaria", "ristrutturazione"]).nullable(),
  goodsBoughtBy: z.enum(["impresa", "cliente"]).nullable(),
});

// Il regime atteso quando il contesto è completo; null quando il copione non basta a stabilirlo.
export const VatRegime = z.enum(["ordinaria_22", "agevolata_10", "agevolata_10_beni_significativi"]);

const Match = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("listino"), code: z.string().regex(/^[A-Z]{3}-\d{2}$/) }),
  z.strictObject({ kind: z.literal("da_prezzare"), reason: z.string().min(5) }),
]);

export const ExpectedLine = z.strictObject({
  // Come l'artigiano la dice nel copione, citata o quasi alla lettera.
  spoken: z.string().min(3),
  quantity: z.number().positive().nullable(),
  unit: Unit.nullable(),
  match: Match,
  clientSuppliesMaterial: z.boolean(),
  // Come si arriva alla quantità, quando non è detta tale e quale (es. «3 × 2,5 = 7,5 m²»).
  quantityNote: z.string().optional(),
});

export const ExpectedQuestion = z.strictObject({
  lineIndex: z.number().int().nonnegative(),
  kind: QuestionKind,
});

export const ExpectedCase = z
  .strictObject({
    id: z.string().regex(/^\d{2}$/),
    title: z.string().min(5),
    tags: z.array(z.enum(CASE_TAGS)).min(1),
    customer: z.strictObject({ name: z.string().nullable(), address: z.string().nullable() }),
    vat: z.strictObject({ context: VatContext, expectedRegime: VatRegime.nullable() }),
    lines: z.array(ExpectedLine).min(1),
    questions: z.array(ExpectedQuestion),
    exclusions: z.array(z.string()),
    notes: z.array(z.string()),
  })
  .superRefine((c, ctx) => {
    c.questions.forEach((q, i) => {
      const line = c.lines[q.lineIndex];
      if (!line) {
        ctx.addIssue({ code: "custom", path: ["questions", i], message: "lineIndex fuori intervallo" });
        return;
      }
      if (q.kind === "quantita_mancante" && line.quantity !== null) {
        ctx.addIssue({ code: "custom", path: ["questions", i], message: "domanda sulla quantità ma la quantità c'è" });
      }
      if (q.kind === "unita_mancante" && line.unit !== null) {
        ctx.addIssue({ code: "custom", path: ["questions", i], message: "domanda sull'unità ma l'unità c'è" });
      }
    });
    // Ogni quantità o unità assente deve avere la sua domanda: mai una stima silenziosa.
    c.lines.forEach((line, i) => {
      if (line.quantity === null && !c.questions.some((q) => q.lineIndex === i && q.kind === "quantita_mancante")) {
        ctx.addIssue({ code: "custom", path: ["lines", i], message: "quantità assente senza domanda" });
      }
      if (line.unit === null && !c.questions.some((q) => q.lineIndex === i && q.kind === "unita_mancante")) {
        ctx.addIssue({ code: "custom", path: ["lines", i], message: "unità assente senza domanda" });
      }
    });
  });

export type ExpectedCase = z.infer<typeof ExpectedCase>;
