"use client";

import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";

import { ContactModal } from "@/components/contact/ContactModal";
import { ContactModalProvider } from "@/components/contact/ContactModalContext";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SkipLink } from "@/components/SkipLink";
import { StudioShell } from "@/components/StudioShell";
import type { ExtraSocial } from "@/domain/schemas";

type PublicChromeProps = {
  children: ReactNode;
  youtubeUrl: string;
  instagramUrl: string;
  shopUrl: string;
  contactEmail: string;
  musicUrl?: string;
  extraSocials?: ExtraSocial[];
  availabilityNote?: string;
  turnstileSiteKey?: string;
};

export function PublicChrome({
  children,
  youtubeUrl,
  instagramUrl,
  shopUrl,
  contactEmail,
  musicUrl,
  extraSocials,
  availabilityNote,
  turnstileSiteKey = "",
}: PublicChromeProps) {
  const pathname = usePathname() ?? "/";
  const [contactOpen, setContactOpen] = useState(false);
  const closeContact = useCallback(() => setContactOpen(false), []);

  if (pathname.startsWith("/studio")) {
    return children;
  }

  return (
    <ContactModalProvider onOpen={() => setContactOpen(true)}>
      <StudioShell>
        <SkipLink />
        <Header
          youtubeUrl={youtubeUrl}
          instagramUrl={instagramUrl}
          extraSocials={extraSocials}
          contactOpen={contactOpen}
          onOpenContact={() => setContactOpen(true)}
        />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer
          youtubeUrl={youtubeUrl}
          instagramUrl={instagramUrl}
          shopUrl={shopUrl}
          musicUrl={musicUrl}
          extraSocials={extraSocials}
        />
        <ContactModal
          open={contactOpen}
          onClose={closeContact}
          contactEmail={contactEmail}
          youtubeUrl={youtubeUrl}
          instagramUrl={instagramUrl}
          extraSocials={extraSocials}
          availabilityNote={availabilityNote}
          turnstileSiteKey={turnstileSiteKey}
        />
      </StudioShell>
    </ContactModalProvider>
  );
}
