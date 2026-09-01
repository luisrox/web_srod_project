import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { content } from "@/content";
import { homePageTitle, pageTitle } from "@/lib/metadata";
import { ogImageHref } from "@/lib/og";

vi.mock("next/link", () => ({
  default({ href, children }: { href: string; children: ReactNode }) {
    return <a href={href}>{children}</a>;
  },
}));

vi.mock("next/navigation", () => ({
  notFound() {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
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

const { generateStaticParams, generateMetadata, default: CasePage, revalidate } =
  await import("./page");

describe("generateStaticParams (case)", () => {
  it("cubre todos los slugs de los fixtures", async () => {
    const params = await generateStaticParams();
    const projects = await content.getProjects();

    expect(params.map((entry) => entry.slug).sort()).toEqual(
      projects.map((project) => project.slug).sort(),
    );
  });
});

describe("página de case", () => {
  it("muestra el título de un fixture conocido", async () => {
    const projects = await content.getProjects();
    const project = projects[0];
    expect(project).toBeDefined();

    render(await CasePage({ params: Promise.resolve({ slug: project!.slug }) }));

    expect(document.querySelector('[data-ui="case-client"]')).not.toBeNull();
    expect(document.querySelector('[data-ui="case-geek"]')).not.toBeVisible();
    expect(
      screen.getByRole("button", { name: "Ficha técnica" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("heading", { level: 1, name: project!.title }),
    ).toBeVisible();
    expect(document.querySelector('[data-ui="youtube-embed"]')).not.toBeNull();
    expect(
      screen.getByRole("button", { name: `Reproducir ${project!.title}` }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Volver a trabajo" }),
    ).toHaveAttribute("href", "/trabajo");
  });

  it("slug desconocido dispara notFound", async () => {
    await expect(
      CasePage({ params: Promise.resolve({ slug: "este-slug-no-existe" }) }),
    ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });

  it("declara revalidate ISR en el segmento", () => {
    expect(revalidate).toBe(60);
  });
});

describe("títulos de case", () => {
  it("el title de un case no coincide con el de las rutas índice", async () => {
    const projects = await content.getProjects();
    const project = projects[0];
    expect(project).toBeDefined();

    expect(pageTitle(project!.title)).not.toBe(pageTitle("Trabajo"));
    expect(pageTitle(project!.title)).not.toBe(homePageTitle("cualquier titular"));
  });

  it("generateMetadata expone OG image absoluta y locale es", async () => {
    const project = (await content.getProjects())[0];
    expect(project?.stills[0]).toBeDefined();

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: project!.slug }),
    });

    expect(ogImageHref(metadata.openGraph)).toMatch(/^https?:\/\//);
    expect(metadata.openGraph?.locale).toBe("es");
    expect(metadata.description).toBe(project!.summary);
  });
});
