import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { ContactCta } from "@/components/home/ContactCta";

import { PublicChrome } from "./PublicChrome";

let currentPath = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPath,
}));

vi.mock("next/link", () => ({
  default({ href, children }: { href: string; children: ReactNode }) {
    return <a href={href}>{children}</a>;
  },
}));

const chromeProps = {
  youtubeUrl: "https://youtube.example",
  instagramUrl: "https://instagram.example",
  shopUrl: "https://shop.example",
  contactEmail: "srod@srodalmenara.com",
};

describe("PublicChrome", () => {
  it("envuelve las páginas públicas con header y footer", () => {
    currentPath = "/contacto";
    render(
      <PublicChrome {...chromeProps}>
        <p>Página</p>
      </PublicChrome>,
    );

    expect(document.querySelector('[data-ui="site-header"]')).not.toBeNull();
    expect(document.querySelector('[data-ui="site-footer"]')).not.toBeNull();
    expect(screen.getByText("Página")).toBeVisible();
  });

  it("el CTA de Home abre el modal y no navega", () => {
    currentPath = "/";
    render(
      <PublicChrome {...chromeProps}>
        <ContactCta shopUrl={chromeProps.shopUrl} />
      </PublicChrome>,
    );

    fireEvent.click(
      within(
        document.querySelector('[data-ui="contact-cta"]') as HTMLElement,
      ).getByRole("button", { name: "Contacto" }),
    );

    expect(screen.getByRole("dialog", { name: "Contacto" })).toBeVisible();
    expect(screen.queryByRole("link", { name: "Contacto" })).toBeNull();
  });

  it("el Contacto del header abre el modal y no navega", () => {
    currentPath = "/";
    render(
      <PublicChrome {...chromeProps}>
        <p>Página</p>
      </PublicChrome>,
    );

    fireEvent.click(
      within(screen.getByRole("navigation", { name: "Principal" })).getByRole(
        "button",
        { name: "Contacto" },
      ),
    );

    expect(screen.getByRole("dialog", { name: "Contacto" })).toBeVisible();
    expect(screen.getByLabelText("Nombre")).toBeVisible();
  });

  it("en /studio no pinta el chrome público", () => {
    currentPath = "/studio";
    render(
      <PublicChrome {...chromeProps}>
        <p>Studio</p>
      </PublicChrome>,
    );

    expect(document.querySelector('[data-ui="site-header"]')).toBeNull();
    expect(document.querySelector('[data-ui="site-footer"]')).toBeNull();
    expect(screen.getByText("Studio")).toBeVisible();
  });
});
