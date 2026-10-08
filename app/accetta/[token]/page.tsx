import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Accetta from "@/components/preventivo/Accetta";
import { euro, UNITA_BREVE } from "@/components/preventivo/formato";
import { conti, importoRiga } from "@/lib/preventivi/calcolo";
import { perToken } from "@/lib/preventivi/risolvi";

export const metadata: Metadata = { title: "Il tuo preventivo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Pagina del cliente: niente registrazione. Vede il preventivo e risponde con nome e data.
export default async function PaginaAccetta({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const trovato = await perToken(token);
  if (!trovato || trovato.p.stato === "bozza") notFound();
  const { p } = trovato;
  const company = await trovato.ctx.azienda();
  const conLogo = trovato.ctx.tipo === "impresa" && (await company.logo()) !== null;
  const c = conti(p)!;
  const scadenza = p.approvatoIl ? new Date(new Date(p.approvatoIl).getTime() + company.quoteValidityDays * 86_400_000) : null;
  const data = (d: Date | string) => new Date(d).toLocaleDateString("it-IT", { timeZone: "Europe/Rome" });
  const iniziali = company.name
    .split(/\s+/)
    .filter((w) => /^[A-ZÀ-Ý]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <>
      {/* La pagina è dell'impresa, non di PreventivoLampo: il suo nome in alto, il nostro solo in fondo */}
      <header className="border-b border-linea bg-superficie">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          {conLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/api/accetta/${token}/logo`} alt="" className="h-11 w-auto max-w-28 shrink-0 object-contain" />
          ) : (
            <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-campo bg-ardesia text-[17px] font-black text-fondo">
              {iniziali}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-[17px] font-extrabold">{company.name}</p>
            <p className="truncate text-sm text-testo-3">P.IVA {company.vatNumber}</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
        <p className="text-sm text-testo-3">
          Preventivo n. <span className="font-mono">{p.numero}</span>
          {p.cliente.name ? ` per ${p.cliente.name}` : ""}
        </p>
        <h1 className="mt-1 text-[30px] font-black leading-[1.05] [font-stretch:80%] sm:text-[40px]">Il tuo preventivo</h1>
        {p.cliente.address && <p className="mt-1 text-[17px] text-testo-2">Lavori in {p.cliente.address}</p>}

        <div className="mt-5 rounded-card bg-ardesia p-5 text-fondo">
          <p className="text-[15px] text-scuro-testo">Totale IVA inclusa</p>
          <p className="font-mono text-[40px] font-semibold leading-tight">{euro(c.totalCents)}</p>
          <p className="mt-1 text-[15px] text-scuro-testo">
            Imponibile {euro(c.taxableCents)} + IVA {euro(c.vatCents)}
            {scadenza && p.stato === "approvato" ? ` · valido fino al ${data(scadenza)}` : ""}
          </p>
        </div>

        <p className="mt-5 text-[17px] text-testo-2">
          {p.righe
            .slice(0, 3)
            .map((r) => r.work)
            .join(", ")}
          {p.righe.length > 3 ? ` e altre ${p.righe.length - 3} lavorazioni.` : "."}
        </p>

        <details className="group mt-3 rounded-card bg-superficie ring-1 ring-linea">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 text-[17px] font-bold [&::-webkit-details-marker]:hidden">
            Dettaglio delle {p.righe.length} voci
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 motion-safe:transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 8l5 5 5-5" />
            </svg>
          </summary>
          <ul className="divide-y divide-linea border-t border-linea px-5">
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
        </details>

        {p.esclusioni.length > 0 && <p className="mt-4 text-[15px] text-testo-2">Esclusi: {p.esclusioni.join("; ")}.</p>}
        <p className="mt-4">
          <a href={`/api/accetta/${token}/pdf`} className="text-[16px] font-semibold text-cielo-scuro">
            Scarica il PDF completo
          </a>
        </p>

        {p.stato === "approvato" ? (
          <Accetta token={token} />
        ) : (
          <p className="mt-8 flex items-center gap-3 rounded-card bg-superficie p-5 text-[17px] font-semibold ring-1 ring-linea">
            <span aria-hidden="true" className={`flex size-9 shrink-0 items-center justify-center rounded-full ${p.accettazione?.esito === "accettato" ? "bg-lime" : "bg-fondo-2"}`}>
              {p.accettazione?.esito === "accettato" ? "✓" : "×"}
            </span>
            {p.accettazione?.esito === "accettato" ? "Hai accettato" : "Hai rifiutato"} questo preventivo il {data(p.accettazione!.il)}.
          </p>
        )}
        <footer className="mt-10 border-t border-linea pt-4 text-xs leading-relaxed text-testo-3">
          {company.avviso && <p className="mb-2">{company.avviso}</p>}
          <p>Preventivo creato con PreventivoLampo.</p>
        </footer>
      </main>
    </>
  );
}
