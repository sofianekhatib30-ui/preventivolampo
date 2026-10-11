import { ACCOUNT } from "@/lib/impresa/sessione";

// L'area di Preventivi è uno strumento di K Digital Solution: stessi colori e caratteri di Attestiamo,
// Smistatore e dell'account. I colori arrivano dalla classe tema-kds (app/globals.css), che ridefinisce
// i token del sito pubblico di PreventivoLampo solo dentro l'area; i caratteri da kds-token.css dell'account.
export default function LayoutArea({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href={`${ACCOUNT}/ui/v1/kds-token.css`} precedence="default" />
      <div className="tema-kds min-h-dvh">{children}</div>
    </>
  );
}
