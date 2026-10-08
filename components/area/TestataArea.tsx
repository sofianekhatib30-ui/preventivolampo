import Link from "next/link";
import { Marchio } from "@/components/Marchio";
import Esci from "./Esci";

// Testata dell'area: marchio, nome dell'impresa, sezioni. Sul telefono le sezioni scorrono in orizzontale.
const SEZIONI = [
  { id: "preventivi", href: "/area", nome: "Preventivi" },
  { id: "listino", href: "/area/listino", nome: "Listino" },
  { id: "da-prezzare", href: "/area/da-prezzare", nome: "Da prezzare" },
  { id: "impresa", href: "/area/impresa", nome: "Impresa" },
] as const;

export type Sezione = (typeof SEZIONI)[number]["id"];

export function TestataArea({ impresa, attiva, daPrezzare = 0 }: { impresa?: string; attiva?: Sezione; daPrezzare?: number }) {
  return (
    <header className="su-scuro bg-ardesia text-fondo">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
        <Link href={impresa ? "/area" : "/"} className="flex min-h-11 min-w-0 items-center gap-2.5 no-underline" aria-label="PreventivoLampo, i tuoi preventivi">
          <Marchio className="size-9 shrink-0" />
          <span className="min-w-0 truncate text-[19px] font-extrabold [font-stretch:78%]">{impresa ?? "PreventivoLampo"}</span>
        </Link>
        {impresa && <Esci className="min-h-11 shrink-0 px-2 text-[15px] font-semibold text-scuro-testo underline" />}
      </div>
      {impresa && attiva && (
        <nav aria-label="Sezioni" className="mx-auto max-w-5xl overflow-x-auto px-2 [scrollbar-width:none]">
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
                  {s.nome}
                  {s.id === "da-prezzare" && daPrezzare > 0 && (
                    <span className="rounded-full bg-lime px-2 py-0.5 font-mono text-[13px] font-bold text-inchiostro">
                      {daPrezzare}
                      <span className="sr-only"> proposte</span>
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
