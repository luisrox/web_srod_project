import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "./ContactForm";

vi.mock("next/link", () => ({
  default({ href, children }: { href: string; children: ReactNode }) {
    return <a href={href}>{children}</a>;
  },
}));

type TurnstileApi = {
  render: ReturnType<typeof vi.fn>;
};

function stubTurnstile(immediateToken?: string) {
  const api: TurnstileApi = {
    render: vi.fn(
      (
        _el: HTMLElement,
        options: { callback: (token: string) => void },
      ) => {
        if (immediateToken) {
          options.callback(immediateToken);
        }
        return "widget";
      },
    ),
  };
  (window as Window & { turnstile?: TurnstileApi }).turnstile = api;
  return api;
}

describe("ContactForm", () => {
  afterEach(() => {
    delete (window as Window & { turnstile?: TurnstileApi }).turnstile;
    vi.unstubAllGlobals();
  });

  it("asocia cada campo visible con su label en español", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText("Nombre")).toHaveAttribute("name", "nombre");
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email");
    expect(screen.getByLabelText("Mensaje")).toHaveAttribute("name", "mensaje");
    expect(screen.queryByLabelText("Organización")).toBeNull();
    expect(screen.queryByLabelText("Tipo de proyecto")).toBeNull();
    expect(screen.queryByLabelText("Fechas")).toBeNull();
    expect(screen.getByRole("button", { name: "Enviar" })).toHaveAttribute(
      "type",
      "submit",
    );

    const form = screen.getByRole("form", { name: "Formulario de contacto" });
    expect(form).toHaveAttribute("action", "/api/contacto");
    expect(form).toHaveAttribute("method", "POST");
    expect(form.querySelector('[data-ui="turnstile-slot"]')).not.toBeNull();
    expect(screen.getByRole("link", { name: "Privacidad" })).toHaveAttribute(
      "href",
      "/privacidad",
    );
  });

  it("el honeypot no es visible ni aparece en el árbol de roles", () => {
    render(<ContactForm />);

    expect(
      screen.queryByRole("textbox", { name: "No rellenar" }),
    ).toBeNull();

    const trap = document.getElementById("empresa_url");
    const label = document.querySelector('label[for="empresa_url"]');
    expect(trap).not.toBeNull();
    expect(label).toHaveTextContent("No rellenar");
    expect(trap).toHaveAttribute("name", "empresa_url");
    expect(trap).toHaveAttribute("tabindex", "-1");
    expect(trap).toHaveAttribute("autocomplete", "off");
    expect(trap?.closest(".sr-only")).not.toBeNull();
    expect(trap?.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("no envía sin token de Turnstile", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    stubTurnstile();

    render(<ContactForm turnstileSiteKey="site-test" />);
    await waitFor(() => {
      expect(
        (window as Window & { turnstile?: TurnstileApi }).turnstile?.render,
      ).toHaveBeenCalled();
    });

    await user.type(screen.getByLabelText("Nombre"), "Ada");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Mensaje"), "Hay un brief.");
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(/robot/i);
  });

  it("tras un envío exitoso muestra confirmación en español", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
    stubTurnstile("tok_ok");

    render(<ContactForm turnstileSiteKey="site-test" />);
    await waitFor(() => {
      expect(
        (window as Window & { turnstile?: TurnstileApi }).turnstile?.render,
      ).toHaveBeenCalled();
    });

    await user.type(screen.getByLabelText("Nombre"), "Ada");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Mensaje"), "Hay un brief.");
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(String(init.body)).toContain("tok_ok");
    expect(
      await screen.findByRole("status"),
    ).toHaveTextContent(/Mensaje enviado/i);
  });
});
