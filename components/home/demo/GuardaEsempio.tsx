"use client";

import { EVENTO_MESTIERE } from "./scenari";

// Porta all'esempio animato in cima alla pagina, già sul mestiere giusto.
export function GuardaEsempio({ id, testo }: { id: string; testo: string }) {
  return (
    <a
      href="#esempio"
      onClick={() => window.dispatchEvent(new CustomEvent(EVENTO_MESTIERE, { detail: id }))}
      className="flex min-h-10 shrink-0 items-center text-[14px] font-semibold text-cielo-scuro"
    >
      {testo}
    </a>
  );
}
