import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AdSenseScript } from "@/components/layout/adsense-script";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { GoogleAnalytics } from "@/components/layout/google-analytics";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/layout/json-ld";
import { buildBaseMetadata } from "@/lib/metadata";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/schema";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-site",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = buildBaseMetadata();

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} dark`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen font-sans text-[var(--foreground)]">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <GoogleAnalytics />
        <AdSenseScript />
        <JsonLd data={buildOrganizationSchema()} />
        <JsonLd data={buildWebsiteSchema()} />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <CookieConsent />
      </body>
    </html>
  );
}
