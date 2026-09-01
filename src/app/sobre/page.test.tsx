import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { ABOUT_PORTRAIT_ALT } from "@/components/about/AboutBio";
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

const { default: SobrePage } = await import("./page");

describe("página /sobre", () => {
  it("compone la bio desde siteSettings", async () => {
    const settings = await content.getSiteSettings();
    render(await SobrePage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Sobre Srod" }),
    ).toBeVisible();
    expect(screen.getByText(settings.aboutExcerpt)).toBeVisible();
    expect(
      screen.getByRole("img", { name: ABOUT_PORTRAIT_ALT }),
    ).toHaveAttribute("src", settings.portrait);
    expect(document.querySelector('[data-ui="about"]')).not.toBeNull();
  });
});
