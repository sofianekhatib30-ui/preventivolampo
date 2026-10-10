import { UNITS } from "@/lib/listino/schema";
import { z } from "zod";
import { calcola } from "./calcolo";
import type { ToolCaller, ToolSpec } from "./claude";
import { Extraction, ExtractedLine, INTERVENTIONS } from "./tipi";

// Come esce dal modello: in più c'è il calcolo della quantità, che si rifà in codice.
const RigaGrezza = ExtractedLine.extend({ calc: z.string().nullable().optional() });
const EstrazioneGrezza = Extraction.extend({ lines: z.array(RigaGrezza).min(1) });

// Tipo nullo come array di tipi (anyOf non è supportato dalle uscite strutturate).
// Per gli elenchi chiusi il «non detto» è un valore esplicito, riportato a null prima della validazione.
const NOT_SAID = "non_detto";
const nullable = (schema: { type: string; enum?: string[]; description?: string }) =>
  schema.enum ? { ...schema, enum: [...schema.enum, NOT_SAID] } : { ...schema, type: [schema.type, "null"] };

function notSaidToNull(raw: unknown): unknown {
  if (Array.isArray(raw)) return raw.map(notSaidToNull);
  if (raw && typeof raw === "object") return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, notSaidToNull(v)]));
  return raw === NOT_SAID ? null : raw;
}

export const EXTRACTION_TOOL: ToolSpec = {
  name: "registra_sopralluogo",
  description: "Registra le lavorazioni, il cliente e il contesto IVA ricavati dal vocale del sopralluogo.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["customer", "vat", "lines", "exclusions", "notes"],
    properties: {
      customer: {
        type: "object",
        additionalProperties: false,
        required: ["name", "address"],
        properties: { name: nullable({ type: "string" }), address: nullable({ type: "string" }) },
      },
      vat: {
        type: "object",
        additionalProperties: false,
        required: ["dwelling", "intervention", "goodsBoughtBy"],
        properties: {
          dwelling: nullable({ type: "boolean" }),
          intervention: nullable({ type: "string", enum: [...INTERVENTIONS] }),
          goodsBoughtBy: nullable({ type: "string", enum: ["impresa", "cliente"] }),
        },
      },
      lines: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["spoken", "work", "quantity", "unit", "calc", "quantityNote", "clientSuppliesMaterial"],
          properties: {
            spoken: { type: "string", description: "Le parole dell'artigiano per questa sola lavorazione, quasi alla lettera" },
            work: { type: "string", description: "La lavorazione in italiano tecnico, breve (es. «rimozione rivestimento in piastrelle»)" },
            quantity: nullable({ type: "number", description: "Maggiore di zero" }),
            unit: nullable({ type: "string", enum: [...UNITS] }),
            calc: nullable({ type: "string", description: "Se la quantità è calcolata da misure: l'espressione con soli numeri, + - * / e parentesi (es. «5*4 + 3.5*3»)" }),
            quantityNote: nullable({ type: "string", description: "Come si arriva alla quantità, se calcolata" }),
            clientSuppliesMaterial: { type: "boolean" },
          },
        },
      },
      exclusions: { type: "array", items: { type: "string" } },
      notes: { type: "array", items: { type: "string" } },
    },
  },
};

export const EXTRACTION_SYSTEM = `Sei l'assistente di un'impresa edile della Brianza. Ricevi la trascrizione del vocale che l'artigiano manda dopo un sopralluogo e registri i dati per il preventivo.

Regole:
- Una riga per ogni lavorazione da mettere nel preventivo. Non inventare lavorazioni che l'artigiano non dice.
- spoken contiene solo le parole di quella lavorazione: mai frasi che appartengono a un'altra riga.
- Separa in righe diverse solo cose diverse che si installano o si pagano separatamente: «una presa e un interruttore», «lo stucco e poi la pittura», «il bidet con il suo rubinetto» sono due righe ciascuna. Non separare le parti di una stessa lavorazione: «l'allaccio con carico e scarico», «il rubinetto con la sua doccetta», «smontare e portare via», «grattare e riverniciare» la stessa cancellata restano una riga.
- Quando l'artigiano dice tutte e due le azioni, togliere il vecchio e mettere il nuovo, sono due righe: «smonto il lavandino vecchio e monto quello nuovo», «tolgo la porta e metto quella nuova». «Sostituire», «cambiare» detto con una parola sola («lo cambio», «lo sostituiamo con…») è una riga sola: quella del nuovo. Lo stesso per demolizioni di strati diversi: «togliere il rivestimento e l'intonaco sotto» = due righe, una per strato.
- Se l'artigiano dice il numero totale dei pezzi di una lavorazione, è una riga sola con quel numero, anche se poi li elenca («le quattro placche, sala, camera, bagno e cucina» = una riga, 4 pezzi; «sei prese dati» = una riga, 6). Si separano solo se li distingue per tipo o caratteristiche («due prese da dieci e una da sedici»). Oggetti diversi elencati senza un numero totale («il vaso, il bidet e il lavabo») sono righe diverse.
- Portare via quello che si smonta o si demolisce («lo porto via io», «lo carico sul furgone», «tutto il vecchio lo porto via») fa parte della rimozione: non è una riga. Il carico e trasporto in discarica di macerie con una quantità detta (m³, quintali) è una riga.
- Quello che l'artigiano farà e farà pagare ma dice di non avere a listino («quello va a parte», «non ce l'ho a listino», «lo devo chiedere») è comunque una riga: il prezzo lo metterà lui. Le verifiche, le cose da vedere e i lavori che fanno altri non sono righe: vanno in notes o in exclusions.
- «Io», «noi», «lo faccio io», «le carico io» sono l'impresa; il cliente è «lui», «lei», «il signore», «la signora».
- Autocorrezioni («no aspetta», «anzi», «cioè»): registra solo la versione finale di quello che viene corretto. La correzione sostituisce solo la cosa che contraddice: se aggiunge o cambia un'altra cosa («tre prese e un interruttore in camera. Anzi, l'interruttore lo facciamo deviato»: le tre prese restano) le righe dette prima restano e si aggiunge quella nuova. Nel dubbio se una correzione cancella una lavorazione detta prima, tienila e scrivi il dubbio in notes: una riga in più l'artigiano la toglie in un attimo, una riga persa non la vede.
- Lavorazioni rimandate o escluse («lo vediamo dopo», «quello no», «non lo tocco») non sono righe: vanno in exclusions se l'artigiano le esclude, in notes se le rimanda.
- Il racconto può essere in un'altra lingua (rumeno, albanese, arabo anche dialettale, ucraino, spagnolo, francese…) o mescolato con l'italiano: spoken resta come è stato detto; work, quantityNote, exclusions e notes sempre in italiano. Le misure dette in un'altra lingua valgono come quelle dette in italiano.
- Quantità: se l'artigiano dà le misure, calcola tu la quantità (superfici, perimetri per altezza, differenze) e scrivi in calc l'espressione con i numeri usati (es. sala 5x4 più camera 3,5x3 = «5*4 + 3.5*3»; pareti di una stanza 4x3 alta 2,70 = «(4+3)*2*2.7»), e in quantityNote la spiegazione a parole. Se la quantità è detta direttamente, calc = null. Se dice una misura approssimata, usala e annota che è approssimata.
- Un solo oggetto detto al singolare senza numero («il videocitofono lo cambiamo», «la caldaia nuova») è 1 pezzo: quantity = 1, unit = cad.
- Se la quantità non è detta né ricavabile, quantity = null. Non stimare mai.
- unit: m2, m, m3, cad (pezzi), h (ore), 100kg, kg, l (litri), corpo (lavoro a corpo, quantità 1). Usa l'unità in cui la quantità è detta; «metri» detto di una superficie (pittura, intonaco, piastrelle, muffa) sono m2. Se il numero detto non ha un'unità chiara, unit = non_detto. Se la quantità manca, unit è l'unità con cui quella lavorazione si misura senza dubbi (pittura e rivestimenti m2, tubi e cavi m, prese e sanitari cad); se potrebbe essere misurata in più modi (crepe, ripristini), unit = non_detto.
- clientSuppliesMaterial = true solo se l'artigiano dice che il materiale di quella riga lo compra o lo fornisce il cliente, compreso il caso in cui si rimonta un pezzo che il cliente ha già («rimonto il suo lavello», «il suo rubinetto vecchio, niente da comprare»): vale per ogni riga a cui si riferisce, anche se è detto una volta sola.
- Contesto IVA, solo se detto o evidente dalle parole: dwelling (abitazione: «ci abita», «casa sua»; negozio o ufficio = false), intervention (manutenzione_ordinaria, manutenzione_straordinaria, ristrutturazione), goodsBoughtBy (chi compra i materiali: «li compro io» = impresa, «li ha comprati lei» = cliente). Se non è detto, null (per gli elenchi: non_detto).
- Termini dialettali lombardi: «el cess» = water, «caldana» = massetto, «sciura» = signora, «magütt» = muratore, «minga» = non.
- Non scrivere prezzi.`;

// Mestieri fuori dall'edilizia (servizi per la casa, auto, eventi, servizi alle aziende…): stesse regole
// di fondo (niente prezzi, niente stime, una riga per ogni cosa che si paga), parole generali, nessuna
// domanda sull'IVA edile: l'aliquota è quella fissa dell'impresa. Il prompt edile qui sopra resta quello
// misurato sul banco di prova e non si tocca.
export const EXTRACTION_SYSTEM_GENERALE = `Sei l'assistente di un'impresa italiana. Ricevi il racconto (trascrizione di un vocale o testo scritto) con cui il titolare descrive un lavoro, un servizio o una fornitura da preventivare, e registri i dati per il preventivo.

Regole:
- Una riga per ogni voce da mettere nel preventivo: un lavoro, un servizio, un prodotto, un noleggio, una trasferta. Non inventare voci che il titolare non dice.
- spoken contiene solo le parole di quella voce: mai frasi che appartengono a un'altra riga.
- Separa in righe diverse solo le cose che si pagano separatamente («il servizio fotografico e l'album», «il trasloco e il montaggio dei mobili», «il tagliando e la sostituzione delle pastiglie»). Non separare le parti di una stessa voce («smontare e rimontare la stessa ruota», «preparare e servire il pranzo»).
- Se il titolare dice il numero totale dei pezzi o delle persone di una voce, è una riga sola con quel numero, anche se poi li elenca. Cose diverse elencate senza un numero totale sono righe diverse.
- Quello che il titolare farà e farà pagare ma dice di non avere a listino («quello va a parte», «lo devo chiedere») è comunque una riga: il prezzo lo metterà lui. Le verifiche, le cose da vedere e i lavori che fanno altri non sono righe: vanno in notes o in exclusions.
- «Io», «noi», «lo faccio io» sono l'impresa; il cliente è «lui», «lei», «il signore», «la signora», «l'azienda».
- Autocorrezioni («no aspetta», «anzi», «cioè»): registra solo la versione finale di quello che viene corretto; le righe dette prima che la correzione non contraddice restano. Nel dubbio tieni la riga e scrivi il dubbio in notes.
- Voci rimandate o escluse («lo vediamo dopo», «quello no») non sono righe: vanno in exclusions se escluse, in notes se rimandate.
- Il racconto può essere in un'altra lingua o mescolato con l'italiano: spoken resta come è stato detto; work, quantityNote, exclusions e notes sempre in italiano.
- Quantità: se il titolare dà le misure o i conti (persone per ore, giorni per mezzi, metri per metri), calcola tu la quantità e scrivi in calc l'espressione con i numeri usati (es. tre persone per otto ore = «3*8»), e in quantityNote la spiegazione a parole. Se la quantità è detta direttamente, calc = null.
- Un solo oggetto o servizio detto al singolare senza numero è 1: quantity = 1, unit = cad (oppure corpo se è un lavoro a forfait).
- Se la quantità non è detta né ricavabile, quantity = null. Non stimare mai.
- unit: m2, m, m3, cad (pezzi o persone), h (ore), giorno (giornate), km (chilometri), 100kg, kg, l (litri), corpo (a forfait, quantità 1). Usa l'unità in cui la quantità è detta; se il numero detto non ha un'unità chiara, unit = non_detto.
- clientSuppliesMaterial = true solo se il titolare dice che il materiale o il pezzo di quella riga lo fornisce il cliente.
- vat: sempre non_detto per i tre campi (l'IVA la decide l'impresa, non il racconto).
- Non scrivere prezzi.`;

// Il listino di prova è di un'impresa della Brianza; per un'impresa vera si dice chi è e che mestieri fa.
export function extractionSystem(impresa?: string, regime: "edile" | "ordinario" = "edile"): string {
  if (regime === "ordinario") return impresa ? EXTRACTION_SYSTEM_GENERALE.replace("di un'impresa italiana", `di ${impresa}`) : EXTRACTION_SYSTEM_GENERALE;
  if (!impresa) return EXTRACTION_SYSTEM;
  return EXTRACTION_SYSTEM.replace("di un'impresa edile della Brianza", `di ${impresa}`);
}

export async function extract(transcript: string, call: ToolCaller, impresa?: string, regime: "edile" | "ordinario" = "edile") {
  const result = await call({ system: extractionSystem(impresa, regime), user: transcript, tool: EXTRACTION_TOOL });
  const parsed = EstrazioneGrezza.safeParse(notSaidToNull(result.input));
  if (!parsed.success) {
    throw new Error(`Uscita dell'estrazione non valida: ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`);
  }
  const extraction: Extraction = { ...parsed.data, lines: parsed.data.lines.map(rifaiConto) };
  return { extraction, inputTokens: result.inputTokens, outputTokens: result.outputTokens };
}

// Il conto lo rifà il codice: se l'espressione dà un numero diverso da quello scritto, vale l'espressione.
export function rifaiConto({ calc, ...riga }: z.infer<typeof RigaGrezza>): ExtractedLine {
  const v = calcola(calc);
  if (v === null || (riga.quantity !== null && Math.abs(v - riga.quantity) <= 0.011)) return riga;
  const nota = `conto rifatto: ${calc} = ${String(v).replace(".", ",")}`;
  return { ...riga, quantity: v, quantityNote: riga.quantityNote ? `${riga.quantityNote}; ${nota}` : nota };
}
