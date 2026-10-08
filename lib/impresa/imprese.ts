import { Rifiuto } from "@/lib/preventivi/rifiuto";
import type { Azienda, Logo } from "@/lib/preventivi/contesto";
import { db, ok } from "./db";
import type { DatiImpresa } from "./schema";
import type { Sessione } from "./sessione";

// L'impresa registrata: anagrafica che finisce sul PDF, logo, numerazione.

export const BUCKET = "preventivolampo";

export type Impresa = DatiImpresa & {
  id: string;
  logo_path: string | null;
  stato: "prova" | "attiva" | "sospesa";
  creata_il: string;
};

const CAMPI = "id, ragione_sociale, piva, cf, indirizzo, telefono, email, iban, condizioni_pagamento, validita_giorni, mestieri, logo_path, stato, creata_il";

export async function leggiImpresa(id: string): Promise<Impresa | null> {
  return ok(await db().from("pl_imprese").select(CAMPI).eq("id", id).maybeSingle(), "impresa") as Impresa | null;
}

export async function creaImpresa(s: Sessione, dati: DatiImpresa): Promise<string> {
  const gia = ok(await db().from("pl_membri").select("impresa_id").eq("user_id", s.userId).maybeSingle(), "membro");
  if (gia) throw new Rifiuto("Questo account ha già un'impresa.", 409);
  const imp = ok(await db().from("pl_imprese").insert(dati).select("id").single(), "nuova impresa") as { id: string };
  const r = await db().from("pl_membri").insert({ impresa_id: imp.id, user_id: s.userId, ruolo: "titolare" });
  if (r.error) {
    // Due registrazioni in parallelo: tengo la prima, tolgo l'impresa rimasta senza titolare.
    await db().from("pl_imprese").delete().eq("id", imp.id);
    throw new Rifiuto("Questo account ha già un'impresa.", 409);
  }
  return imp.id;
}

export async function aggiornaImpresa(id: string, dati: DatiImpresa): Promise<void> {
  ok(await db().from("pl_imprese").update({ ...dati, aggiornata_il: new Date().toISOString() }).eq("id", id), "aggiorna impresa");
}

// Logo: PNG o JPEG (quelli che il PDF sa incorporare), al massimo 1 MB. Si controllano i byte, non il nome.
export function tipoLogo(bytes: Uint8Array): Logo["tipo"] | null {
  if (bytes.length > 1_000_000 || bytes.length < 16) return null;
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  return null;
}

export async function salvaLogo(id: string, bytes: Uint8Array): Promise<void> {
  const tipo = tipoLogo(bytes);
  if (!tipo) throw new Rifiuto("Il logo deve essere un'immagine PNG o JPG fino a 1 MB.", 400);
  const percorso = `loghi/${id}.${tipo === "image/png" ? "png" : "jpg"}`;
  const prima = await leggiImpresa(id);
  ok(await db().storage.from(BUCKET).upload(percorso, bytes, { contentType: tipo, upsert: true }), "carica logo");
  if (prima?.logo_path && prima.logo_path !== percorso) await db().storage.from(BUCKET).remove([prima.logo_path]);
  ok(await db().from("pl_imprese").update({ logo_path: percorso }).eq("id", id), "logo");
}

export async function togliLogo(id: string): Promise<void> {
  const prima = await leggiImpresa(id);
  if (prima?.logo_path) await db().storage.from(BUCKET).remove([prima.logo_path]);
  ok(await db().from("pl_imprese").update({ logo_path: null }).eq("id", id), "logo");
}

export async function leggiLogo(imp: Pick<Impresa, "logo_path">): Promise<Logo | null> {
  if (!imp.logo_path) return null;
  const r = await db().storage.from(BUCKET).download(imp.logo_path);
  if (r.error || !r.data) return null;
  const bytes = new Uint8Array(await r.data.arrayBuffer());
  const tipo = tipoLogo(bytes);
  return tipo ? { bytes, tipo } : null;
}

export function aziendaDi(imp: Impresa): Azienda {
  return {
    name: imp.ragione_sociale,
    address: imp.indirizzo,
    vatNumber: imp.piva,
    phone: imp.telefono,
    email: imp.email,
    quoteValidityDays: imp.validita_giorni,
    avviso: null,
    iban: imp.iban,
    condizioniPagamento: imp.condizioni_pagamento,
    logo: () => leggiLogo(imp),
  };
}

// Per il motore: chi è l'impresa e che lavori fa.
export function descrizioneDi(imp: Pick<Impresa, "ragione_sociale" | "mestieri">): string {
  const mestieri = imp.mestieri.filter((m) => m !== "Impresa edile").map((m) => m.toLowerCase());
  return `${imp.ragione_sociale}, impresa edile italiana${mestieri.length ? ` (${mestieri.join(", ")})` : ""}`;
}
