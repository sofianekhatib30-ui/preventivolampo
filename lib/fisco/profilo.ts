import { mestiere } from "@/lib/impresa/mestieri";
import type { Aliquota, ProfiloFiscale } from "./schema";

// Dal profilo dell'impresa (regime, ritenuta, rivalsa, mestieri) al profilo che il preventivo fotografa.

export type DatiFiscaliImpresa = {
  regime_fiscale: "ordinario" | "forfettario";
  ritenuta: boolean;
  rivalsa_inps: boolean;
  mestieri: readonly string[];
};

export function profiloDa(imp: DatiFiscaliImpresa): ProfiloFiscale {
  const ms = imp.mestieri.map(mestiere).filter((m) => m !== undefined);
  // Nessun mestiere indicato: si chiede tutto, come per un'impresa edile.
  const edifici = ms.length === 0 || ms.some((m) => m.tipo !== "no");
  const aliquote = [...new Set(ms.map((m) => m.aliquota))];
  // Un'aliquota propria vale per tutte le righe solo se è la stessa per tutti i mestieri dell'impresa.
  const aliquotaBase: Aliquota = aliquote.length === 1 ? aliquote[0] : "22";
  const esenzione = ms.find((m) => m.aliquota === "esente" && "esenzione" in m)?.esenzione ?? null;
  const avvisi = ms.flatMap((m) => ("avviso" in m && m.avviso ? [m.avviso] : []));
  if (aliquote.length > 1) avvisi.unshift("I tuoi mestieri hanno aliquote diverse: le righe senza un'aliquota propria vanno al 22%. Indica l'aliquota sulle voci del listino che ne hanno una diversa.");
  return {
    regime: imp.regime_fiscale,
    ritenuta: imp.ritenuta,
    rivalsaInps: imp.rivalsa_inps,
    edifici,
    pulizie: ms.some((m) => m.chiave === "pulizie"),
    aliquotaBase,
    esenzione,
    avvisi: [...new Set(avvisi)].slice(0, 20),
  };
}
