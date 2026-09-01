import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ABOUT_PORTRAIT_ALT } from "@/components/about/AboutBio";
import { StudioShell } from "@/components/StudioShell";
import { content } from "@/content";
import {
  DEFAULT_ELFSIGHT_INSTAGRAM_ID,
  getElfsightInstagramId,
} from "@/lib/elfsight";
import { getInstagramPosts } from "@/lib/instagram";
import { getYoutubeFeed } from "@/lib/youtube-feed";
import { homePageTitle, pageTitle } from "@/lib/metadata";
import { ogImageHref } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

import Home, { generateMetadata } from "./page";

vi.mock("next/script", () => ({
  default: () => null,
}));

vi.mock("@/lib/elfsight", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/elfsight")>();
  return {
    ...actual,
    getElfsightInstagramId: vi.fn(() => actual.DEFAULT_ELFSIGHT_INSTAGRAM_ID),
  };
});

vi.mock("@/lib/instagram", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/instagram")>();
  return {
    ...actual,
    getInstagramPosts: vi.fn(),
  };
});

vi.mock("@/lib/youtube-feed", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/youtube-feed")>();
  return {
    ...actual,
    getYoutubeFeed: vi.fn(),
  };
});

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

async function renderHome() {
  render(<StudioShell>{await Home()}</StudioShell>);
}

describe("Home", () => {
  beforeEach(() => {
    vi.mocked(getYoutubeFeed).mockResolvedValue({ ok: false, videos: [] });
    vi.mocked(getInstagramPosts).mockResolvedValue([]);
    vi.mocked(getElfsightInstagramId).mockReturnValue(
      DEFAULT_ELFSIGHT_INSTAGRAM_ID,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("muestra nombre, titular, subtítulo y el embed del hero", async () => {
    const settings = await content.getSiteSettings();
    await renderHome();

    const heading = screen.getByRole("heading", { level: 1, name: SITE_NAME });
    const hero = heading.closest('[data-ui="hero"]');

    expect(hero).not.toBeNull();
    expect(heading.closest('[data-ui="gallery-box"]')).not.toBeNull();
    expect(
      within(hero as HTMLElement).getByRole("img", {
        name: ABOUT_PORTRAIT_ALT,
      }),
    ).toHaveAttribute("src", settings.portrait);
    expect(screen.getByText(settings.heroTitle)).toBeVisible();
    expect(screen.getByText(settings.heroSubtitle)).toBeVisible();
    expect(hero?.querySelector('[data-ui="youtube-embed"]')).not.toBeNull();
    expect(
      screen.getByRole("button", {
        name: "Reproducir Reel de dirección de fotografía",
      }),
    ).toBeVisible();
    expect(hero?.textContent).not.toMatch(/YouTube es la prueba/i);
    expect(hero?.textContent).not.toMatch(/Laboratorio/i);
  });

  it("el gancho del hero no menciona Panamá", async () => {
    await renderHome();

    const hero = document.querySelector('[data-ui="hero"]');
    expect(hero).not.toBeNull();
    expect(hero?.textContent).not.toMatch(/Panamá/i);
    expect(hero?.textContent).not.toMatch(/Panama/i);
  });

  it("el title de Home usa el titular CMS y no el de las demás rutas", async () => {
    const settings = await content.getSiteSettings();
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(homePageTitle(settings.heroTitle));
    expect(metadata.description).toBe(settings.heroSubtitle);
    expect(metadata.title).not.toBe(pageTitle("Trabajo"));
    expect(metadata.title).not.toBe(SITE_NAME);
    expect(ogImageHref(metadata.openGraph)).toMatch(/^https?:\/\//);
    expect(metadata.openGraph?.locale).toBe("es");
  });

  it("muestra el extracto About y el enlace a /sobre", async () => {
    const settings = await content.getSiteSettings();
    await renderHome();

    expect(screen.getByText(settings.aboutExcerpt)).toBeVisible();
    expect(screen.getByRole("link", { name: "Leer sobre Srod" })).toHaveAttribute(
      "href",
      "/sobre",
    );

    const instagram = document.querySelector('[data-ui="instagram-teaser"]');
    const about = document.querySelector('[data-ui="about-excerpt"]');
    expect(instagram && about).toBeTruthy();
    expect(
      Boolean(
        instagram &&
          about &&
          instagram.compareDocumentPosition(about) &
            Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ).toBe(true);
  });

  it("en Trabajo destacado lista el feed de YouTube y no stills de fixture", async () => {
    await renderHome();

    const block = document.querySelector('[data-ui="featured-work"]');
    expect(block).not.toBeNull();
    expect(block).toHaveTextContent("Videos recientes del canal");
    expect(
      within(block as HTMLElement).queryByRole("link", {
        name: "Ver el trabajo",
      }),
    ).toBeNull();
    expect(screen.queryByRole("heading", { name: "Proceso" })).toBeNull();
    expect(
      document.querySelector('[data-ui="featured-work"] [data-ui="youtube-teaser"]'),
    ).not.toBeNull();
  });

  it("lista el teaser de kit y enlaza a /kit", async () => {
    const settings = await content.getSiteSettings();
    const teaser = await content.getKitTeaser();
    await renderHome();

    const block = document.querySelector('[data-ui="kit-teaser"]');
    expect(block).not.toBeNull();
    expect(block!.querySelectorAll('[data-ui="kit-teaser-item"]')).toHaveLength(
      settings.kitTeaserIds.length,
    );

    teaser.forEach((item) => {
      expect(within(block as HTMLElement).getByText(item.name)).toBeVisible();
      expect(within(block as HTMLElement).getByText(item.usageNote)).toBeVisible();
      if (item.shopUrl) {
        expect(within(block as HTMLElement).getByText(item.name).closest("a")).toHaveAttribute(
          "href",
          item.shopUrl,
        );
      }
    });

    expect(
      within(block as HTMLElement).queryByRole("link", {
        name: /Comprar en Amazon/,
      }),
    ).toBeNull();
    expect(
      screen.getByRole("link", { name: "Ver el kit completo" }),
    ).toHaveAttribute(
      "href",
      "/kit",
    );
  });

  it("no renderiza whereabouts cuando el CMS está vacío", async () => {
    const settings = await content.getSiteSettings();
    vi.spyOn(content, "getSiteSettings").mockResolvedValue({
      ...settings,
      whereaboutsText: "",
    });

    await renderHome();

    expect(document.querySelector('[data-ui="whereabouts"]')).toBeNull();
  });

  it("muestra whereabouts cuando hay texto CMS", async () => {
    const settings = await content.getSiteSettings();
    const note = "En set, o remoto si el encargo lo pide.";
    vi.spyOn(content, "getSiteSettings").mockResolvedValue({
      ...settings,
      whereaboutsText: note,
    });

    await renderHome();

    const block = document.querySelector('[data-ui="whereabouts"]');
    expect(block).not.toBeNull();
    expect(block).toHaveTextContent(note);
  });

  it("monta el widget Elfsight de Instagram sin CTA de perfil", async () => {
    await renderHome();

    const instagram = document.querySelector('[data-ui="instagram-teaser"]');
    expect(instagram?.querySelector('[data-ui="instagram-elfsight"]')).not.toBeNull();
    expect(instagram?.querySelector("ul")).toBeNull();
    expect(instagram?.querySelector("iframe")).toBeNull();
    expect(
      within(instagram as HTMLElement).queryByRole("link", {
        name: /Ver el perfil/,
      }),
    ).toBeNull();
  });

  it("si Elfsight está off y no hay posts, el embed del perfil sigue", async () => {
    vi.mocked(getElfsightInstagramId).mockReturnValue(undefined);
    await renderHome();

    const instagram = document.querySelector('[data-ui="instagram-teaser"]');
    expect(instagram?.querySelector("ul")).toBeNull();
    expect(instagram?.querySelectorAll("figure")).toHaveLength(0);
    expect(
      instagram
        ?.querySelector('[data-ui="instagram-embed"] iframe')
        ?.getAttribute("src"),
    ).toBe("https://www.instagram.com/srodalmenara/embed/");
    expect(
      within(instagram as HTMLElement).queryByRole("link", {
        name: /Ver el perfil/,
      }),
    ).toBeNull();
  });

  it("con Elfsight off y posts de Instagram lista figuras en el mismo ancla", async () => {
    vi.mocked(getElfsightInstagramId).mockReturnValue(undefined);
    vi.mocked(getInstagramPosts).mockResolvedValue([
      {
        id: "ig-1",
        url: "https://www.instagram.com/p/aaa/",
        imageUrl: "https://cdn.example/1.jpg",
        alt: "Look en Casco",
      },
    ]);

    await renderHome();

    const instagram = document.querySelector('[data-ui="instagram-teaser"]');
    expect(instagram?.querySelectorAll("figure")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Look en Casco/ })).toHaveAttribute(
      "href",
      "https://www.instagram.com/p/aaa/",
    );
    expect(
      within(instagram as HTMLElement).queryByRole("link", {
        name: /Ver el perfil/,
      }),
    ).toBeNull();
  });

  it("con feed de YouTube ok el hero destaca el último y el bloque lista el resto", async () => {
    const settings = await content.getSiteSettings();
    vi.mocked(getYoutubeFeed).mockResolvedValue({
      ok: true,
      videos: [
        {
          id: "aaaaaaaaaaa",
          title: "Look en Casco",
          thumbnail: "https://i.ytimg.com/vi/aaaaaaaaaaa/hqdefault.jpg",
          url: "https://www.youtube.com/watch?v=aaaaaaaaaaa",
          publishedAt: "2026-01-01T12:00:00+00:00",
          description: "Look de verano en Casco Viejo.",
        },
        {
          id: "bbbbbbbbbbb",
          title: "Café en Boquete",
          thumbnail: "https://i.ytimg.com/vi/bbbbbbbbbbb/hqdefault.jpg",
          url: "https://www.youtube.com/watch?v=bbbbbbbbbbb",
          publishedAt: "2026-02-01T12:00:00+00:00",
          description: "Café de altura.",
        },
      ],
    });

    await renderHome();

    const hero = document.querySelector('[data-ui="hero"]');
    expect(
      within(hero as HTMLElement).getByRole("button", {
        name: "Reproducir Look en Casco",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Café en Boquete/ }),
    ).toHaveAttribute("href", "https://www.youtube.com/watch?v=bbbbbbbbbbb");
    expect(
      document.querySelector('[data-ui="youtube-teaser"]')?.textContent,
    ).not.toMatch(/Look en Casco/);
    expect(
      within(
        document.querySelector('[data-ui="youtube-teaser"]') as HTMLElement,
      ).getByRole("link", { name: /Ver el canal/ }),
    ).toHaveAttribute("href", settings.youtubeUrl);
  });

  it("si el feed de YouTube falla, el enlace al canal sigue y no hay cards", async () => {
    const settings = await content.getSiteSettings();
    await renderHome();

    const youtube = document.querySelector('[data-ui="youtube-teaser"]');
    expect(youtube?.querySelector("ul")).toBeNull();
    expect(youtube?.querySelector(`a[href="${settings.youtubeUrl}"]`)).not.toBeNull();
    expect(
      within(youtube as HTMLElement).getByRole("link", { name: /Ver el canal/ }),
    ).toBeVisible();
  });

  it("el CTA de contacto apunta a /contacto", async () => {
    await renderHome();

    const cta = document.querySelector('[data-ui="contact-cta"]');
    expect(
      within(cta as HTMLElement).getByRole("link", { name: "Contacto" }),
    ).toHaveAttribute("href", "/contacto");
  });
});
