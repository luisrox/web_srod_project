import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { siteSettingsFixture } from "@/content/fixtures";
import { SITE_NAME } from "@/lib/site";

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

function renderHeader() {
  render(
    <Header
      youtubeUrl={settings.youtubeUrl}
      instagramUrl={settings.instagramUrl}
    />,
  );
}

describe("Header", () => {
  beforeEach(() => {
    currentPath = "/";
  });

  it("muestra wordmark, cuatro destinos internos y dos redes", () => {
    renderHeader();

    expect(screen.getByRole("link", { name: SITE_NAME })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Trabajo" })).toHaveAttribute(
      "href",
      "/trabajo",
    );
    expect(screen.getByRole("link", { name: "Kit" })).toHaveAttribute(
      "href",
      "/kit",
    );
    expect(screen.getByRole("link", { name: "Sobre" })).toHaveAttribute(
      "href",
      "/sobre",
    );
    expect(screen.getByRole("link", { name: "Contacto" })).toHaveAttribute(
      "href",
      "/contacto",
    );

    const youtube = screen.getByRole("link", { name: /canal de youtube/i });
    const instagram = screen.getByRole("link", {
      name: /perfil de instagram/i,
    });

    expect(youtube).toHaveAttribute("href", settings.youtubeUrl);
    expect(instagram).toHaveAttribute("href", settings.instagramUrl);
    expect(youtube).toHaveAttribute("rel", "noopener noreferrer");
    expect(instagram).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.queryByRole("link", { name: "Studio" })).toBeNull();
  });

  it("marca aria-current en el enlace de la sección activa", () => {
    currentPath = "/kit";
    renderHeader();

    expect(screen.getByRole("link", { name: "Kit" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Trabajo" })).not.toHaveAttribute(
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
