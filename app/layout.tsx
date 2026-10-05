import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { INDEXABLE, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/sito";
import "./globals.css";

// Archivo variabile: pesi 100–900 più l'asse wdth (62–125) per i titoli stretti.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex-mono",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${archivo.variable} ${plexMono.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
