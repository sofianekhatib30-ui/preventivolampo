import type { Metadata } from "next";
import { FaviconAnimata } from "@/components/FaviconAnimata";
import { classiCaratteri } from "@/lib/brand/caratteri";
import { LinguaProvider } from "@/lib/i18n/client";
import { INFO_LINGUA, LINGUE_SITO, LOCALE_OG, linguaValida } from "@/lib/i18n/lingue";
import { dizionarioClientPubblico } from "@/lib/i18n/server";
import { SITE_URL } from "@/lib/sito";
import "../../globals.css";

// Layout delle pagine pubbliche: la lingua viene dall'indirizzo (/ro/…, l'italiano senza prefisso,
// vedi proxy.ts). Tutte le pagine si generano statiche, una per lingua.
export const dynamicParams = false;

export function generateStaticParams() {
  return LINGUE_SITO.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const lingua = linguaValida((await params).lang);
  return {
    metadataBase: new URL(SITE_URL),
    openGraph: { type: "website", siteName: "PreventivoLampo", locale: LOCALE_OG[lingua] },
  };
}

export default async function LayoutSito({ children, params }: LayoutProps<"/[lang]">) {
  const lingua = linguaValida((await params).lang);
  return (
    <html lang={lingua} dir={INFO_LINGUA[lingua].dir} className={classiCaratteri}>
      <body className="min-h-dvh">
        <LinguaProvider lingua={lingua} d={dizionarioClientPubblico(lingua)} pubblica>
          {children}
        </LinguaProvider>
        <FaviconAnimata />
      </body>
    </html>
  );
}
