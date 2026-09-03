"use client";

import { useEffect, useId, useRef, useState } from "react";

import { ContactAside } from "@/components/contact/ContactAside";
import { ContactForm } from "@/components/contact/ContactForm";
import { GalleryBox } from "@/components/GalleryBox";
import type { ExtraSocial } from "@/domain/schemas";
import { prefersReducedMotion } from "@/lib/motion";

const LEAVE_MS = 280;

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
  const [present, setPresent] = useState(open);

  useEffect(() => {
    if (open) {
      setPresent(true);
      return;
    }

    if (!present) {
      return;
    }

    if (prefersReducedMotion()) {
      setPresent(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setPresent(false);
    }, LEAVE_MS);

    return () => window.clearTimeout(timeout);
  }, [open, present]);

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

  if (!present) {
    return null;
  }

  return (
    <div
      data-ui="contact-modal"
      data-leaving={open ? undefined : true}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-5 py-12 sm:px-8 sm:py-16"
    >
      <button
        type="button"
        data-ui="contact-modal-backdrop"
        className="absolute inset-0 bg-bg/90 backdrop-blur-md"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div data-ui="contact-modal-panel" className="relative z-10 my-auto w-full max-w-3xl">
        <GalleryBox>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="px-6 py-6 sm:px-8"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
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
                  active={open}
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
    </div>
  );
}
