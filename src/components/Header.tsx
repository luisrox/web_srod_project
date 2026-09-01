"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { ExtraSocial } from "@/domain/schemas";
import { HEADER_WORDMARK } from "@/lib/site";

const NAV_ITEMS = [
  { href: "/recomendados", label: "Recomendados" },
  { href: "/kit", label: "Kit" },
  { href: "/sobre", label: "Sobre" },
] as const;

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function YouTubeMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 fill-current"
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.8 15.5V8.5L15.7 12l-5.9 3.5Z" />
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 fill-current"
    >
      <path d="M12 7.4A4.6 4.6 0 1 0 16.6 12 4.6 4.6 0 0 0 12 7.4Zm0 7.6A3 3 0 1 1 15 12a3 3 0 0 1-3 3Zm5.9-8.8a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1ZM21.5 5.5a6.4 6.4 0 0 0-3.5-3.5 10.6 10.6 0 0 0-3.5-.6H9.5a10.6 10.6 0 0 0-3.5.6 6.4 6.4 0 0 0-3.5 3.5 10.6 10.6 0 0 0-.6 3.5v5a10.6 10.6 0 0 0 .6 3.5 6.4 6.4 0 0 0 3.5 3.5 10.6 10.6 0 0 0 3.5.6h5a10.6 10.6 0 0 0 3.5-.6 6.4 6.4 0 0 0 3.5-3.5 10.6 10.6 0 0 0 .6-3.5v-5a10.6 10.6 0 0 0-.6-3.5ZM20 15.6a9 9 0 0 1-.5 3 4.8 4.8 0 0 1-2.7 2.7 9 9 0 0 1-3 .5H10.2a9 9 0 0 1-3-.5 4.8 4.8 0 0 1-2.7-2.7 9 9 0 0 1-.5-3V8.4a9 9 0 0 1 .5-3 4.8 4.8 0 0 1 2.7-2.7 9 9 0 0 1 3-.5h5.6a9 9 0 0 1 3 .5 4.8 4.8 0 0 1 2.7 2.7 9 9 0 0 1 .5 3Z" />
    </svg>
  );
}

function TikTokMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 fill-current"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.69-.91 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V8.9a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 1 0 6.34 6.34V9.4a8.2 8.2 0 0 0 4.77 1.52V7.48a4.84 4.84 0 0 1-1.09-.79Z" />
    </svg>
  );
}

const navLinkClass = [
  "inline-flex min-h-11 items-center text-sm font-medium hover:text-accent",
].join(" ");

type HeaderProps = {
  youtubeUrl: string;
  instagramUrl: string;
  extraSocials?: ExtraSocial[];
  contactOpen?: boolean;
  onOpenContact: () => void;
};

export function Header({
  youtubeUrl,
  instagramUrl,
  extraSocials,
  contactOpen = false,
  onOpenContact,
}: HeaderProps) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const extras = extraSocials ?? [];

  return (
    <header
      data-ui="site-header"
      className="relative z-30 border-b border-line bg-bg/55 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          className="font-display text-lg font-medium tracking-tight"
        >
          {HEADER_WORDMARK}
        </Link>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-gallery px-3 text-sm font-medium md:hidden"
          aria-expanded={open}
          aria-controls="navegacion-principal"
          onClick={() => setOpen((value) => !value)}
        >
          Menú
        </button>

        <nav
          id="navegacion-principal"
          aria-label="Principal"
          className={[
            "absolute left-0 right-0 top-full flex-col gap-1 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur-md md:static md:flex md:flex-row md:items-center md:gap-5 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none",
            open ? "flex" : "hidden md:flex",
          ].join(" ")}
        >
          {NAV_ITEMS.map((item) => {
            const current = isCurrent(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={[
                  navLinkClass,
                  current ? "text-accent" : "text-ink",
                ].join(" ")}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={contactOpen}
            className={`${navLinkClass} text-ink`}
            onClick={() => {
              setOpen(false);
              onOpenContact();
            }}
          >
            Contacto
          </button>

          <div className="mt-1 flex items-center gap-0 md:mt-0 md:ml-1">
            <a
              href={youtubeUrl}
              rel="noopener noreferrer"
              target="_blank"
              className="inline-flex min-h-11 w-9 items-center justify-center text-ink hover:text-accent"
            >
              <YouTubeMark />
              <span className="sr-only">
                Canal de YouTube (se abre en una pestaña nueva)
              </span>
            </a>
            <a
              href={instagramUrl}
              rel="noopener noreferrer"
              target="_blank"
              className="inline-flex min-h-11 w-9 items-center justify-center text-ink hover:text-accent"
            >
              <InstagramMark />
              <span className="sr-only">
                Perfil de Instagram (se abre en una pestaña nueva)
              </span>
            </a>
            {extras.map((social) => (
              <a
                key={social.url}
                href={social.url}
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex min-h-11 w-9 items-center justify-center text-ink hover:text-accent"
              >
                {/tiktok/i.test(social.label) ||
                /tiktok\.com/i.test(social.url) ? (
                  <TikTokMark />
                ) : (
                  <span aria-hidden="true" className="text-xs font-medium">
                    {social.label.slice(0, 2)}
                  </span>
                )}
                <span className="sr-only">
                  {social.label} (se abre en una pestaña nueva)
                </span>
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
