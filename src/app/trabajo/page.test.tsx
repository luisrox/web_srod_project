import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { content } from "@/content";

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

const { default: TrabajoPage } = await import("./page");

describe("página /trabajo", () => {
  it("lista todos los proyectos del repositorio en WorkIndex", async () => {
    const projects = await content.getProjects();
    render(await TrabajoPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Trabajo" }),
    ).toBeVisible();
    expect(document.querySelector('[data-ui="work-index"]')).not.toBeNull();
    expect(screen.getAllByRole("article")).toHaveLength(projects.length);
    expect(projects.length).toBeGreaterThanOrEqual(3);
    expect(projects.length).toBeLessThanOrEqual(8);
  });
});
