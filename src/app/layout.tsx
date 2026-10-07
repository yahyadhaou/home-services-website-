import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PrefsProvider, type Theme } from "@/components/PrefsProvider";
import { DEFAULT_LOCALE, getContent, isLocale } from "@/content";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const readPrefs = async () => {
  const jar = await cookies();
  const lang = jar.get("hs_lang")?.value;
  return {
    locale: isLocale(lang) ? lang : DEFAULT_LOCALE,
    theme: (jar.get("hs_theme")?.value === "light" ? "light" : "dark") as Theme,
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await readPrefs();
  const { meta } = getContent(locale);
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: "HomeServices",
    keywords: ["home services app", "HomeServices", "plumber booking app", "craft businesses software", "Handwerker App", "Haushaltsservices", "marketplace", "DACH"],
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    // Google Search Console ownership check (public by design).
    verification: { google: "2GVJPLk_28sduIE0I8eU07zD0SyLyrott9A2MvzXujs" },
    title: meta.title,
    description: meta.description,
    icons: { icon: "/brand/homeservices-logo-mark.svg" },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: "/",
      siteName: "HomeServices",
      images: [{ url: "/covers/Client-Pitch-Deck.webp", width: 960, height: 540, alt: "HomeServices client app pitch deck" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/covers/Client-Pitch-Deck.webp"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#070e1a",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, theme } = await readPrefs();
  return (
    <html
      lang={locale}
      data-theme={theme}
      className={`${inter.variable} ${jakarta.variable}`}
      // Browser extensions inject attributes into <html> before hydration.
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <noscript>
          <style>{".reveal{opacity:1;transform:none}"}</style>
        </noscript>
        <PrefsProvider initialLocale={locale} initialTheme={theme}>
          {children}
        </PrefsProvider>
      </body>
    </html>
  );
}
