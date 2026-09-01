"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SITE_NAME } from "@/lib/site";

const NAV_ITEMS = [
  { href: "/trabajo", label: "Trabajo" },
  { href: "/kit", label: "Kit" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contacto", label: "Contacto" },
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

type HeaderProps = {
  youtubeUrl: string;
  instagramUrl: string;
};

export function Header({ youtubeUrl, instagramUrl }: HeaderProps) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  return (
    <header
      data-ui="site-header"
      className="relative z-30 border-b border-line bg-bg"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-lg font-medium tracking-tight"
        >
          {SITE_NAME}
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
            "absolute left-0 right-0 top-full flex-col gap-1 border-b border-line bg-bg px-4 py-3 md:static md:flex md:flex-row md:items-center md:gap-5 md:border-0 md:p-0",
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
                  "inline-flex min-h-11 items-center text-sm font-medium hover:text-accent",
                  current ? "text-accent" : "text-ink",
                ].join(" ")}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}

          <a
            href={youtubeUrl}
            rel="noopener noreferrer"
            target="_blank"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-ink hover:text-accent"
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
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-ink hover:text-accent"
          >
            <InstagramMark />
            <span className="sr-only">
              Perfil de Instagram (se abre en una pestaña nueva)
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}
