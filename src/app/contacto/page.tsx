import type { Metadata } from "next";

import { ContactAside } from "@/components/contact/ContactAside";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageShell } from "@/components/PageShell";
import { content } from "@/content";
import { pageTitle } from "@/lib/metadata";

export const revalidate = 60;

export const metadata: Metadata = {
  title: pageTitle("Contacto"),
  description:
    "Encargos y consultas. Formulario sin login y email de respaldo.",
};

export default async function ContactoPage() {
  const settings = await content.getSiteSettings();

  return (
    <PageShell title="Contacto">
      <div className="flex flex-col gap-12 md:flex-row md:gap-16">
        <div className="min-w-0 flex-1">
          <ContactForm
            turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
          />
        </div>
        <ContactAside
          contactEmail={settings.contactEmail}
          youtubeUrl={settings.youtubeUrl}
          instagramUrl={settings.instagramUrl}
          extraSocials={settings.extraSocials}
          availabilityNote={settings.availabilityNote}
        />
      </div>
    </PageShell>
  );
}
