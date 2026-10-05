import { conti } from "@/lib/preventivi/calcolo";
import type { Preventivo } from "@/lib/preventivi/modello";
import { euro } from "./formato";

const STATO: Record<string, string> = {
  approvato: "Approvato: in attesa della risposta del cliente",
  accettato: "Accettato dal cliente",
  rifiutato: "Rifiutato dal cliente",
};

export default function Approvato({ p }: { p: Preventivo }) {
  const c = conti(p);
  return (
    <section>
      <p className="font-mono text-sm text-testo-3">Preventivo n. {p.numero}</p>
      <h1 className="mt-2 text-3xl font-black">{STATO[p.stato]}</h1>
      {p.accettazione && (
        <p className="mt-2 text-testo-2">
          {p.accettazione.esito === "accettato" ? "Accettato" : "Rifiutato"} da {p.accettazione.nome} il{" "}
          {new Date(p.accettazione.il).toLocaleString("it-IT")}.
        </p>
      )}
      {c && <p className="mt-4 font-mono text-2xl font-semibold">Totale {euro(c.totalCents)}</p>}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a href={`/api/preventivi/${p.id}/pdf`} className="rounded-campo bg-inchiostro px-5 py-4 text-center font-bold text-fondo no-underline">
          Apri il PDF
        </a>
        {p.stato === "approvato" && p.tokenAccettazione && (
          <a href={`/accetta/${p.tokenAccettazione}`} className="rounded-campo border-2 border-inchiostro px-5 py-4 text-center font-bold no-underline">
            Link per il cliente
          </a>
        )}
      </div>
      <p className="mt-4 text-sm text-testo-3">
        Il link per il cliente apre il preventivo e gli permette di accettarlo con nome e data, senza registrarsi.
      </p>
    </section>
  );
}
