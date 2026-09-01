import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { siteSettingsFixture } from "@/content/fixtures";
import { HEADER_WORDMARK } from "@/lib/site";

import { Header } from "./Header";

let currentPath = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPath,
}));

vi.mock("next/link", () => ({
  default({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: ReactNode;
  }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
}));

const settings = siteSettingsFixture;

function renderHeader(
  extraSocials: typeof settings.extraSocials = settings.extraSocials,
  onOpenContact = vi.fn(),
) {
  render(
    <Header
      youtubeUrl={settings.youtubeUrl}
      instagramUrl={settings.instagramUrl}
      extraSocials={extraSocials}
      onOpenContact={onOpenContact}
    />,
  );
  return onOpenContact;
}

describe("Header", () => {
  beforeEach(() => {
    currentPath = "/";
  });

  it("muestra wordmark, tres destinos, Contacto como diálogo y tres redes", () => {
    const onOpenContact = renderHeader();

    expect(screen.getByRole("link", { name: HEADER_WORDMARK })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.queryByRole("link", { name: "Srod Almenara" })).toBeNull();
    expect(screen.getByRole("link", { name: "Recomendados" })).toHaveAttribute(
      "href",
      "/recomendados",
    );
    expect(screen.getByRole("link", { name: "Kit" })).toHaveAttribute(
      "href",
      "/kit",
    );
    expect(screen.getByRole("link", { name: "Sobre" })).toHaveAttribute(
      "href",
      "/sobre",
    );

    const contacto = screen.getByRole("button", { name: "Contacto" });
    expect(contacto).toHaveAttribute("aria-haspopup", "dialog");
    expect(contacto).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Contacto" })).toBeNull();

    fireEvent.click(contacto);
    expect(onOpenContact).toHaveBeenCalledOnce();

    const youtube = screen.getByRole("link", { name: /canal de youtube/i });
    const instagram = screen.getByRole("link", {
      name: /perfil de instagram/i,
    });
    const tiktok = screen.getByRole("link", { name: /tiktok/i });

    expect(youtube).toHaveAttribute("href", settings.youtubeUrl);
    expect(instagram).toHaveAttribute("href", settings.instagramUrl);
    expect(tiktok).toHaveAttribute(
      "href",
      "https://www.tiktok.com/@srodalmenara",
    );
    expect(youtube).toHaveAttribute("rel", "noopener noreferrer");
    expect(instagram).toHaveAttribute("rel", "noopener noreferrer");
    expect(tiktok).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.queryByRole("link", { name: "Studio" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Trabajo" })).toBeNull();
  });

  it("no inventa TikTok si extraSocials está vacío", () => {
    renderHeader([]);

    expect(screen.queryByRole("link", { name: /tiktok/i })).toBeNull();
  });

  it("marca aria-current en el enlace de la sección activa", () => {
    currentPath = "/kit";
    renderHeader();

    expect(screen.getByRole("link", { name: "Kit" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Recomendados" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("el menú móvil alterna aria-expanded y el panel", () => {
    renderHeader();

    const button = screen.getByRole("button", { name: "Menú" });
    const nav = screen.getByRole("navigation", { name: "Principal" });

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(nav).toHaveClass("hidden");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(nav).not.toHaveClass("hidden");
    expect(nav).toHaveClass("flex");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(nav).toHaveClass("hidden");
  });
});
