import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import type { YoutubeVideo } from "@/lib/youtube-feed";

import { YoutubeWindow } from "./YoutubeWindow";

vi.mock("next/link", () => ({
  default({ href, children }: { href: string; children: ReactNode }) {
    return <a href={href}>{children}</a>;
  },
}));

const videos: YoutubeVideo[] = [
  {
    id: "aaaaaaaaaaa",
    title: "Look en Casco",
    thumbnail: "https://i.ytimg.com/vi/aaaaaaaaaaa/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=aaaaaaaaaaa",
    publishedAt: "2026-01-01T12:00:00+00:00",
  },
  {
    id: "bbbbbbbbbbb",
    title: "Café en Boquete",
    thumbnail: "https://i.ytimg.com/vi/bbbbbbbbbbb/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=bbbbbbbbbbb",
    publishedAt: "2026-02-01T12:00:00+00:00",
  },
];

describe("YoutubeWindow", () => {
  it("con feed ok muestra N cards con título accesible, thumb y enlace externo", () => {
    render(
      <YoutubeWindow
        href="https://www.youtube.com/c/srodmode"
        feed={{ ok: true, videos }}
      />,
    );

    const block = document.querySelector('[data-ui="youtube-teaser"]');
    expect(block).not.toBeNull();

    const look = screen.getByRole("link", { name: /Look en Casco/ });
    expect(look).toHaveAttribute("href", videos[0]?.url);
    expect(look).toHaveAttribute("rel", "noopener noreferrer");
    expect(look.querySelector("img")).toHaveAttribute("src", videos[0]?.thumbnail);
    expect(look.querySelector("img")).toHaveAttribute("loading", "lazy");

    expect(screen.getByRole("link", { name: /Café en Boquete/ })).toBeVisible();
    expect(
      within(block as HTMLElement).getByRole("link", { name: /Ver el canal/ }),
    ).toHaveAttribute("href", "https://www.youtube.com/c/srodmode");
  });

  it("si el feed falla muestra el CTA y no un grid vacío de cards", () => {
    render(
      <YoutubeWindow
        href="https://www.youtube.com/c/srodmode"
        feed={{ ok: false, videos: [] }}
      />,
    );

    const block = document.querySelector('[data-ui="youtube-teaser"]');
    expect(block?.querySelectorAll("img")).toHaveLength(0);
    expect(block?.querySelector("ul")).toBeNull();
    expect(
      screen.getByRole("link", { name: /Ver el canal/ }),
    ).toBeVisible();
  });
});
