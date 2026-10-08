import type { Metadata } from "next";
import Link from "next/link";
import { euro } from "@/components/preventivo/formato";
import { TestataArea } from "@/components/area/TestataArea";
import { richiediImpresa } from "@/lib/impresa/pagine";
import { elencoPreventivi, type Riassunto } from "@/lib/impresa/preventivi";
import { elencoVoci } from "@/lib/impresa/voci";

export const metadata: Metadata = { title: "I tuoi preventivi · PreventivoLampo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const STATO: Record<Riassunto["stato"], { nome: string; classe: string }> = {
  bozza: { nome: "Da controllare", classe: "bg-ambra text-ambra-testo" },
  approvato: { nome: "Inviato", classe: "bg-fondo-2 text-testo-2" },
  accettato: { nome: "Accettato", classe: "bg-lime text-inchiostro" },
  rifiutato: { nome: "Rifiutato", classe: "bg-fondo-2 text-testo-3 line-through decoration-1" },
};

const data = (iso: string) => new Date(iso).toLocaleDateString("it-IT", { timeZone: "Europe/Rome", day: "numeric", month: "short" });

export default async function Area() {
  const a = await richiediImpresa();
  const [preventivi, voci] = await Promise.all([elencoPreventivi(a.impresaId), elencoVoci(a.impresaId)]);
  const conta = (s: Riassunto["stato"]) => preventivi.filter((p) => p.stato === s).length;
  const accettatiValore = preventivi.filter((p) => p.stato === "accettato").reduce((s, p) => s + p.totale_cents, 0);
  const inAttesa = preventivi.filter((p) => p.stato === "approvato").reduce((s, p) => s + p.totale_cents, 0);

  return (
    <>
      <TestataArea impresa={a.impresa.ragione_sociale} attiva="preventivi" daPrezzare={a.daPrezzare} />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-[34px] font-black leading-[1.02] [font-stretch:78%] sm:text-[44px]">Preventivi</h1>
          {voci.length > 0 && (
            <Link href="/area/nuovo" className="bottone bottone-azione min-h-14 text-[18px]">
              Nuovo preventivo
            </Link>
          )}
        </div>

        {voci.length === 0 && (
          <div className="mt-6 rounded-card bg-ardesia p-6 text-fondo">
            <p className="text-[22px] font-extrabold leading-tight">Manca solo il listino.</p>
            <p className="mt-1 text-[17px] text-scuro-testo">Importa il tuo file o parti dall&apos;esempio: poi il primo preventivo è un vocale.</p>
            <Link href="/area/listino" className="bottone bottone-azione-scuro mt-4 min-h-12 text-[16px]">
              Prepara il listino
            </Link>
          </div>
        )}

        {preventivi.length > 0 && (
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-card bg-linea ring-1 ring-linea sm:grid-cols-4">
            {[
              { n: String(conta("bozza")), t: "da controllare" },
              { n: String(conta("approvato")), t: `in attesa · ${euro(inAttesa)}` },
              { n: String(conta("accettato")), t: `accettati · ${euro(accettatiValore)}` },
              { n: String(conta("rifiutato")), t: "rifiutati" },
            ].map((x) => (
              <div key={x.t} className="bg-superficie px-4 py-3">
                <dt className="sr-only">{x.t}</dt>
                <dd className="font-mono text-[28px] font-semibold leading-tight">{x.n}</dd>
                <dd className="text-[14px] text-testo-3">{x.t}</dd>
              </div>
            ))}
          </dl>
        )}

        {preventivi.length === 0 && voci.length > 0 && (
          <div className="mt-8 rounded-card border-2 border-dashed border-linea-2 px-6 py-10 text-center">
            <p className="text-[20px] font-extrabold">Ancora nessun preventivo.</p>
            <p className="mt-1 text-[17px] text-testo-2">Racconta il prossimo sopralluogo: in mezzo minuto hai la bozza.</p>
          </div>
        )}

        {preventivi.length > 0 && (
          <ul className="mt-6 divide-y divide-linea overflow-hidden rounded-card bg-superficie ring-1 ring-linea">
            {preventivi.map((p) => (
              <li key={p.id}>
                <Link href={`/area/preventivi/${p.id}`} className="flex min-h-[72px] items-center gap-3 px-4 py-3 no-underline hover:bg-fondo sm:px-5">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[17px] font-bold">{p.cliente_nome ?? "Cliente da indicare"}</span>
                    <span className="block font-mono text-[14px] text-testo-3">
                      n. {p.numero} del {data(p.creato_il)}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className={`rounded-full px-2.5 py-0.5 text-[13px] font-bold ${STATO[p.stato].classe}`}>{STATO[p.stato].nome}</span>
                    {p.totale_cents > 0 && <span className="font-mono text-[15px] font-semibold">{euro(p.totale_cents)}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
