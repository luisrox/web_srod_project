import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { content } from "@/content";
import type { KitItem } from "@/domain/schemas";

import { KitList } from "./KitList";

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

describe("KitList", () => {
  it("el orden en el DOM coincide con order ascendente", async () => {
    const items = await content.getKitItems();
    const reversed = [...items].reverse();
    render(<KitList items={reversed} />);

    const nodes = [...document.querySelectorAll("[data-id]")];
    const expected = [...items]
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
      .map((item) => item.id);

    expect(nodes.map((node) => node.getAttribute("data-id"))).toEqual(expected);
  });

  it("un ítem sin photo no renderiza img", async () => {
    const items = await content.getKitItems();
    const withoutPhoto = items.find((item) => !item.photo);
    expect(withoutPhoto).toBeDefined();

    render(<KitList items={[withoutPhoto!]} />);

    const row = document.querySelector(`[data-id="${withoutPhoto!.id}"]`);
    expect(row).not.toBeNull();
    expect(row?.querySelector("img")).toBeNull();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("muestra el nombre y la nota de cada pieza", async () => {
    const items = await content.getKitItems();
    render(<KitList items={items} />);

    items.forEach((item: KitItem) => {
      const row = document.querySelector(`[data-id="${item.id}"]`);
      expect(row).not.toBeNull();
      expect(within(row as HTMLElement).getByText(item.name)).toBeVisible();
      expect(within(row as HTMLElement).getByText(item.usageNote)).toBeVisible();
    });
  });
});
