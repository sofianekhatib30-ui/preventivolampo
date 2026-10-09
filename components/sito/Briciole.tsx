import { type LinguaSito, percorso } from "@/lib/i18n/lingue";

// Percorso della pagina (Home › Mestieri › Elettricista). L'ultima voce è la pagina stessa, senza link.
export function Briciole({ lingua, voci, etichetta }: { lingua: LinguaSito; voci: { nome: string; p: string }[]; etichetta: string }) {
  return (
    <nav aria-label={etichetta} className="text-[14px] text-scuro-testo">
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0">
        {voci.map((v, i) => (
          <li key={v.p} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-scuro-nota rtl:-scale-x-100">
                ›
              </span>
            )}
            {i < voci.length - 1 ? (
              <a href={percorso(lingua, v.p)} className="no-underline hover:text-lime hover:underline">
                {v.nome}
              </a>
            ) : (
              <span aria-current="page" className="text-fondo">
                {v.nome}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
