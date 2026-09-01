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

const { default: KitPage } = await import("./page");

describe("página /kit", () => {
  it("lista todas las piezas del repositorio en KitList", async () => {
    const items = await content.getKitItems();
    render(await KitPage());

    expect(screen.getByRole("heading", { level: 1, name: "Kit" })).toBeVisible();
    expect(document.querySelector('[data-ui="kit-list"]')).not.toBeNull();
    expect(document.querySelectorAll("[data-id]")).toHaveLength(items.length);
  });
});
