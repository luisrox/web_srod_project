import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { siteSettingsFixture } from "@/content/fixtures";

import { ABOUT_PORTRAIT_ALT, AboutBio, splitAboutBody } from "./AboutBio";

vi.mock("next/link", () => ({
  default({ href, children }: { href: string; children: ReactNode }) {
    return <a href={href}>{children}</a>;
  },
}));

vi.mock("next/image", () => ({
  default({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} width={width} height={height} />
    );
  },
}));

function renderAbout(musicUrl?: string) {
  return render(
    <AboutBio
      aboutExcerpt={siteSettingsFixture.aboutExcerpt}
      aboutBody={siteSettingsFixture.aboutBody}
      portrait={siteSettingsFixture.portrait}
      musicUrl={musicUrl}
    />,
  );
}

describe("AboutBio", () => {
  it("muestra el extracto, el cuerpo en párrafos y el retrato con alt en español", () => {
    renderAbout();

    expect(screen.getByText(siteSettingsFixture.aboutExcerpt)).toBeVisible();
    for (const paragraph of splitAboutBody(siteSettingsFixture.aboutBody)) {
      expect(screen.getByText(paragraph, { exact: false })).toBeVisible();
    }

    const portrait = screen.getByRole("img", { name: ABOUT_PORTRAIT_ALT });
    expect(portrait).toHaveAttribute("src", siteSettingsFixture.portrait);
    expect(portrait.getAttribute("alt")).not.toMatch(/\.(svg|jpe?g|png|webp)$/i);
  });

  it("habla de Panamá y de trabajo remoto o internacional", () => {
    renderAbout();

    const about = document.querySelector('[data-ui="about"]');
    expect(about?.textContent).toMatch(/Panamá/);
    expect(about?.textContent).not.toMatch(/Panama/);
    expect(about?.textContent).toMatch(/remot/i);
    expect(about?.textContent).toMatch(/internacional/i);
  });

  it("con musicUrl hay un solo enlace de música y ninguna galería", () => {
    const musicUrl = "https://example.com/musica";
    renderAbout(musicUrl);

    const about = document.querySelector('[data-ui="about"]') as HTMLElement;
    const musicLinks = within(about)
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") === musicUrl);

    expect(musicLinks).toHaveLength(1);
    expect(document.querySelector('[data-ui="music-gallery"]')).toBeNull();
    expect(screen.queryByRole("list", { name: /tema|track|canci[oó]n/i })).toBeNull();
  });

  it("sin musicUrl no inventa un enlace de música ni galería", () => {
    renderAbout();

    const about = document.querySelector('[data-ui="about"]') as HTMLElement;
    const hrefs = within(about)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    expect(hrefs).toEqual(["/contacto"]);
    expect(document.querySelector('[data-ui="music-gallery"]')).toBeNull();
  });

  it("no tiene grid de presets ni CTA de tienda", () => {
    renderAbout();

    const about = document.querySelector('[data-ui="about"]') as HTMLElement;
    expect(within(about).queryByText("Presets")).toBeNull();
    expect(
      within(about).queryByRole("link", { name: /tienda|presets/i }),
    ).toBeNull();
    expect(about.innerHTML).not.toContain(siteSettingsFixture.shopUrl);
  });
});
