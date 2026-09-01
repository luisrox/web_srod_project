import type { Metadata } from "next";

import { AboutBio } from "@/components/about/AboutBio";
import { PageShell } from "@/components/PageShell";
import { content } from "@/content";
import { pageTitle } from "@/lib/metadata";

export const revalidate = 60;

export const metadata: Metadata = {
  title: pageTitle("Sobre"),
  description:
    "Quién es Srod Almenara: director de fotografía, proceso a la vista, Panamá y remoto.",
};

export default async function SobrePage() {
  const settings = await content.getSiteSettings();

  return (
    <PageShell title="Sobre Srod">
      <AboutBio
        aboutExcerpt={settings.aboutExcerpt}
        aboutBody={settings.aboutBody}
        portrait={settings.portrait}
        musicUrl={settings.musicUrl}
      />
    </PageShell>
  );
}
