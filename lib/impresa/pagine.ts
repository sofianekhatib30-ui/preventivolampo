import { notFound, redirect } from "next/navigation";
import { contaAperte } from "./da-prezzare";
import { configurato } from "./db";
import { leggiImpresa, type Impresa } from "./imprese";
import { membro, sessione, type Membro, type Sessione } from "./sessione";

// Per le pagine dell'area: chi non è collegato va all'accesso, chi non ha un'impresa alla registrazione.

export async function richiediSessione(): Promise<Sessione> {
  if (!configurato()) notFound();
  const s = await sessione();
  if (!s) redirect("/accedi");
  return s;
}

export type Area = Membro & { impresa: Impresa; daPrezzare: number };

export async function richiediImpresa(): Promise<Area> {
  if (!configurato()) notFound();
  const m = await membro();
  if (!m) redirect((await sessione()) ? "/area/benvenuto" : "/accedi");
  const [impresa, daPrezzare] = await Promise.all([leggiImpresa(m.impresaId), contaAperte(m.impresaId)]);
  if (!impresa) redirect("/area/benvenuto");
  return { ...m, impresa, daPrezzare };
}
