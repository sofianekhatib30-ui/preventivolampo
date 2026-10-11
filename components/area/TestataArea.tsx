import Link from "next/link";
import { Marchio } from "@/components/Marchio";
import { SceltaLingua } from "@/components/SceltaLingua";
import { dizionario } from "@/lib/i18n/server";
import { ACCOUNT } from "@/lib/impresa/sessione";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- è il modo in cui React dichiara i tag HTML.
  namespace JSX {
    interface IntrinsicElements {
      "kds-barra": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { modulo?: string; tema?: string };
    }
  }
}

// Testata dell'area: in cima la barra comune di K Digital Solution (organizzazione, strumenti, ricerca,
// notifiche, account e uscita), poi la testata dello strumento come in Attestiamo (marchio K, nome in
// Instrument Serif, impresa), lingua e sezioni. Colori KDS (border-cielo-scuro è il bordeaux:
// vedi app/globals.css). Sul telefono le sezioni scorrono in orizzontale e il nome dell'impresa si accorcia.
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
    <>
      <script type="module" src={`${ACCOUNT}/ui/v1/kds-ui.js`} async />
      <kds-barra id="barra" modulo="preventivi" />
      <header className="border-b border-linea bg-superficie">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-4">
            {/* Come negli altri strumenti, il marchio porta alla pagina iniziale del prodotto. */}
            <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2.5 text-inchiostro no-underline" aria-label={T.logo}>
              <Marchio className="size-[34px] shrink-0" />
              <span className="nome-strumento text-[26px] leading-none">Preventivi</span>
            </Link>
            {impresa && (
              <span className="min-w-0 truncate border-l border-linea pl-4 text-[14px] font-semibold text-testo-2">{impresa}</span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SceltaLingua compatto scuro={false} />
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
                    className={`flex min-h-12 items-center gap-1.5 whitespace-nowrap border-b-[3px] px-2.5 text-[15px] font-semibold no-underline sm:px-3 sm:text-[16px] ${
                      s.id === attiva ? "border-cielo-scuro text-inchiostro" : "border-transparent text-testo-2 hover:text-inchiostro"
                    }`}
                  >
                    {nome[s.id]}
                    {s.id === "da-prezzare" && daPrezzare > 0 && (
                      <span className="rounded-full bg-cielo-scuro px-2 py-0.5 font-mono text-[13px] font-bold text-fondo-2">
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
    </>
  );
}
