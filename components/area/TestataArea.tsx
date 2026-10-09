import Link from "next/link";
import { Marchio } from "@/components/Marchio";
import { SceltaLingua } from "@/components/SceltaLingua";
import { dizionario } from "@/lib/i18n/server";
import Esci from "./Esci";

// Testata dell'area: marchio, nome dell'impresa, lingua, sezioni. Sul telefono le sezioni scorrono in orizzontale.
const SEZIONI = [
  { id: "preventivi", href: "/area" },
  { id: "listino", href: "/area/listino" },
  { id: "da-prezzare", href: "/area/da-prezzare" },
  { id: "impresa", href: "/area/impresa" },
] as const;

export type Sezione = (typeof SEZIONI)[number]["id"];

export async function TestataArea({ impresa, attiva, daPrezzare = 0 }: { impresa?: string; attiva?: Sezione; daPrezzare?: number }) {
  const { d } = await dizionario();
  const T = d.area.testata;
  const nome: Record<Sezione, string> = { preventivi: T.preventivi, listino: T.listino, "da-prezzare": T.daPrezzare, impresa: T.impresa };
  return (
    <header className="su-scuro bg-ardesia text-fondo">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
        <Link href={impresa ? "/area" : "/"} className="flex min-h-11 min-w-0 items-center gap-2.5 no-underline" aria-label={T.logo}>
          <Marchio className="size-9 shrink-0" />
          <span className="min-w-0 truncate text-[19px] font-extrabold [font-stretch:78%]">{impresa ?? "PreventivoLampo"}</span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <SceltaLingua compatto />
          {impresa && <Esci className="min-h-11 shrink-0 px-2 text-[15px] font-semibold text-scuro-testo underline" />}
        </div>
      </div>
      {impresa && attiva && (
        <nav aria-label={T.sezioni} className="mx-auto max-w-5xl overflow-x-auto px-2 [scrollbar-width:none]">
          <ul className="flex gap-0.5 sm:gap-1">
            {SEZIONI.map((s) => (
              <li key={s.id}>
                <Link
                  href={s.href}
                  aria-current={s.id === attiva ? "page" : undefined}
                  className={`flex min-h-12 items-center gap-1.5 whitespace-nowrap border-b-4 px-2.5 text-[15px] font-bold no-underline sm:px-3 sm:text-[16px] ${
                    s.id === attiva ? "border-lime text-fondo" : "border-transparent text-scuro-testo hover:text-fondo"
                  }`}
                >
                  {nome[s.id]}
                  {s.id === "da-prezzare" && daPrezzare > 0 && (
                    <span className="rounded-full bg-lime px-2 py-0.5 font-mono text-[13px] font-bold text-inchiostro">
                      {daPrezzare}
                      <span className="sr-only"> {T.proposte}</span>
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
