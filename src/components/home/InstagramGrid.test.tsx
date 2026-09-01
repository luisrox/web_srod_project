import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import type { InstagramPost } from "@/lib/instagram";

import { InstagramGrid } from "./InstagramGrid";

vi.mock("next/link", () => ({
  default({ href, children }: { href: string; children: ReactNode }) {
    return <a href={href}>{children}</a>;
  },
}));

const profile = "https://www.instagram.com/srodalmenara/";

function mockPosts(count: number): InstagramPost[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `ig-${index + 1}`,
    url: `https://www.instagram.com/p/post-${index + 1}/`,
    imageUrl: `https://cdn.example/${index + 1}.jpg`,
    alt: `Publicación ${index + 1} en set`,
  }));
}

describe("InstagramGrid", () => {
  it("con 6 posts mock renderiza seis figuras con alt y enlace externo", () => {
    const posts = mockPosts(6);
    render(<InstagramGrid href={profile} posts={posts} />);

    const block = document.querySelector('[data-ui="instagram-teaser"]');
    expect(block).not.toBeNull();
    expect(block?.querySelectorAll("figure")).toHaveLength(6);
    expect(block?.querySelectorAll("img")).toHaveLength(6);

    posts.forEach((post) => {
      const link = screen.getByRole("link", { name: new RegExp(post.alt) });
      expect(link).toHaveAttribute("href", post.url);
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.querySelector("img")).toHaveAttribute("alt", post.alt);
    });

    expect(
      within(block as HTMLElement).getByRole("link", { name: /Ver el perfil/ }),
    ).toHaveAttribute("href", profile);
  });

  it("con posts vacíos no muestra grid roto: mensaje breve y enlace al perfil", () => {
    render(<InstagramGrid href={profile} posts={[]} />);

    const block = document.querySelector('[data-ui="instagram-teaser"]');
    expect(block?.querySelector("ul")).toBeNull();
    expect(block?.querySelectorAll("figure")).toHaveLength(0);
    expect(block?.textContent).toMatch(/perfil/i);
    expect(
      screen.getByRole("link", { name: /Ver el perfil/ }),
    ).toHaveAttribute("href", profile);
  });
});
