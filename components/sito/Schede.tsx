// Elenco di pagine come schede: nome che porta alla pagina e una riga su cosa contiene.
export function Schede({ voci, colonne = 3 }: { voci: { href: string; nome: string; riga: string }[]; colonne?: 2 | 3 }) {
  return (
    <ul className={`m-0 grid list-none gap-px overflow-hidden rounded-[20px] border border-linea-2 bg-linea-2 p-0 sm:grid-cols-2 ${colonne === 3 ? "xl:grid-cols-3" : ""}`}>
      {voci.map((v) => (
        <li key={v.href} className="relative flex flex-col gap-2 bg-superficie p-6 transition-colors hover:bg-fondo lg:p-7">
          <a href={v.href} className="text-[22px] font-extrabold leading-tight no-underline [font-stretch:80%] after:absolute after:inset-0 after:content-[''] hover:underline lg:text-[24px]">
            {v.nome}
          </a>
          <p className="m-0 text-[16px] leading-snug text-testo-2">{v.riga}</p>
          <span aria-hidden="true" className="mt-auto pt-2 text-[20px] font-bold text-lime-scuro rtl:-scale-x-100">
            →
          </span>
        </li>
      ))}
    </ul>
  );
}
