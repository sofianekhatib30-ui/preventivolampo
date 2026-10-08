import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Accesso from "@/components/area/Accesso";
import { TestataArea } from "@/components/area/TestataArea";
import { configurato } from "@/lib/impresa/db";
import { sessione } from "@/lib/impresa/sessione";

export const metadata: Metadata = { title: "Accedi · PreventivoLampo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Accedi() {
  if (!configurato()) notFound();
  if (await sessione()) redirect("/area");
  return (
    <>
      <TestataArea />
      <main className="mx-auto max-w-md px-4 py-10 sm:py-16">
        <h1 className="text-[40px] font-black leading-[1] [font-stretch:76%] sm:text-[52px]">Entra nei tuoi preventivi</h1>
        <p className="mt-3 text-[18px] leading-relaxed text-testo-2">Il tuo listino, i tuoi prezzi, i preventivi con il tuo nome sopra.</p>
        <Accesso />
        <p className="mt-10 text-sm leading-relaxed text-testo-3">
          Accedendo accetti le{" "}
          <Link href="/condizioni" className="font-semibold text-cielo-scuro">
            condizioni
          </Link>{" "}
          e l&apos;
          <Link href="/privacy" className="font-semibold text-cielo-scuro">
            informativa privacy
          </Link>
          .
        </p>
      </main>
    </>
  );
}
