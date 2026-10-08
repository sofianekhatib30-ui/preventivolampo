import { conti } from "@/lib/preventivi/calcolo";
import type { Contesto, Evento } from "@/lib/preventivi/contesto";
import { Preventivo } from "@/lib/preventivi/modello";
import { configurato, db, ok } from "./db";
import { aziendaDi, descrizioneDi, leggiImpresa, type Impresa } from "./imprese";
import { elencoVoci, perMotore } from "./voci";

// I preventivi di un'impresa vera: documento in pl_preventivi, storia in pl_eventi,
// righe da aggiungere al listino in pl_da_prezzare. Ogni query porta l'id dell'impresa.

async function impresa(id: string): Promise<Impresa> {
  const imp = await leggiImpresa(id);
  if (!imp) throw new Error("impresa inesistente");
  return imp;
}

function riga(p: Preventivo) {
  return {
    stato: p.stato,
    documento: p,
    token_accettazione: p.tokenAccettazione,
    cliente_nome: p.cliente.name,
    totale_cents: conti(p)?.totalCents ?? 0,
    aggiornato_il: new Date().toISOString(),
  };
}

async function registra(impresaId: string, preventivoId: string, e: Evento): Promise<void> {
  const r = await db().from("pl_eventi").insert({ impresa_id: impresaId, preventivo_id: preventivoId, tipo: e.tipo, dati: e.dati ?? {} });
  if (r.error) console.error(`evento: ${r.error.message}`); // la storia non deve bloccare il preventivo
}

export async function contestoImpresa(impresaId: string): Promise<Contesto> {
  const imp = await impresa(impresaId);
  return {
    tipo: "impresa",
    descrizione: descrizioneDi(imp),
    azienda: async () => aziendaDi(imp),
    voci: async () => (await elencoVoci(impresaId)).map(perMotore),
    async leggi(id) {
      if (!/^[A-Za-z0-9_-]{22}$/.test(id)) return null;
      const r = ok(await db().from("pl_preventivi").select("documento").eq("impresa_id", impresaId).eq("id", id).maybeSingle(), "preventivo");
      const parsed = Preventivo.safeParse(r?.documento);
      return parsed.success ? parsed.data : null;
    },
    async crea(p) {
      const numero = ok(await db().rpc("pl_prossimo_numero", { p_impresa: impresaId }), "numero") as string;
      const valido = Preventivo.parse({ ...p, numero });
      ok(await db().from("pl_preventivi").insert({ id: valido.id, impresa_id: impresaId, numero, creato_il: valido.creatoIl, ...riga(valido) }), "nuovo preventivo");
      await registra(impresaId, valido.id, { tipo: "creato", dati: { righe: valido.righe.length } });
      return valido;
    },
    async salva(p, evento) {
      const valido = Preventivo.parse(p);
      const r = ok(await db().from("pl_preventivi").update(riga(valido)).eq("impresa_id", impresaId).eq("id", valido.id).select("id"), "salva preventivo");
      if (!r?.length) throw new Error("preventivo inesistente");
      if (evento) await registra(impresaId, valido.id, evento);
    },
    async impara(p, righe) {
      ok(
        await db()
          .from("pl_da_prezzare")
          .insert(righe.map((r) => ({ impresa_id: impresaId, preventivo_id: p.id, nome: r.work, unita: r.unit, prezzo_cents: r.unitPriceCents }))),
        "proposte listino",
      );
    },
  };
}

// Il link del cliente: il token porta all'impresa giusta. Senza Supabase configurato non c'è nulla da cercare.
export async function contestoPerToken(token: string): Promise<{ ctx: Contesto; p: Preventivo } | null> {
  if (!configurato()) return null;
  const r = ok(await db().from("pl_preventivi").select("impresa_id, documento").eq("token_accettazione", token).maybeSingle(), "token");
  if (!r) return null;
  const parsed = Preventivo.safeParse(r.documento);
  if (!parsed.success || parsed.data.tokenAccettazione !== token) return null;
  return { ctx: await contestoImpresa(r.impresa_id as string), p: parsed.data };
}

export type Riassunto = {
  id: string;
  numero: string;
  stato: Preventivo["stato"];
  cliente_nome: string | null;
  totale_cents: number;
  creato_il: string;
  aggiornato_il: string;
};

export async function elencoPreventivi(impresaId: string, limite = 200): Promise<Riassunto[]> {
  return ok(
    await db()
      .from("pl_preventivi")
      .select("id, numero, stato, cliente_nome, totale_cents, creato_il, aggiornato_il")
      .eq("impresa_id", impresaId)
      .order("creato_il", { ascending: false })
      .limit(limite),
    "elenco preventivi",
  ) as Riassunto[];
}

export type EventoSalvato = { tipo: string; dati: Record<string, unknown>; il: string };

export async function storia(impresaId: string, preventivoId: string): Promise<EventoSalvato[]> {
  return ok(
    await db().from("pl_eventi").select("tipo, dati, il").eq("impresa_id", impresaId).eq("preventivo_id", preventivoId).order("il"),
    "storia",
  ) as EventoSalvato[];
}

// Un preventivo in bozza si può buttare; uno approvato no (il cliente ha il link).
export async function eliminaBozza(impresaId: string, id: string): Promise<boolean> {
  const r = ok(await db().from("pl_preventivi").delete().eq("impresa_id", impresaId).eq("id", id).eq("stato", "bozza").select("id"), "elimina bozza");
  return (r?.length ?? 0) > 0;
}
