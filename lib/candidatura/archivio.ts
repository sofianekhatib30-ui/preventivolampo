import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Candidatura } from "./schema";

// Dove si salvano le candidature. Oggi esiste solo l'implementazione su file JSON locale
// (sviluppo). Quella su Supabase (tabella candidature_pilota, RLS attiva, nessuna lettura
// pubblica) arriva dopo la decisione sul database: SPEC, «Il modulo di candidatura».

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

export function archivioPredefinito(): ArchivioCandidature {
  return new ArchivioFileJson(process.env.CANDIDATURE_DIR ?? DEFAULT_LOCAL_DIR);
}
