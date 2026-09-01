import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { content } from "@/content";

vi.mock("next/link", () => ({
  default({ href, children }: { href: string; children: ReactNode }) {
    return <a href={href}>{children}</a>;
  },
}));

const { default: ContactoPage } = await import("./page");

type TurnstileApi = {
  render: ReturnType<typeof vi.fn>;
};

describe("página /contacto", () => {
  afterEach(() => {
    delete (window as Window & { turnstile?: TurnstileApi }).turnstile;
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("muestra el formulario, el email de respaldo y la nota de ubicación", async () => {
    const settings = await content.getSiteSettings();
    render(await ContactoPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Contacto" }),
    ).toBeVisible();
    expect(document.querySelector('[data-ui="contact-form"]')).not.toBeNull();
    expect(screen.getByLabelText("Nombre")).toBeVisible();
    expect(screen.getByText(settings.contactEmail)).toBeVisible();
    expect(document.body.textContent).toMatch(/Panamá/);
    expect(document.body.textContent).toMatch(/remot/i);
    expect(screen.getByRole("link", { name: /tiktok/i })).toHaveAttribute(
      "href",
      "https://www.tiktok.com/@srodalmenara",
    );
  });

  it("tras un envío exitoso mantiene el email de respaldo", async () => {
    const user = userEvent.setup();
    const settings = await content.getSiteSettings();
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-test");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
    (window as Window & { turnstile?: TurnstileApi }).turnstile = {
      render: vi.fn(
        (_el: HTMLElement, options: { callback: (token: string) => void }) => {
          options.callback("tok_ok");
          return "widget";
        },
      ),
    };

    render(await ContactoPage());
    await waitFor(() => {
      expect(
        (window as Window & { turnstile?: TurnstileApi }).turnstile?.render,
      ).toHaveBeenCalled();
    });

    await user.type(screen.getByLabelText("Nombre"), "Ada");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Mensaje"), "Hay un brief.");
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      /Mensaje enviado/i,
    );
    expect(screen.getByText(settings.contactEmail)).toBeVisible();
  });
});
