import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EliminaBozza from "@/components/area/EliminaBozza";
import { TestataArea } from "@/components/area/TestataArea";
import Approvato from "@/components/preventivo/Approvato";
import Revisione from "@/components/preventivo/Revisione";
import { richiediImpresa } from "@/lib/impresa/pagine";
import { contestoImpresa, storia } from "@/lib/impresa/preventivi";

export const metadata: Metadata = { title: "Preventivo · PreventivoLampo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const quando = (iso: string) =>
  new Date(iso).toLocaleString("it-IT", { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

const COSA: Record<string, string> = {
  creato: "Bozza creata",
  approvato: "Approvato e pronto da mandare",
  visto: "Aperto dal cliente",
  accettato: "Accettato dal cliente",
  rifiutato: "Rifiutato dal cliente",
};

export default async function PaginaPreventivo({ params }: { params: Promise<{ id: string }> }) {
  const a = await richiediImpresa();
  const { id } = await params;
  const ctx = await contestoImpresa(a.impresaId);
  const p = await ctx.leggi(id);
  if (!p) notFound();
  const voci = (await ctx.voci()).map((v) => ({ code: v.code, name: v.name, unit: v.unit, priceCents: v.priceCents, significantGood: v.significantGood }));
  const eventi = p.stato === "bozza" ? [] : await storia(a.impresaId, p.id);
  return (
    <>
      <TestataArea impresa={a.impresa.ragione_sociale} attiva="preventivi" daPrezzare={a.daPrezzare} />
      <main className="mx-auto max-w-3xl px-4 pt-6 pb-10 sm:pt-10">
        <Link href="/area" className="text-[15px] font-semibold text-cielo-scuro">
          Tutti i preventivi
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
              Registro
            </h2>
            <ul className="mt-3 space-y-3">
              {eventi
                .filter((e) => COSA[e.tipo])
                .map((e, i) => {
                  const d = e.dati as { nome?: string; ip?: string; pdfSha256?: string };
                  return (
                    <li key={i} className="text-[15px]">
                      <span className="font-mono text-testo-3">{quando(e.il)}</span> <span className="font-semibold">{COSA[e.tipo]}</span>
                      {d.nome ? ` da ${d.nome}` : ""}
                      {(e.tipo === "accettato" || e.tipo === "rifiutato") && (
                        <span className="mt-0.5 block break-all font-mono text-[13px] text-testo-3">
                          {d.ip ? `IP ${d.ip}` : ""}
                          {d.pdfSha256 ? ` · impronta del PDF accettato ${d.pdfSha256}` : ""}
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
