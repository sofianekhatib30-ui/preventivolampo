import { Rifiuto } from "@/lib/preventivi/rifiuto";
import { db, ok } from "./db";
import type { DatiVoce } from "./schema";
import { creaVoce } from "./voci";

// Le righe che l'artigiano ha prezzato a mano e ha chiesto di tenere: proposte per il listino.
// Entrano nel listino solo quando lui le conferma, con codice e unità.

export type Proposta = {
  id: string;
  nome: string;
  unita: string | null;
  prezzo_cents: number | null;
  preventivo_id: string | null;
  creata_il: string;
  numero: string | null;
};

export async function proposteAperte(impresaId: string): Promise<Proposta[]> {
  const righe = ok(
    await db()
      .from("pl_da_prezzare")
      .select("id, nome, unita, prezzo_cents, preventivo_id, creata_il, pl_preventivi(numero)")
      .eq("impresa_id", impresaId)
      .eq("stato", "aperta")
      .order("creata_il", { ascending: false })
      .limit(300),
    "da prezzare",
  ) as unknown as (Omit<Proposta, "numero"> & { pl_preventivi: { numero: string } | null })[];
  return righe.map(({ pl_preventivi, ...r }) => ({ ...r, numero: pl_preventivi?.numero ?? null }));
}

export async function contaAperte(impresaId: string): Promise<number> {
  const r = await db().from("pl_da_prezzare").select("id", { count: "exact", head: true }).eq("impresa_id", impresaId).eq("stato", "aperta");
  return r.count ?? 0;
}

async function chiudi(impresaId: string, id: string, stato: "aggiunta" | "scartata"): Promise<void> {
  const r = ok(
    await db().from("pl_da_prezzare").update({ stato }).eq("impresa_id", impresaId).eq("id", id).eq("stato", "aperta").select("id"),
    "chiudi proposta",
  );
  if (!r?.length) throw new Rifiuto("Proposta non trovata o già gestita.", 404);
}

export async function aggiungiAlListino(impresaId: string, id: string, voce: DatiVoce): Promise<void> {
  const aperta = ok(await db().from("pl_da_prezzare").select("id").eq("impresa_id", impresaId).eq("id", id).eq("stato", "aperta").maybeSingle(), "proposta");
  if (!aperta) throw new Rifiuto("Proposta non trovata o già gestita.", 404);
  await creaVoce(impresaId, voce, "appreso");
  await chiudi(impresaId, id, "aggiunta");
}

export async function scarta(impresaId: string, id: string): Promise<void> {
  await chiudi(impresaId, id, "scartata");
}
