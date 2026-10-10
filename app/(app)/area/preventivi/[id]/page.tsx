import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EliminaBozza from "@/components/area/EliminaBozza";
import { TestataArea } from "@/components/area/TestataArea";
import Approvato from "@/components/preventivo/Approvato";
import Revisione from "@/components/preventivo/Revisione";
import { dizionario } from "@/lib/i18n/server";
import { fmt } from "@/lib/i18n/testo";
import { richiediImpresa } from "@/lib/impresa/pagine";
import { contestoImpresa, storia } from "@/lib/impresa/preventivi";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await dizionario();
  return { title: `${d.area.titoli.preventivo} · Preventivi`, robots: { index: false, follow: false } };
}
export const dynamic = "force-dynamic";

const quando = (iso: string) =>
  new Date(iso).toLocaleString("it-IT", { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function PaginaPreventivo({ params }: { params: Promise<{ id: string }> }) {
  const a = await richiediImpresa();
  const { id } = await params;
  const ctx = await contestoImpresa(a.impresaId);
  const p = await ctx.leggi(id);
  if (!p) notFound();
  const voci = (await ctx.voci()).map((v) => ({ code: v.code, name: v.name, unit: v.unit, priceCents: v.priceCents, significantGood: v.significantGood }));
  const eventi = p.stato === "bozza" ? [] : await storia(a.impresaId, p.id);
  const { d: diz } = await dizionario();
  const P = diz.area.preventivo;
  // Gli eventi che il registro mostra, con il loro nome; gli altri tipi restano fuori.
  const COSA: Record<string, string> = P.eventi;
  return (
    <>
      <TestataArea impresa={a.impresa.ragione_sociale} attiva="preventivi" daPrezzare={a.daPrezzare} />
      <main className="mx-auto max-w-3xl px-4 pt-6 pb-10 sm:pt-10">
        <Link href="/area" className="text-[15px] font-semibold text-cielo-scuro">
          {P.tutti}
        </Link>
        <div className="mt-3">
          {p.stato === "bozza" ? <Revisione iniziale={p} voci={voci} api="/api/area/preventivi" traduzioni /> : <Approvato p={p} pdf={`/api/area/preventivi/${p.id}/pdf`} />}
        </div>
        {p.stato === "bozza" && (
          <div className="mt-8 border-t border-linea pt-4">
            <EliminaBozza id={p.id} />
          </div>
        )}
        {eventi.length > 0 && (
          <section className="mt-10 border-t border-linea pt-6" aria-labelledby="titolo-storia">
            <h2 id="titolo-storia" className="text-xl font-extrabold">
              {P.registro}
            </h2>
            <ul className="mt-3 space-y-3">
              {eventi
                .filter((e) => COSA[e.tipo])
                .map((e, i) => {
                  const d = e.dati as { nome?: string; ip?: string; pdfSha256?: string };
                  return (
                    <li key={i} className="text-[15px]">
                      <span className="font-mono text-testo-3">{quando(e.il)}</span> <span className="font-semibold">{COSA[e.tipo]}</span>
                      {d.nome ? ` ${fmt(P.da, { nome: d.nome })}` : ""}
                      {(e.tipo === "accettato" || e.tipo === "rifiutato") && (
                        <span className="mt-0.5 block break-all font-mono text-[13px] text-testo-3">
                          {d.ip ? fmt(P.ip, { ip: d.ip }) : ""}
                          {d.pdfSha256 ? ` · ${fmt(P.impronta, { impronta: d.pdfSha256 })}` : ""}
                        </span>
                      )}
                    </li>
                  );
                })}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
