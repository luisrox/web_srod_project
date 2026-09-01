import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { siteSettingsFixture } from "@/content/fixtures";

import { Footer } from "./Footer";

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

describe("Footer", () => {
  it("enlaza Presets a shopUrl y Privacidad a /privacidad", () => {
    render(
      <Footer
        youtubeUrl={settings.youtubeUrl}
        instagramUrl={settings.instagramUrl}
        shopUrl={settings.shopUrl}
      />,
    );

    expect(screen.getByRole("link", { name: "Presets" })).toHaveAttribute(
      "href",
      settings.shopUrl,
    );
    expect(screen.getByRole("link", { name: "Privacidad" })).toHaveAttribute(
      "href",
      "/privacidad",
    );
    expect(screen.getByRole("link", { name: "YouTube" })).toHaveAttribute(
      "href",
      settings.youtubeUrl,
    );
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      settings.instagramUrl,
    );
  });

  it("no renderiza música si musicUrl está vacío", () => {
    render(
      <Footer
        youtubeUrl={settings.youtubeUrl}
        instagramUrl={settings.instagramUrl}
        shopUrl={settings.shopUrl}
      />,
    );

    expect(
      screen.queryByRole("link", { name: "Música" }),
    ).not.toBeInTheDocument();
  });

  it("renderiza música cuando hay musicUrl", () => {
    render(
      <Footer
        youtubeUrl={settings.youtubeUrl}
        instagramUrl={settings.instagramUrl}
        shopUrl={settings.shopUrl}
        musicUrl="https://example.com/musica"
      />,
    );

    expect(screen.getByRole("link", { name: "Música" })).toHaveAttribute(
      "href",
      "https://example.com/musica",
    );
  });

  it("no inventa redes extra si extraSocials está vacío", () => {
    render(
      <Footer
        youtubeUrl={settings.youtubeUrl}
        instagramUrl={settings.instagramUrl}
        shopUrl={settings.shopUrl}
        extraSocials={[]}
      />,
    );

    expect(
      screen.queryByRole("link", { name: "Vimeo" }),
    ).not.toBeInTheDocument();
  });

  it("lista extraSocials cuando existen", () => {
    render(
      <Footer
        youtubeUrl={settings.youtubeUrl}
        instagramUrl={settings.instagramUrl}
        shopUrl={settings.shopUrl}
        extraSocials={settings.extraSocials}
      />,
    );

    expect(screen.getByRole("link", { name: "TikTok" })).toHaveAttribute(
      "href",
      "https://www.tiktok.com/@srodalmenara",
    );
  });
});
