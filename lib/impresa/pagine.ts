import { notFound, redirect } from "next/navigation";
import { contaAperte } from "./da-prezzare";
import { configurato } from "./db";
import { leggiImpresa, type Impresa } from "./imprese";
import { contesto, membroDa, ORIGINE_APP, urlAccesso, type Contesto, type Membro } from "./sessione";

// Per le pagine dell'area: chi non è collegato va all'accesso unico dell'account,
// chi non ha ancora l'impresa alla registrazione, chi non ha il modulo alla pagina che lo spiega.

export async function richiediContesto(qui = "/area"): Promise<Contesto> {
  if (!configurato()) notFound();
  const c = await contesto();
  if (!c) redirect(urlAccesso(`${ORIGINE_APP}${qui}`));
  return c;
}

export type Area = Membro & { impresa: Impresa; daPrezzare: number; contesto: Contesto };

export async function richiediImpresa(qui = "/area"): Promise<Area> {
  const c = await richiediContesto(qui);
  if (!c.orgId || !c.lettura) redirect("/area/benvenuto");
  const m = membroDa(c);
  if (!m) redirect("/area/benvenuto");
  const [impresa, daPrezzare] = await Promise.all([leggiImpresa(m.impresaId), contaAperte(m.impresaId)]);
  if (!impresa) redirect("/area/benvenuto");
  return { ...m, impresa, daPrezzare, contesto: c };
}
