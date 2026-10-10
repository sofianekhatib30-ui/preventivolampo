import { redirect } from "next/navigation";
import { ORIGINE_APP, urlAccesso } from "@/lib/impresa/sessione";

export const dynamic = "force-dynamic";

// L'accesso si fa una volta sola, dall'account di K Digital Solution: Google, link via email
// o password. Poi si torna qui, nell'area di Preventivi.
export default function Accedi() {
  redirect(urlAccesso(`${ORIGINE_APP}/area`));
}
