import type { Metadata } from "next";
import { FaviconAnimata } from "@/components/FaviconAnimata";
import { classiCaratteri } from "@/lib/brand/caratteri";
import { LinguaProvider } from "@/lib/i18n/client";
import { INFO_LINGUA } from "@/lib/i18n/lingue";
import { dizionario } from "@/lib/i18n/server";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/sito";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  // Area dell'artigiano, pagina del cliente, prova: mai nei motori di ricerca.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "PreventivoLampo",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

// Layout dell'area dell'artigiano e delle pagine di servizio (accettazione, prova). La lingua arriva
// dal cookie di preferenza (lib/i18n): lang e dir sull'html, e il dizionario ai componenti del browser.
// Le pagine pubbliche hanno il loro layout, con la lingua nell'indirizzo: app/(sito)/[lang]/layout.tsx.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lingua, d } = await dizionario();
  return (
    <html lang={lingua} dir={INFO_LINGUA[lingua].dir} className={classiCaratteri}>
      <body className="min-h-dvh">
        <LinguaProvider lingua={lingua} d={d}>
          {children}
        </LinguaProvider>
        <FaviconAnimata />
      </body>
    </html>
  );
}
