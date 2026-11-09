import type { Metadata, Viewport } from "next";
import "@fontsource/instrument-serif";
import "@fontsource-variable/manrope";
import "./globals.css";
import { COMPANY, OPENING } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.url),
  title: {
    default: `${COMPANY.name} | Beyond the Surface`,
    template: `%s | ${COMPANY.name}`,
  },
  description: `${COMPANY.legalName} advances sustainable systems through research, innovation and cross-sector collaboration.`,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: COMPANY.name,
    title: `${COMPANY.name} | Beyond the Surface`,
    description: OPENING.line1,
    url: "/",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.name} | Beyond the Surface`,
    description: OPENING.line1,
  },
};

export const viewport: Viewport = {
  themeColor: "#111A24",
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
