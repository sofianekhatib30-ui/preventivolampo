import { Frasi } from "@/components/Frasi";
import type { Dizionario } from "@/lib/i18n/it";

export function ComeFunziona({ d }: { d: Dizionario }) {
  const C = d.come;
  return (
    <section id="come" className="margini flex flex-col gap-7 bg-superficie py-14 lg:gap-14 lg:py-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <h2 className="titolo-h2 m-0 max-w-[720px]"><Frasi testo={C.titolo} /></h2>
        <p className="m-0 hidden max-w-[380px] text-lg leading-normal text-testo-2 lg:block">{C.sotto}</p>
      </div>
      <ol className="m-0 grid list-none gap-3 p-0 lg:grid-cols-2 lg:gap-5 xl:grid-cols-4">
        {C.passi.map((passo, i) => (
          <li key={i} className="flex flex-col gap-2 rounded-[18px] border border-linea bg-fondo p-5 lg:gap-4 lg:rounded-[20px] lg:p-7">
            <span className="font-mono text-[15px] font-semibold text-lime-scuro lg:text-base">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="m-0 text-2xl font-extrabold [font-stretch:80%] lg:text-[26px]">{passo.titolo}</h3>
            <p className="m-0 text-base leading-normal text-testo-2">{passo.testo}</p>
            <span className="mt-auto hidden font-mono text-sm text-testo-3 lg:block">{passo.nota}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
