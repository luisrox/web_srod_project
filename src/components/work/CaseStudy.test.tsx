import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { content } from "@/content";

import { CaseStudy } from "./CaseStudy";

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

describe("CaseStudy (capa cliente)", () => {
  it("muestra los campos obligatorios de un fixture conocido", async () => {
    const project = await content.getProjectBySlug("lookbook-verano-casco");
    expect(project).not.toBeNull();

    render(<CaseStudy project={project!} />);

    const layer = document.querySelector('[data-ui="case-client"]');
    expect(layer).not.toBeNull();
    expect(
      screen.getByRole("heading", { level: 1, name: project!.title }),
    ).toBeVisible();
    expect(screen.getByText(project!.client, { exact: false })).toBeVisible();
    expect(screen.getByText(project!.role, { exact: false })).toBeVisible();
    expect(screen.getByText(String(project!.year), { exact: false })).toBeVisible();
    expect(screen.getByText(project!.summary)).toBeVisible();
    expect(layer?.querySelector('[data-ui="youtube-embed"]')).not.toBeNull();
    expect(
      screen.getByRole("button", { name: `Reproducir ${project!.title}` }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "escríbeme" })).toHaveAttribute(
      "href",
      "/contacto",
    );
    expect(
      screen.getByRole("link", { name: "Volver a trabajo" }),
    ).toHaveAttribute("href", "/trabajo");
  });

  it("pinta en la galería tantas imágenes como stills, con alt en español", async () => {
    const project = await content.getProjectBySlug("lookbook-verano-casco");
    expect(project).not.toBeNull();

    render(<CaseStudy project={project!} />);

    const gallery = document.querySelector('[data-ui="case-stills"]');
    expect(gallery).not.toBeNull();
    const images = within(gallery as HTMLElement).getAllByRole("img");

    expect(images).toHaveLength(project!.stills.length);
    project!.stills.forEach((still, index) => {
      expect(images[index]).toHaveAttribute("alt", still.alt);
      expect(images[index]?.getAttribute("alt")).not.toMatch(
        /\.(svg|jpe?g|png|webp)$/i,
      );
    });
  });

  it("deja la ficha técnica colapsada por defecto", async () => {
    const project = await content.getProjectBySlug("spot-reloj-nocturno");
    expect(project).not.toBeNull();
    expect(project!.camera).toBeDefined();
    expect(project!.codec).toBeDefined();

    render(<CaseStudy project={project!} />);

    const panel = document.querySelector('[data-ui="case-geek"]');
    expect(screen.getByRole("button", { name: "Ficha técnica" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(panel).not.toBeNull();
    expect(panel).not.toBeVisible();
    expect(screen.getByText("Cámara")).not.toBeVisible();
    expect(screen.getByText("Codec")).not.toBeVisible();
    expect(screen.queryByText(project!.camera!)).not.toBeVisible();
    expect(screen.queryByText(project!.codec!)).not.toBeVisible();
  });

  it("no ofrece ficha técnica si el proyecto no tiene campos geek", async () => {
    const project = await content.getProjectBySlug("retrato-estudio-blanco");
    expect(project).not.toBeNull();

    render(<CaseStudy project={project!} />);

    expect(
      screen.queryByRole("button", { name: "Ficha técnica" }),
    ).not.toBeInTheDocument();
    expect(document.querySelector('[data-ui="case-geek"]')).toBeNull();
  });
});
