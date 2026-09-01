import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { content } from "@/content";
import type { Project } from "@/domain/schemas";

import { WorkIndex } from "./WorkIndex";

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

const projects: Project[] = [];

beforeAll(async () => {
  projects.push(...(await content.getProjects()));
});

function articles() {
  return screen.getAllByRole("article");
}

describe("WorkIndex", () => {
  it("renderiza un artículo por proyecto, en el orden de project.order", () => {
    const reversed = [...projects].reverse();
    render(<WorkIndex projects={reversed} />);

    const nodes = articles();
    expect(nodes).toHaveLength(projects.length);

    const expected = [...projects].sort(
      (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
    );

    expected.forEach((project, index) => {
      const card = nodes[index]!;
      expect(
        within(card).getByRole("heading", { level: 2, name: project.title }),
      ).toBeVisible();
      expect(
        within(card).getByRole("link", { name: project.title }),
      ).toHaveAttribute("href", `/trabajo/${project.slug}`);
      expect(within(card).getByText(project.client)).toBeVisible();
      expect(within(card).getByText(`${project.role} · ${project.year}`)).toBeVisible();
    });
  });

  it("no renderiza slugs duplicados", () => {
    const first = projects[0];
    expect(first).toBeDefined();

    render(<WorkIndex projects={[first!, first!, ...projects]} />);

    const slugs = articles().map((card) => {
      const href = within(card).getByRole("link").getAttribute("href");
      return href?.replace("/trabajo/", "");
    });

    expect(slugs).toHaveLength(projects.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.filter((slug) => slug === first!.slug)).toHaveLength(1);
  });

  it("cada card tiene alt en español, no el filename del still", () => {
    render(<WorkIndex projects={projects} />);

    projects.forEach((project) => {
      const still = project.stills[0];
      expect(still).toBeDefined();
      const filename = still!.src.split("/").pop() ?? "";
      const card = screen
        .getByRole("heading", { level: 2, name: project.title })
        .closest("article");
      const img = within(card as HTMLElement).getByRole("img");

      expect(img).toHaveAttribute("alt", still!.alt);
      expect(img.getAttribute("alt")).not.toBe(filename);
      expect(img.getAttribute("alt")).not.toMatch(/\.(svg|jpe?g|png|webp)$/i);
      expect(still!.alt).toMatch(/[áéíóúñü]|[A-Za-zÁÉÍÓÚÑÜ]/);
    });
  });

  it("no muestra la ficha técnica en el índice", () => {
    const withGeek = projects.find(
      (project): project is Project & { camera: string; codec?: string } =>
        Boolean(project.camera),
    );
    expect(withGeek).toBeDefined();

    render(<WorkIndex projects={projects} />);

    expect(screen.queryByText("Ficha técnica")).not.toBeInTheDocument();
    expect(screen.queryByText(withGeek!.camera)).not.toBeInTheDocument();
    if (withGeek!.codec) {
      expect(screen.queryByText(withGeek!.codec)).not.toBeInTheDocument();
    }
  });
});
