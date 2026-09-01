import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { content } from "@/content";

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

const { default: RecomendadosPage } = await import("./page");

describe("página /recomendados", () => {
  it("lista todos los picks del repositorio", async () => {
    const items = await content.getPickItems();
    render(await RecomendadosPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Recomendados" }),
    ).toBeVisible();
    expect(document.querySelector('[data-ui="pick-list"]')).not.toBeNull();
    expect(document.querySelectorAll("[data-id]")).toHaveLength(items.length);
    expect(
      screen.getByRole("link", { name: /Brandon Li x Freewell/ }),
    ).toHaveAttribute("href", items[0]?.url);
    expect(screen.getByRole("heading", { level: 1, name: "Recomendados" }).closest("div")).toHaveClass(
      "max-w-3xl",
    );
  });
});
