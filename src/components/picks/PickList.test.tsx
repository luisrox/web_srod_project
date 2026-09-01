import { render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { content } from "@/content";
import type { PickItem } from "@/domain/schemas";

import { PickList } from "./PickList";

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

describe("PickList", () => {
  it("el orden en el DOM coincide con order ascendente", async () => {
    const items = await content.getPickItems();
    const reversed = [...items].reverse();
    render(<PickList items={reversed} />);

    const nodes = [...document.querySelectorAll("[data-id]")];
    const expected = [...items]
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
      .map((item) => item.id);

    expect(nodes.map((node) => node.getAttribute("data-id"))).toEqual(expected);
  });

  it("muestra nombre, nota, foto y el recuadro entero enlaza al destino", async () => {
    const items = await content.getPickItems();
    render(<PickList items={items} />);

    items.forEach((item: PickItem) => {
      const row = document.querySelector(`[data-id="${item.id}"]`);
      expect(row).not.toBeNull();
      expect(within(row as HTMLElement).getByText(item.name)).toBeVisible();
      expect(within(row as HTMLElement).getByText(item.note)).toBeVisible();
      expect(row?.querySelector("img")).toHaveAttribute("src", item.photo);
      expect(row?.querySelector("a")).toHaveAttribute("href", item.url);
      expect(row?.querySelector("a")).toHaveAttribute(
        "rel",
        "noopener noreferrer",
      );
      expect(
        within(row as HTMLElement).queryByRole("link", {
          name: new RegExp(item.cta),
        }),
      ).toBeNull();
    });
  });
});
