import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { configurato, db } from "@/lib/impresa/db";
import type { Candidatura } from "./schema";

// Dove si salvano le candidature. In produzione su Supabase (tabella pl_candidature, RLS attiva,
// nessun permesso al browser); senza Supabase configurato, su file JSON locale (sviluppo e test).

export type CandidaturaSalvata = Candidatura & {
  id: string;
  ricevutaIl: string; // ISO 8601
};

export interface ArchivioCandidature {
  salva(candidatura: Candidatura, ricevutaIl: Date): Promise<CandidaturaSalvata>;
}

// Cartella ignorata da git (vedi .gitignore): contiene dati personali di chi si candida.
export const DEFAULT_LOCAL_DIR = path.join(process.cwd(), "archivio-locale", "candidature");

// Un file per candidatura: niente lettura-modifica-scrittura, quindi niente corse fra invii.
export class ArchivioFileJson implements ArchivioCandidature {
  constructor(private readonly dir: string = DEFAULT_LOCAL_DIR) {}

  async salva(candidatura: Candidatura, ricevutaIl: Date): Promise<CandidaturaSalvata> {
    const record: CandidaturaSalvata = {
      id: randomUUID(),
      ricevutaIl: ricevutaIl.toISOString(),
      ...candidatura,
    };
    await mkdir(this.dir, { recursive: true });
    const stamp = record.ricevutaIl.replace(/[:.]/g, "-");
    await writeFile(
      path.join(this.dir, `${stamp}-${record.id}.json`),
      `${JSON.stringify(record, null, 2)}\n`,
      { encoding: "utf8", flag: "wx" },
    );
    return record;
  }
}

export class ArchivioSupabase implements ArchivioCandidature {
  async salva(c: Candidatura, ricevutaIl: Date): Promise<CandidaturaSalvata> {
    const r = await db()
      .from("pl_candidature")
      .insert({ ricevuta_il: ricevutaIl.toISOString(), nome: c.nome, mestiere: c.mestiere, comune: c.comune, telefono: c.telefono, volume: c.volume ?? null })
      .select("id, ricevuta_il")
      .single();
    if (r.error || !r.data) throw Object.assign(new Error("candidatura non salvata"), { code: r.error?.code ?? "nessun-dato" });
    const salvata: CandidaturaSalvata = { ...c, id: r.data.id as string, ricevutaIl: new Date(r.data.ricevuta_il as string).toISOString() };
    await avvisa(salvata);
    return salvata;
  }
}

// Avviso facoltativo a Sofiane (per esempio un webhook di Slack o di n8n): se manca o non risponde,
// la candidatura resta salvata comunque.
async function avvisa(c: CandidaturaSalvata): Promise<void> {
  const url = process.env.AVVISO_CANDIDATURE_URL;
  if (!url) return;
  const text = `Nuova candidatura al pilota: ${c.nome}, ${c.mestiere}, ${c.comune}, ${c.telefono}${c.volume ? `, ${c.volume} preventivi a settimana` : ""}`;
  try {
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }), signal: AbortSignal.timeout(4000) });
  } catch {
    console.error("candidatura: avviso non recapitato");
  }
}

export function archivioPredefinito(): ArchivioCandidature {
  if (configurato() && !process.env.CANDIDATURE_DIR) return new ArchivioSupabase();
  return new ArchivioFileJson(process.env.CANDIDATURE_DIR ?? DEFAULT_LOCAL_DIR);
}
