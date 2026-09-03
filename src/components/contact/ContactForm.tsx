"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { TextLink } from "@/components/TextLink";

const fieldClass =
  "mt-1 w-full min-h-11 rounded-gallery border border-line bg-surface px-3 py-2 text-ink";

const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      appearance?: "always" | "execute" | "interaction-only";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  remove?: (widgetId: string) => void;
};

type ContactFormProps = {
  turnstileSiteKey?: string;
  /** Prefijo de ids si hay más de un form en el documento (p. ej. el modal). */
  idPrefix?: string;
  /** En la modal, montar el widget solo cuando el diálogo está abierto. */
  active?: boolean;
};

function readTurnstile(): TurnstileApi | undefined {
  return (window as Window & { turnstile?: TurnstileApi }).turnstile;
}

function loadTurnstile(): Promise<TurnstileApi | undefined> {
  const ready = readTurnstile();
  if (ready) {
    return Promise.resolve(ready);
  }

  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-srod-turnstile]",
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(readTurnstile()), {
        once: true,
      });
      existing.addEventListener("error", () => resolve(undefined), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.dataset.srodTurnstile = "true";
    script.onload = () => resolve(readTurnstile());
    script.onerror = () => resolve(undefined);
    document.head.appendChild(script);
  });
}

export function ContactForm({
  turnstileSiteKey = "",
  idPrefix = "",
  active = true,
}: ContactFormProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const fieldId = (name: string) => `${idPrefix}${name}`;

  useEffect(() => {
    if (!turnstileSiteKey || !active) {
      return;
    }

    let widgetId: string | undefined;
    let cancelled = false;
    const delay = window.setTimeout(() => {
      void loadTurnstile().then((api) => {
        const node = slotRef.current;
        if (cancelled || !api || !node) {
          return;
        }
        widgetId = api.render(node, {
          sitekey: turnstileSiteKey,
          theme: "light",
          appearance: "always",
          callback: (value) => setToken(value),
          "expired-callback": () => setToken(""),
          "error-callback": () => setToken(""),
        });
      });
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(delay);
      if (widgetId) {
        readTurnstile()?.remove?.(widgetId);
      }
    };
  }, [turnstileSiteKey, active]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const resolvedToken =
      token ||
      String(
        data.get("turnstileToken") ?? data.get("cf-turnstile-response") ?? "",
      );

    if (turnstileSiteKey && !resolvedToken) {
      setError("Confirma que no eres un robot.");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre: String(data.get("nombre") ?? ""),
          email: String(data.get("email") ?? ""),
          mensaje: String(data.get("mensaje") ?? ""),
          empresa_url: String(data.get("empresa_url") ?? ""),
          turnstileToken: resolvedToken,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setError(payload.error ?? "No se pudo enviar. Usa el email de respaldo.");
        return;
      }

      setStatus("sent");
    } catch {
      setStatus("error");
      setError("No se pudo enviar. Usa el email de respaldo.");
    }
  }

  if (status === "sent") {
    return (
      <p data-ui="contact-form" role="status" className="max-w-prose">
        Mensaje enviado. Te responderé por email.
      </p>
    );
  }

  return (
    <form
      data-ui="contact-form"
      aria-label="Formulario de contacto"
      action="/api/contacto"
      method="POST"
      className="space-y-5"
      onSubmit={onSubmit}
    >
      <div>
        <label htmlFor={fieldId("nombre")} className="text-sm font-medium">
          Nombre
        </label>
        <input
          id={fieldId("nombre")}
          name="nombre"
          type="text"
          autoComplete="name"
          required
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor={fieldId("email")} className="text-sm font-medium">
          Email
        </label>
        <input
          id={fieldId("email")}
          name="email"
          type="email"
          autoComplete="email"
          required
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor={fieldId("mensaje")} className="text-sm font-medium">
          Mensaje
        </label>
        <textarea
          id={fieldId("mensaje")}
          name="mensaje"
          required
          rows={6}
          className={`${fieldClass} min-h-32`}
        />
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor={fieldId("empresa_url")}>No rellenar</label>
        <input
          id={fieldId("empresa_url")}
          name="empresa_url"
          type="text"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <input type="hidden" name="turnstileToken" value={token} />

      <div
        ref={slotRef}
        data-ui="turnstile-slot"
        className={turnstileSiteKey ? "min-h-[65px]" : undefined}
      />

      <p className="text-sm text-muted">
        Los datos solo se usan para responder.{" "}
        <TextLink href="/privacidad">Privacidad</TextLink>.
      </p>

      {error ? (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-11 items-center justify-center rounded-gallery bg-accent px-4 text-sm font-medium text-accent-ink hover:opacity-90 disabled:opacity-60"
      >
        Enviar
      </button>
    </form>
  );
}
