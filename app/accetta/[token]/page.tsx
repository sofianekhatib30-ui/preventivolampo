import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Accetta from "@/components/preventivo/Accetta";
import { euro, UNITA_BREVE } from "@/components/preventivo/formato";
import { conti, importoRiga } from "@/lib/preventivi/calcolo";
import { leggiPerToken } from "@/lib/preventivi/archivio";
import { listino } from "@/lib/preventivi/servizio";

export const metadata: Metadata = { title: "Il tuo preventivo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Pagina del cliente: niente registrazione. Vede il preventivo e risponde con nome e data.
export default async function PaginaAccetta({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const p = await leggiPerToken(token);
  if (!p || p.stato === "bozza") notFound();
  const company = listino().company;
  const c = conti(p)!;
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <p className="font-mono text-sm text-testo-3">{company.name}</p>
      <h1 className="mt-2 text-3xl font-black">Preventivo n. {p.numero}</h1>
      <p className="mt-1 text-testo-2">
        Per {p.cliente.name ?? "—"}
        {p.cliente.address ? `, ${p.cliente.address}` : ""}
      </p>
      <ul className="mt-6 divide-y divide-linea rounded-card bg-superficie px-4">
        {p.righe.map((r, i) => (
          <li key={i} className="flex justify-between gap-4 py-3">
            <span>
              {r.work}
              <span className="block font-mono text-sm text-testo-3">
                {String(r.quantity).replace(".", ",")} {UNITA_BREVE[r.unit!]} × {euro(r.unitPriceCents!)}
              </span>
            </span>
            <span className="font-mono font-semibold">{euro(importoRiga(r)!)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-1 font-mono">
        <div className="flex justify-between">
          <span>Imponibile</span>
          <span>{euro(c.taxableCents)}</span>
        </div>
        <div className="flex justify-between">
          <span>IVA</span>
          <span>{euro(c.vatCents)}</span>
        </div>
        <div className="flex justify-between text-xl font-semibold">
          <span>Totale</span>
          <span>{euro(c.totalCents)}</span>
        </div>
      </div>
      {p.esclusioni.length > 0 && (
        <p className="mt-4 text-sm text-testo-2">Esclusi: {p.esclusioni.join("; ")}.</p>
      )}
      <p className="mt-4">
        <a href={`/api/preventivi/${p.id}/pdf`}>Scarica il PDF completo</a>
      </p>
      {p.stato === "approvato" ? (
        <Accetta token={token} />
      ) : (
        <p className="mt-6 rounded-campo bg-superficie p-4 font-semibold">
          {p.accettazione?.esito === "accettato" ? "Hai accettato" : "Hai rifiutato"} questo preventivo il{" "}
          {new Date(p.accettazione!.il).toLocaleDateString("it-IT")}.
        </p>
      )}
      <p className="mt-8 text-xs text-testo-3">{company.fictitiousNotice}</p>
    </main>
  );
}
