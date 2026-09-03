"use client";

import { useOpenContact } from "@/components/contact/ContactModalContext";
import { Section } from "@/components/Section";
import { buttonLinkClass, TextLink } from "@/components/TextLink";

type ContactCtaProps = {
  shopUrl: string;
};

export function ContactCta({ shopUrl }: ContactCtaProps) {
  const openContact = useOpenContact();

  return (
    <Section ui="contact-cta" className="mx-auto max-w-6xl px-6 py-section">
      <p className="font-display text-2xl font-medium tracking-tight">
        Si hay un encargo, escríbeme.
      </p>
      <p className="mt-4">
        <button
          type="button"
          aria-haspopup="dialog"
          className={buttonLinkClass}
          onClick={openContact}
        >
          Contacto
        </button>
      </p>
      <p className="mt-8 text-sm text-muted">
        Los presets siguen en la tienda actual:{" "}
        <TextLink href={shopUrl}>Presets</TextLink>.
      </p>
    </Section>
  );
}
