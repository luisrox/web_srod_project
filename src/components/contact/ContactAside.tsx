"use client";

import { useState } from "react";

import { TextLink } from "@/components/TextLink";
import type { ExtraSocial } from "@/domain/schemas";

type ContactAsideProps = {
  contactEmail: string;
  youtubeUrl: string;
  instagramUrl: string;
  extraSocials?: ExtraSocial[];
  availabilityNote?: string;
};

export function ContactAside({
  contactEmail,
  youtubeUrl,
  instagramUrl,
  extraSocials,
  availabilityNote,
}: ContactAsideProps) {
  const extras = extraSocials ?? [];
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(contactEmail);
    setCopied(true);
  }

  return (
    <aside data-ui="contact-aside" className="space-y-6 text-sm">
      {availabilityNote ? (
        <p className="text-muted">{availabilityNote}</p>
      ) : null}

      <div>
        <p className="font-medium">Email de respaldo</p>
        <p className="mt-2">
          <TextLink href={`mailto:${contactEmail}`}>{contactEmail}</TextLink>
        </p>
        <button
          type="button"
          className="mt-2 inline-flex min-h-11 items-center text-accent underline-offset-4 hover:underline"
          onClick={() => {
            void copyEmail();
          }}
        >
          Copiar
        </button>
        <p aria-live="polite" className="mt-1 text-muted">
          {copied ? "Email copiado" : ""}
        </p>
      </div>

      <div>
        <p className="font-medium">Redes</p>
        <p className="mt-2">
          <TextLink href={youtubeUrl}>YouTube</TextLink>
        </p>
        <p className="mt-1">
          <TextLink href={instagramUrl}>Instagram</TextLink>
        </p>
        {extras.map((social) => (
          <p key={social.url} className="mt-1">
            <TextLink href={social.url}>{social.label}</TextLink>
          </p>
        ))}
      </div>
    </aside>
  );
}
