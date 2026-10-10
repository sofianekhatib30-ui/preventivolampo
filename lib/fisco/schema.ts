import { z } from "zod";

// Il fisco del preventivo (dal 10/10/2026). L'IVA non si decide più per impresa ma per lavoro e per riga:
// dipende da chi è il cliente, su cosa si lavora, che lavoro è e se la riga ha un'aliquota propria.
// Ricerca e fonti: claude/modulo-richieste-proposte.md e la scheda Preventivi del progetto.

export const ALIQUOTE = ["22", "10", "4", "esente"] as const;
export const Aliquota = z.enum(ALIQUOTE);
export type Aliquota = z.infer<typeof Aliquota>;

export const TIPI_CLIENTE = ["privato", "impresa", "condominio", "pa"] as const;
// Su cosa si lavora. «nessuno»: non è un lavoro su un immobile (un'auto, un evento, un servizio).
export const OGGETTI = ["abitazione", "non_abitativo", "nuova_costruzione", "esterno", "nessuno"] as const;
export const LAVORI = ["manutenzione_ordinaria", "manutenzione_straordinaria", "ristrutturazione", "barriere", "fotovoltaico"] as const;
// Cliente con partita IVA: subappalto edile (lett. a) o pulizia, demolizione, impianti e completamento di edifici (lett. a-ter).
export const INVERSIONI = ["subappalto", "edificio", "no"] as const;

// Le risposte del preventivo. null = non ancora detto: diventa una domanda prima dell'approvazione.
export const ContestoFiscale = z.strictObject({
  cliente: z.enum(TIPI_CLIENTE).nullable(),
  oggetto: z.enum(OGGETTI).nullable(),
  lavoro: z.enum(LAVORI).nullable(),
  materiali: z.enum(["impresa", "cliente"]).nullable(),
  primaCasa: z.boolean().nullable(),
  inversione: z.enum(INVERSIONI).nullable(),
});
export type ContestoFiscale = z.infer<typeof ContestoFiscale>;

export const CONTESTO_VUOTO: ContestoFiscale = { cliente: null, oggetto: null, lavoro: null, materiali: null, primaCasa: null, inversione: null };

// Il profilo fiscale dell'impresa, fotografato sul preventivo quando nasce: se l'impresa cambia regime,
// i preventivi già fatti non cambiano.
export const ProfiloFiscale = z.strictObject({
  regime: z.enum(["ordinario", "forfettario"]),
  // Lavoratore autonomo o professionista: i clienti sostituti d'imposta trattengono il 20%.
  ritenuta: z.boolean(),
  // Rivalsa INPS 4% (gestione separata).
  rivalsaInps: z.boolean(),
  // Lavora sugli edifici: il preventivo chiede su cosa si lavora e che lavoro è.
  edifici: z.boolean(),
  // Pulisce edifici: con un cliente impresa può scattare l'inversione contabile (lett. a-ter).
  pulizie: z.boolean(),
  // Aliquota delle righe fuori dall'edilizia, quando la voce non ne ha una propria.
  aliquotaBase: Aliquota,
  // Riferimento normativo per le righe esenti (es. «art. 10, n. 20, DPR 633/1972»).
  esenzione: z.string().max(120).nullable(),
  // Eccezioni del mestiere da sapere (fiori al 10%, concerti dal vivo…).
  avvisi: z.array(z.string().max(400)).max(20),
});
export type ProfiloFiscale = z.infer<typeof ProfiloFiscale>;

export const Fisco = z.strictObject({ contesto: ContestoFiscale, profilo: ProfiloFiscale });
export type Fisco = z.infer<typeof Fisco>;

export const PROFILO_EDILE: ProfiloFiscale = {
  regime: "ordinario",
  ritenuta: false,
  rivalsaInps: false,
  edifici: true,
  pulizie: false,
  aliquotaBase: "22",
  esenzione: null,
  avvisi: [],
};
