import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/JsonLd";
import { PlausibleSnippet } from "@/components/PlausibleSnippet";
import { PublicChrome } from "@/components/PublicChrome";
import { content } from "@/content";
import { personJsonLd } from "@/lib/json-ld";
import { OG_LOCALE } from "@/lib/og";
import { SITE_LANG, SITE_NAME } from "@/lib/site";
import { getSiteUrl } from "@/lib/site-url";
import { fontVariables } from "@/styles/fonts";

import "../styles/globals.css";

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: SITE_NAME,
  openGraph: {
    locale: OG_LOCALE,
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await content.getSiteSettings();

  return (
    <html lang={SITE_LANG} className={fontVariables}>
      <body>
        <JsonLd data={personJsonLd(settings)} />
        <PlausibleSnippet />
        <PublicChrome
          youtubeUrl={settings.youtubeUrl}
          instagramUrl={settings.instagramUrl}
          shopUrl={settings.shopUrl}
          contactEmail={settings.contactEmail}
          musicUrl={settings.musicUrl}
          extraSocials={settings.extraSocials}
          availabilityNote={settings.availabilityNote}
        >
          {children}
        </PublicChrome>
      </body>
    </html>
  );
}
