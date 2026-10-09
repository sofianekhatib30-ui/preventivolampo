import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Accesso from "@/components/area/Accesso";
import { TestataArea } from "@/components/area/TestataArea";
import { Ricco } from "@/components/Ricco";
import { dizionario } from "@/lib/i18n/server";
import { configurato } from "@/lib/impresa/db";
import { sessione } from "@/lib/impresa/sessione";

export const metadata: Metadata = { title: "Accedi · PreventivoLampo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Accedi() {
  if (!configurato()) notFound();
  if (await sessione()) redirect("/area");
  const { d } = await dizionario();
  const A = d.accesso;
  return (
    <>
      <TestataArea />
      <main className="mx-auto max-w-md px-4 py-10 sm:py-16">
        <h1 className="text-[40px] font-black leading-[1] [font-stretch:76%] sm:text-[52px]">{A.h1}</h1>
        <p className="mt-3 text-[18px] leading-relaxed text-testo-2">{A.sotto}</p>
        <Accesso />
        <p className="mt-10 text-sm leading-relaxed text-testo-3">
          <Ricco testo={A.condizioni} classeLink="font-semibold text-cielo-scuro" />
        </p>
      </main>
    </>
  );
}
