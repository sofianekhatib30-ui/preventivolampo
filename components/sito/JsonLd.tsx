import { jsonLdHtml } from "@/lib/json-ld";

export function JsonLd({ dati }: { dati: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(dati) }} />;
}
