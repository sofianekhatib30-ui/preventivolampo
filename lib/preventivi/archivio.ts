import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put } from "@vercel/blob";
import { Preventivo } from "./modello";

// Dove vivono i preventivi.
// - Online (Vercel): Blob privato, un oggetto per preventivo; i file non sono leggibili da URL pubblici.
// - In locale: file JSON in archivio-locale/ (ignorato da git), scrittura atomica.
// Il token di accettazione ha un suo indice (token/<token>.json → id): chi ha il link del cliente
// non conosce l'id della bozza e non la può modificare.

const ID = /^[A-Za-z0-9_-]{22}$/;

function suBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export function cartella(): string {
  return process.env.PREVENTIVI_DIR || path.join(process.cwd(), "archivio-locale", "preventivi");
}

async function leggiOggetto(nome: string): Promise<unknown | null> {
  if (suBlob()) {
    const res = await get(nome, { access: "private", useCache: false });
    if (!res) return null;
    return JSON.parse(await new Response(res.stream).text());
  }
  try {
    return JSON.parse(await readFile(/*turbopackIgnore: true*/ path.join(path.dirname(cartella()), nome), "utf8"));
  } catch {
    return null;
  }
}

async function scriviOggetto(nome: string, dati: unknown): Promise<void> {
  const testo = `${JSON.stringify(dati, null, 2)}\n`;
  if (suBlob()) {
    await put(nome, testo, { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
    return;
  }
  const file = path.join(path.dirname(cartella()), nome);
  await mkdir(/*turbopackIgnore: true*/ path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(/*turbopackIgnore: true*/ tmp, testo, "utf8");
  await rename(/*turbopackIgnore: true*/ tmp, file);
}

const nomePreventivo = (id: string) => `${path.basename(cartella())}/${id}.json`;

export async function leggi(id: string): Promise<Preventivo | null> {
  if (!ID.test(id)) return null;
  const raw = await leggiOggetto(nomePreventivo(id));
  const parsed = Preventivo.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export async function salva(p: Preventivo): Promise<void> {
  const valid = Preventivo.parse(p);
  await scriviOggetto(nomePreventivo(valid.id), valid);
  if (valid.tokenAccettazione) await scriviOggetto(`token/${valid.tokenAccettazione}.json`, { id: valid.id });
}

export async function leggiPerToken(token: string): Promise<Preventivo | null> {
  if (!ID.test(token)) return null;
  const indice = (await leggiOggetto(`token/${token}.json`)) as { id?: unknown } | null;
  if (!indice || typeof indice.id !== "string") return null;
  const p = await leggi(indice.id);
  return p?.tokenAccettazione === token ? p : null;
}

// Proposte per il listino che impara: un oggetto per preventivo, mai sovrascritte.
export async function salvaProposte(numero: string, proposte: unknown[]): Promise<void> {
  await scriviOggetto(`proposte/${numero}.json`, proposte);
}
