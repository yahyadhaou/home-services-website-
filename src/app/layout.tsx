import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PrefsProvider, type Theme } from "@/components/PrefsProvider";
import { DEFAULT_LOCALE, getContent, isLocale } from "@/content";

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
    metadataBase: new URL(process.env.URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3200"),
    title: meta.title,
    description: meta.description,
    icons: { icon: "/brand/homeservices-logo-mark.svg" },
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: ["/covers/Client-Pitch-Deck.webp"],
      type: "website",
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
