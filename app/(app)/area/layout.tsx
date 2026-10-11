import { ACCOUNT } from "@/lib/impresa/sessione";

// L'area di Preventivi: colori e caratteri KDS vengono da app/globals.css come nel resto del sito;
// kds-token.css dell'account serve alla barra comune, che ne legge le variabili --kds-*.
export default function LayoutArea({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href={`${ACCOUNT}/ui/v1/kds-token.css`} precedence="default" />
      <div className="min-h-dvh">{children}</div>
    </>
  );
}
