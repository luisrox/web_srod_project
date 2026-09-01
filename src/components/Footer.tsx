import Link from "next/link";

import type { ExtraSocial } from "@/domain/schemas";

type FooterProps = {
  youtubeUrl: string;
  instagramUrl: string;
  shopUrl: string;
  musicUrl?: string;
  extraSocials?: ExtraSocial[];
};

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className="inline-flex min-h-11 items-center hover:text-ink"
    >
      {children}
    </a>
  );
}

export function Footer({
  youtubeUrl,
  instagramUrl,
  shopUrl,
  musicUrl,
  extraSocials,
}: FooterProps) {
  const extras = extraSocials ?? [];

  return (
    <footer
      data-ui="site-footer"
      className="relative z-10 border-t border-line bg-bg/40 text-sm text-muted backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-1 px-6 py-6">
        <ExternalLink href={youtubeUrl}>YouTube</ExternalLink>
        <ExternalLink href={instagramUrl}>Instagram</ExternalLink>
        {extras.map((social) => (
          <ExternalLink key={social.url} href={social.url}>
            {social.label}
          </ExternalLink>
        ))}
        <ExternalLink href={shopUrl}>Presets</ExternalLink>
        {musicUrl ? (
          <ExternalLink href={musicUrl}>Música</ExternalLink>
        ) : null}
        <Link
          href="/privacidad"
          className="inline-flex min-h-11 items-center hover:text-ink"
        >
          Privacidad
        </Link>
      </div>
    </footer>
  );
}
