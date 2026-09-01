"use client";

import { useEffect, useId, useRef } from "react";

import { ContactAside } from "@/components/contact/ContactAside";
import { ContactForm } from "@/components/contact/ContactForm";
import { GalleryBox } from "@/components/GalleryBox";
import type { ExtraSocial } from "@/domain/schemas";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  contactEmail: string;
  youtubeUrl: string;
  instagramUrl: string;
  extraSocials?: ExtraSocial[];
  availabilityNote?: string;
  turnstileSiteKey?: string;
};

export function ContactModal({
  open,
  onClose,
  contactEmail,
  youtubeUrl,
  instagramUrl,
  extraSocials,
  availabilityNote,
  turnstileSiteKey = "",
}: ContactModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previous = document.activeElement;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (previous instanceof HTMLElement) {
        previous.focus();
      }
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      data-ui="contact-modal"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-10 sm:items-center"
    >
      <button
        type="button"
        className="absolute inset-0 bg-bg/75"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <GalleryBox className="relative z-10 w-full max-w-3xl overflow-hidden">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="px-6 py-6 sm:px-8"
        >
          <div className="flex items-start justify-between gap-4">
            <h2
              id={titleId}
              className="font-display text-2xl font-medium tracking-tight"
            >
              Contacto
            </h2>
            <button
              ref={closeRef}
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-gallery text-sm font-medium hover:text-accent"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-10 md:flex-row md:gap-12">
            <div className="min-w-0 flex-1">
              <ContactForm
                idPrefix="modal-"
                turnstileSiteKey={turnstileSiteKey}
              />
            </div>
            <ContactAside
              contactEmail={contactEmail}
              youtubeUrl={youtubeUrl}
              instagramUrl={instagramUrl}
              extraSocials={extraSocials}
              availabilityNote={availabilityNote}
            />
          </div>
        </div>
      </GalleryBox>
    </div>
  );
}
