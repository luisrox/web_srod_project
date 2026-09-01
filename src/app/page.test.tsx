import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { StudioShell } from "@/components/StudioShell";
import { content } from "@/content";
import { getInstagramPosts } from "@/lib/instagram";
import { getYoutubeFeed } from "@/lib/youtube-feed";
import { homePageTitle, pageTitle } from "@/lib/metadata";
import { ogImageHref } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

import Home, { generateMetadata } from "./page";

vi.mock("@/lib/instagram", () => ({
  getInstagramPosts: vi.fn(),
}));

vi.mock("@/lib/youtube-feed", () => ({
  getYoutubeFeed: vi.fn(),
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
    expect(screen.getByText(settings.heroTitle)).toBeVisible();
    expect(screen.getByText(settings.heroSubtitle)).toBeVisible();
    expect(hero?.querySelector('[data-ui="youtube-embed"]')).not.toBeNull();
    expect(
      screen.getByRole("button", {
        name: "Reproducir Reel de dirección de fotografía",
      }),
    ).toBeVisible();
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
  });

  it("lista exactamente los cases destacados con su ruta", async () => {
    const settings = await content.getSiteSettings();
    const featured = await content.getFeaturedProjects();
    await renderHome();

    const block = document.querySelector('[data-ui="featured-work"]');
    expect(block).not.toBeNull();

    const links = block!.querySelectorAll('a[href^="/trabajo/"]');
    expect(links).toHaveLength(settings.featuredProjectSlugs.length);

    featured.forEach((project, index) => {
      expect(links[index]).toHaveAttribute("href", `/trabajo/${project.slug}`);
      expect(links[index]).toHaveTextContent(project.title);
    });
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
    });

    expect(screen.getByRole("link", { name: "Ver el kit" })).toHaveAttribute(
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

  it("si Instagram no trae posts, el fallback enlaza al perfil y no hay grid roto", async () => {
    const settings = await content.getSiteSettings();
    await renderHome();

    const instagram = document.querySelector('[data-ui="instagram-teaser"]');
    expect(instagram?.querySelector("ul")).toBeNull();
    expect(instagram?.querySelectorAll("figure")).toHaveLength(0);
    expect(instagram?.textContent).toMatch(/perfil/i);
    expect(
      within(instagram as HTMLElement).getByRole("link", {
        name: /Ver el perfil/,
      }),
    ).toHaveAttribute("href", settings.instagramUrl);
  });

  it("con posts de Instagram lista figuras en el mismo ancla y mantiene el perfil", async () => {
    const settings = await content.getSiteSettings();
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
      within(instagram as HTMLElement).getByRole("link", {
        name: /Ver el perfil/,
      }),
    ).toHaveAttribute("href", settings.instagramUrl);
  });

  it("con feed de YouTube ok lista videos y mantiene el CTA al canal", async () => {
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
        },
      ],
    });

    await renderHome();

    expect(screen.getByRole("link", { name: /Look en Casco/ })).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=aaaaaaaaaaa",
    );
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
