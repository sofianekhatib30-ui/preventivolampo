import { Fragment, type ReactNode } from "react";

// Testo del dizionario con i soli segni ammessi: **grassetto** e [testo](indirizzo).
// Niente HTML nei dizionari: quello che non è uno di questi segni resta testo.
export function Ricco({ testo, classeLink = "", classeGrassetto = "" }: { testo: string; classeLink?: string; classeGrassetto?: string }) {
  const parti: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let ultimo = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(testo))) {
    if (m.index > ultimo) parti.push(<Fragment key={i++}>{testo.slice(ultimo, m.index)}</Fragment>);
    if (m[1] !== undefined) parti.push(<strong key={i++} className={classeGrassetto}>{m[1]}</strong>);
    else {
      const href = m[3];
      const esterno = /^https?:/.test(href);
      parti.push(
        <a key={i++} href={href} className={classeLink} {...(esterno ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {m[2]}
        </a>,
      );
    }
    ultimo = m.index + m[0].length;
  }
  if (ultimo < testo.length) parti.push(<Fragment key={i++}>{testo.slice(ultimo)}</Fragment>);
  return <>{parti}</>;
}

// Testo del dizionario i cui {segnaposto} diventano elementi: «Bozza n. {numero}» con il numero in
// carattere mono. Quello che arriva nei valori non viene interpretato: un nome con * o [ resta com'è.
export function ConNodi({ testo, valori }: { testo: string; valori: Record<string, ReactNode> }) {
  return (
    <>
      {testo.split(/(\{\w+\})/).map((pezzo, i) => {
        const m = /^\{(\w+)\}$/.exec(pezzo);
        return <Fragment key={i}>{m && m[1] in valori ? valori[m[1]] : pezzo}</Fragment>;
      })}
    </>
  );
}
