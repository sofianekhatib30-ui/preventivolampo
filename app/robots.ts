import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/lib/sito";

// I bot che generano le anteprime dei link (LinkedIn, Slack, WhatsApp, Facebook, X) possono
// leggere la pagina: servono a mostrare titolo e immagine quando il link viene condiviso.
// I motori di ricerca entrano solo con INDEXABLE acceso e solo in produzione: le anteprime di
// Vercel (VERCEL_ENV=preview) restano sempre fuori. L'area, le API e le pagine di servizio mai.
const ANTEPRIME = ["LinkedInBot", "Slackbot-LinkExpanding", "WhatsApp", "facebookexternalhit", "Twitterbot"];
const PRIVATE = ["/api/", "/area", "/accedi", "/accetta/", "/revisione/", "/prova", "/progetto"];

export default function robots(): MetadataRoute.Robots {
  const produzione = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";
  if (!INDEXABLE || !produzione) {
    return {
      rules: [
        { userAgent: ANTEPRIME, allow: "/", disallow: "/api/" },
        { userAgent: "*", disallow: "/" },
      ],
    };
  }
  return { rules: { userAgent: "*", allow: "/", disallow: PRIVATE }, sitemap: new URL("/sitemap.xml", SITE_URL).toString() };
}
