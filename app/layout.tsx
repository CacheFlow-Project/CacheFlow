import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Atkinson_Hyperlegible_Next, Bricolage_Grotesque } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const heading = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
});

const body = Atkinson_Hyperlegible_Next({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "CacheFlow",
  description: "Aplicație educațională cu 4 niveluri: lecții, chestionare, examen final.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ro" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col pb-16 sm:pb-0">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
