"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { TextLink } from "@/components/TextLink";

const fieldClass =
  "mt-1 w-full min-h-11 rounded-gallery border border-line bg-surface px-3 py-2 text-ink";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
    },
  ) => string;
};

type ContactFormProps = {
  turnstileSiteKey?: string;
};

function readTurnstile(): TurnstileApi | undefined {
  return (window as Window & { turnstile?: TurnstileApi }).turnstile;
}

export function ContactForm({ turnstileSiteKey = "" }: ContactFormProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!turnstileSiteKey || !slotRef.current) {
      return;
    }

    const api = readTurnstile();
    if (api) {
      api.render(slotRef.current, {
        sitekey: turnstileSiteKey,
        callback: (value) => setToken(value),
        "expired-callback": () => setToken(""),
      });
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => {
      const loaded = readTurnstile();
      if (loaded && slotRef.current) {
        loaded.render(slotRef.current, {
          sitekey: turnstileSiteKey,
          callback: (value) => setToken(value),
          "expired-callback": () => setToken(""),
        });
      }
    };
    document.head.appendChild(script);
  }, [turnstileSiteKey]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (turnstileSiteKey && !token) {
      setError("Confirma que no eres un robot.");
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre: data.get("nombre"),
          email: data.get("email"),
          organizacion: data.get("organizacion"),
          tipoProyecto: data.get("tipoProyecto"),
          fechas: data.get("fechas"),
          mensaje: data.get("mensaje"),
          empresa_url: data.get("empresa_url"),
          turnstileToken: token,
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
        <label htmlFor="nombre" className="text-sm font-medium">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          required
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="organizacion" className="text-sm font-medium">
          Organización
        </label>
        <input
          id="organizacion"
          name="organizacion"
          type="text"
          autoComplete="organization"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="tipoProyecto" className="text-sm font-medium">
          Tipo de proyecto
        </label>
        <input
          id="tipoProyecto"
          name="tipoProyecto"
          type="text"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="fechas" className="text-sm font-medium">
          Fechas
        </label>
        <input id="fechas" name="fechas" type="text" className={fieldClass} />
      </div>
      <div>
        <label htmlFor="mensaje" className="text-sm font-medium">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={6}
          className={`${fieldClass} min-h-32`}
        />
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="empresa_url">No rellenar</label>
        <input
          id="empresa_url"
          name="empresa_url"
          type="text"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <input type="hidden" name="turnstileToken" value={token} />

      <div ref={slotRef} data-ui="turnstile-slot" />

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
