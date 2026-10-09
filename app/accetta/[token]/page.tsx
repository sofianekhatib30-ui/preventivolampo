import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Accetta from "@/components/preventivo/Accetta";
import { euro, UNITA_BREVE } from "@/components/preventivo/formato";
import { conti, importoRiga } from "@/lib/preventivi/calcolo";
import { LOCALE, linguaDi, NOME_LINGUA, TESTI, traduzioneAllineata } from "@/lib/preventivi/lingua";
import { Bandiera } from "@/components/SceltaLingua";
import { INFO_LINGUA } from "@/lib/i18n/lingue";
import { recesso } from "@/lib/preventivi/recesso";
import { perToken } from "@/lib/preventivi/risolvi";

export const metadata: Metadata = { title: "Il tuo preventivo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Pagina del cliente: niente registrazione. Vede il preventivo e risponde con nome e data.
// Cliente straniero: la pagina è nella sua lingua, con il testo italiano delle voci accanto e il
// link alla versione italiana (?lingua=it), che in caso di discordanza prevale.
export default async function PaginaAccetta({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ lingua?: string }> }) {
  const { token } = await params;
  const richiesta = (await searchParams).lingua;
  const trovato = await perToken(token);
  if (!trovato || trovato.p.stato === "bozza") notFound();
  const { p } = trovato;
  const tr = linguaDi(p) !== "it" && traduzioneAllineata(p) ? p.traduzione! : null;
  const L = tr && richiesta !== "it" ? tr.lingua : "it";
  const T = L === "it" ? null : TESTI[L];
  const company = await trovato.ctx.azienda();
  const conLogo = trovato.ctx.tipo === "impresa" && (await company.logo()) !== null;
  const c = conti(p)!;
  const scadenza = p.approvatoIl ? new Date(new Date(p.approvatoIl).getTime() + company.quoteValidityDays * 86_400_000) : null;
  const data = (d: Date | string) => new Date(d).toLocaleDateString(LOCALE[L], { timeZone: "Europe/Rome" });
  const voce = (i: number) => (T && tr ? tr.righe[i] : p.righe[i].work);
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
      <main lang={L} className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
        {tr && (
          <nav aria-label="Lingua / Language" className="mb-5 flex items-center justify-end gap-2">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-testo-3" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9s1.3-6.4 3.8-9Z" />
            </svg>
            <span className="inline-flex rounded-full bg-superficie p-1 ring-1 ring-linea">
              {([["it", "?lingua=it"], [tr.lingua, "?"]] as const).map(([l, href]) => (
                <a
                  key={l}
                  href={href}
                  lang={l}
                  aria-current={L === l ? "true" : undefined}
                  className={`flex min-h-10 items-center gap-2 rounded-full px-3.5 text-[15px] font-semibold no-underline ${
                    L === l ? "bg-ardesia text-fondo" : "text-testo-2 hover:text-inchiostro"
                  }`}
                >
                  <Bandiera codice={INFO_LINGUA[l].bandiera} />
                  {NOME_LINGUA[l].proprio}
                </a>
              ))}
            </span>
          </nav>
        )}
        <p className="text-sm text-testo-3">
          {T ? T.preventivoN : "Preventivo n."} <span className="font-mono">{p.numero}</span>
          {p.cliente.name ? ` ${T ? T.pagina.per(p.cliente.name) : `per ${p.cliente.name}`}` : ""}
        </p>
        <h1 className="mt-1 text-[30px] font-black leading-[1.05] [font-stretch:80%] sm:text-[40px]">{T ? T.pagina.titolo : "Il tuo preventivo"}</h1>
        {p.cliente.address && <p className="mt-1 text-[17px] text-testo-2">{T ? T.pagina.lavoriIn(p.cliente.address) : `Lavori in ${p.cliente.address}`}</p>}

        <div className="mt-5 rounded-card bg-ardesia p-5 text-fondo">
          <p className="text-[15px] text-scuro-testo">{T ? T.pagina.totaleIncl : "Totale IVA inclusa"}</p>
          <p className="font-mono text-[40px] font-semibold leading-tight">{euro(c.totalCents)}</p>
          <p className="mt-1 text-[15px] text-scuro-testo">
            {T ? T.pagina.imponibilePiuIva(euro(c.taxableCents), euro(c.vatCents)) : `Imponibile ${euro(c.taxableCents)} + IVA ${euro(c.vatCents)}`}
            {scadenza && p.stato === "approvato" ? ` · ${T ? T.pagina.validoFino(data(scadenza)) : `valido fino al ${data(scadenza)}`}` : ""}
          </p>
        </div>

        <p className="mt-5 text-[17px] text-testo-2">
          {p.righe
            .slice(0, 3)
            .map((_, i) => voce(i))
            .join(", ")}
          {p.righe.length > 3 ? ` ${T ? T.pagina.eAltre(p.righe.length - 3) : `e altre ${p.righe.length - 3} lavorazioni.`}` : "."}
        </p>

        <details className="group mt-3 rounded-card bg-superficie ring-1 ring-linea">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 text-[17px] font-bold [&::-webkit-details-marker]:hidden">
            {T ? T.pagina.dettaglio(p.righe.length) : `Dettaglio delle ${p.righe.length} voci`}
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 motion-safe:transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 8l5 5 5-5" />
            </svg>
          </summary>
          <ul className="divide-y divide-linea border-t border-linea px-5">
            {p.righe.map((r, i) => (
              <li key={i} className="flex justify-between gap-4 py-3">
                <span>
                  {voce(i)}
                  {T && (
                    <span lang="it" className="block text-sm text-testo-3">
                      {r.work}
                    </span>
                  )}
                  <span className="block font-mono text-sm text-testo-3">
                    {String(r.quantity).replace(".", ",")} {UNITA_BREVE[r.unit!]} × {euro(r.unitPriceCents!)}
                  </span>
                </span>
                <span className="font-mono font-semibold">{euro(importoRiga(r)!)}</span>
              </li>
            ))}
          </ul>
        </details>

        {p.esclusioni.length > 0 && (
          <p className="mt-4 text-[15px] text-testo-2">
            {T && tr ? `${T.pagina.esclusi} ${tr.esclusioni.join("; ")}.` : `Esclusi: ${p.esclusioni.join("; ")}.`}
          </p>
        )}
        <p className="mt-4">
          <a href={`/api/accetta/${token}/pdf`} className="text-[16px] font-semibold text-cielo-scuro">
            {T ? T.pagina.scaricaPdf : tr ? `Scarica il PDF completo (italiano e ${NOME_LINGUA[tr.lingua].italiano})` : "Scarica il PDF completo"}
          </a>
        </p>

        <RecessoBox r={recesso(L, { nome: company.name, indirizzo: company.address, telefono: company.phone, email: company.email }, p.numero)} />
        {tr && L !== "it" && (
          <p className="mt-2 text-[14px] text-testo-3" lang="it">
            In caso di discordanza tra le due lingue prevale il testo italiano.{" "}
            <a href="?lingua=it" className="font-semibold text-cielo-scuro">
              Versione italiana
            </a>
          </p>
        )}

        {p.stato === "approvato" ? (
          <Accetta token={token} testi={T?.accetta} />
        ) : (
          <p className="mt-8 flex items-center gap-3 rounded-card bg-superficie p-5 text-[17px] font-semibold ring-1 ring-linea">
            <span aria-hidden="true" className={`flex size-9 shrink-0 items-center justify-center rounded-full ${p.accettazione?.esito === "accettato" ? "bg-lime" : "bg-fondo-2"}`}>
              {p.accettazione?.esito === "accettato" ? "✓" : "×"}
            </span>
            {T
              ? T.pagina.risposta(p.accettazione!.esito, data(p.accettazione!.il))
              : `${p.accettazione?.esito === "accettato" ? "Hai accettato" : "Hai rifiutato"} questo preventivo il ${data(p.accettazione!.il)}.`}
          </p>
        )}
        <footer className="mt-10 border-t border-linea pt-4 text-xs leading-relaxed text-testo-3">
          {company.avviso && <p className="mb-2">{company.avviso}</p>}
          <p>{T ? T.pagina.creato : "Preventivo creato con PreventivoLampo."}</p>
        </footer>
      </main>
    </>
  );
}

// Informazioni sul recesso e modulo tipo, nella lingua della pagina (lib/preventivi/recesso.ts).
function RecessoBox({ r }: { r: ReturnType<typeof recesso> }) {
  return (
    <details className="group mt-4 rounded-card bg-superficie ring-1 ring-linea">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 text-[17px] font-bold [&::-webkit-details-marker]:hidden">
        {r.titolo}
        <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 motion-safe:transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 8l5 5 5-5" />
        </svg>
      </summary>
      <div className="space-y-3 border-t border-linea px-5 py-4 text-[15px] leading-relaxed text-testo-2">
        {r.paragrafi.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
        <h3 className="pt-1 text-[16px] font-bold text-inchiostro">{r.effettiTitolo}</h3>
        {r.effetti.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
        <div className="rounded-campo bg-fondo p-4">
          <h3 className="text-[16px] font-bold text-inchiostro">{r.modulo.titolo}</h3>
          <p className="text-[14px] text-testo-3">{r.modulo.istruzione}</p>
          <ul className="mt-2 space-y-1.5">
            {r.modulo.righe.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}
