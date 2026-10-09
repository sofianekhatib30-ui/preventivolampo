import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { FaviconAnimata } from "@/components/FaviconAnimata";
import { LinguaProvider } from "@/lib/i18n/client";
import { INFO_LINGUA } from "@/lib/i18n/lingue";
import { dizionario } from "@/lib/i18n/server";
import { INDEXABLE, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/sito";
import "./globals.css";

// Archivo variabile: pesi 100–900 più l'asse wdth (62–125) per i titoli stretti.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

// Inter per cifre, importi ed etichette: cifre tabellari, leggibile anche piccola.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  robots: { index: INDEXABLE, follow: INDEXABLE },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "PreventivoLampo",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

// La lingua dell'interfaccia arriva dal cookie di preferenza (lib/i18n): lang e dir sull'html,
// e il dizionario ai componenti che girano nel browser.
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { lingua, d } = await dizionario();
  return (
    <html lang={lingua} dir={INFO_LINGUA[lingua].dir} className={`${archivo.variable} ${inter.variable} antialiased`}>
      <body className="min-h-dvh">
        <LinguaProvider lingua={lingua} d={d}>
          {children}
        </LinguaProvider>
        <FaviconAnimata />
      </body>
    </html>
  );
}
