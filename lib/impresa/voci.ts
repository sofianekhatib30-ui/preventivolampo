import type { VoceMotore } from "@/lib/listino/schema";
import { Rifiuto } from "@/lib/preventivi/rifiuto";
import { db, ok } from "./db";
import type { DatiVoce, Voce } from "./schema";

// Il listino dell'impresa: le voci da cui il motore prende i prezzi. Nessun prezzo fuori da qui.

export const MAX_VOCI = 3000;
const CAMPI = "id, codice, nome, descrizione, unita, prezzo_cents, categoria, sinonimi, bene_significativo, fornibile_dal_cliente, origine, attiva, aggiornata_il";

export async function elencoVoci(impresaId: string): Promise<Voce[]> {
  const out: Voce[] = [];
  // PostgREST restituisce al massimo 1000 righe per richiesta: si legge a pagine.
  for (let da = 0; da < MAX_VOCI; da += 1000) {
    const pagina = ok(
      await db().from("pl_voci").select(CAMPI).eq("impresa_id", impresaId).eq("attiva", true).order("codice").range(da, da + 999),
      "voci",
    ) as Voce[];
    out.push(...pagina);
    if (pagina.length < 1000) break;
  }
  return out;
}

export function perMotore(v: Voce): VoceMotore {
  return {
    code: v.codice,
    name: v.nome,
    description: v.descrizione ?? v.nome,
    unit: v.unita,
    priceCents: v.prezzo_cents,
    synonyms: v.sinonimi,
    significantGood: v.bene_significativo,
    clientSuppliable: v.fornibile_dal_cliente,
  };
}

const doppione = (e: { code?: string } | null) => e?.code === "23505";

async function quante(impresaId: string): Promise<number> {
  const r = await db().from("pl_voci").select("id", { count: "exact", head: true }).eq("impresa_id", impresaId).eq("attiva", true);
  if (r.error) throw new Error(`conta voci: ${r.error.message}`);
  return r.count ?? 0;
}

export async function creaVoce(impresaId: string, dati: DatiVoce, origine: Voce["origine"] = "manuale"): Promise<Voce> {
  if ((await quante(impresaId)) >= MAX_VOCI) throw new Rifiuto(`Il listino ha già ${MAX_VOCI} voci.`, 409);
  // Una voce tolta in passato con lo stesso codice torna attiva con i dati nuovi.
  const vecchia = ok(await db().from("pl_voci").select("id").eq("impresa_id", impresaId).eq("codice", dati.codice).eq("attiva", false).maybeSingle(), "voce");
  if (vecchia) {
    const r = await db().from("pl_voci").update({ ...dati, origine, attiva: true, aggiornata_il: new Date().toISOString() }).eq("id", vecchia.id).select(CAMPI).single();
    return ok(r, "riattiva voce") as Voce;
  }
  const r = await db().from("pl_voci").insert({ ...dati, impresa_id: impresaId, origine }).select(CAMPI).single();
  if (doppione(r.error)) throw new Rifiuto(`Esiste già una voce con il codice ${dati.codice}.`, 409);
  return ok(r, "nuova voce") as Voce;
}

export async function aggiornaVoce(impresaId: string, id: string, dati: DatiVoce): Promise<Voce> {
  const r = await db()
    .from("pl_voci")
    // Una voce corretta dall'artigiano è sua: non è più «prezzo d'esempio» né «importata».
    .update({ ...dati, origine: "manuale", aggiornata_il: new Date().toISOString() })
    .eq("impresa_id", impresaId)
    .eq("id", id)
    .eq("attiva", true)
    .select(CAMPI)
    .maybeSingle();
  if (doppione(r.error)) throw new Rifiuto(`Esiste già una voce con il codice ${dati.codice}.`, 409);
  const v = ok(r, "aggiorna voce") as Voce | null;
  if (!v) throw new Rifiuto("Voce non trovata.", 404);
  return v;
}

// Togliere una voce non cancella i preventivi già fatti: la voce resta nel database, spenta.
export async function togliVoce(impresaId: string, id: string): Promise<void> {
  const r = ok(
    await db().from("pl_voci").update({ attiva: false, aggiornata_il: new Date().toISOString() }).eq("impresa_id", impresaId).eq("id", id).select("id"),
    "togli voce",
  );
  if (!r?.length) throw new Rifiuto("Voce non trovata.", 404);
}

// Inserimento in blocco (import, listino di esempio): i codici già presenti si saltano, non si sovrascrivono.
export async function inserisciVoci(impresaId: string, voci: DatiVoce[], origine: Voce["origine"]): Promise<{ inserite: number; saltate: string[] }> {
  const esistenti = new Set(
    (ok(await db().from("pl_voci").select("codice").eq("impresa_id", impresaId).eq("attiva", true).limit(MAX_VOCI), "codici") as { codice: string }[]).map(
      (x) => x.codice,
    ),
  );
  if (esistenti.size + voci.length > MAX_VOCI) throw new Rifiuto(`Il listino può avere al massimo ${MAX_VOCI} voci.`, 409);
  const nuove = voci.filter((v) => !esistenti.has(v.codice));
  const saltate = voci.filter((v) => esistenti.has(v.codice)).map((v) => v.codice);
  for (let i = 0; i < nuove.length; i += 500) {
    const blocco = nuove.slice(i, i + 500).map((v) => ({ ...v, impresa_id: impresaId, origine, attiva: true }));
    ok(await db().from("pl_voci").upsert(blocco, { onConflict: "impresa_id,codice" }), "inserisci voci");
  }
  return { inserite: nuove.length, saltate };
}

