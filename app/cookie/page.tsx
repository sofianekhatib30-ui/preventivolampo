import type { Metadata } from "next";
import { PaginaLegale } from "@/components/PaginaLegale";

export const metadata: Metadata = {
  title: "Cookie · PreventivoLampo",
};

export default function Page() {
  return <PaginaLegale titolo="Cookie" />;
}
