"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

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
  musicUrl?: string;
  extraSocials?: ExtraSocial[];
};

export function PublicChrome({
  children,
  youtubeUrl,
  instagramUrl,
  shopUrl,
  musicUrl,
  extraSocials,
}: PublicChromeProps) {
  const pathname = usePathname() ?? "/";

  if (pathname.startsWith("/studio")) {
    return children;
  }

  return (
    <StudioShell>
      <SkipLink />
      <Header youtubeUrl={youtubeUrl} instagramUrl={instagramUrl} />
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
    </StudioShell>
  );
}
