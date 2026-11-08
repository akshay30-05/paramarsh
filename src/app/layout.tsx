import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/hanken-grotesk";
import "./globals.css";
import { COMPANY, HERO } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.url),
  title: {
    default: `${COMPANY.name} | ${HERO.title}`,
    template: `%s | ${COMPANY.name}`,
  },
  description: `${COMPANY.legalName} advances sustainable systems through research, innovation and cross-sector collaboration.`,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: COMPANY.name,
    title: `${COMPANY.name} | ${HERO.title}`,
    description: HERO.subline,
    url: "/",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.name} | ${HERO.title}`,
    description: HERO.subline,
  },
};

export const viewport: Viewport = {
  themeColor: "#13233A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
