import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { siteSettingsFixture } from "@/content/fixtures";

import { ContactAside } from "./ContactAside";

vi.mock("next/link", () => ({
  default({ href, children }: { href: string; children: ReactNode }) {
    return <a href={href}>{children}</a>;
  },
}));

const settings = siteSettingsFixture;

describe("ContactAside", () => {
  it("copia el email de respaldo y anuncia el resultado", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(
      <ContactAside
        contactEmail={settings.contactEmail}
        youtubeUrl={settings.youtubeUrl}
        instagramUrl={settings.instagramUrl}
        availabilityNote={settings.availabilityNote}
      />,
    );

    expect(
      screen.getByRole("link", { name: settings.contactEmail }),
    ).toHaveAttribute("href", `mailto:${settings.contactEmail}`);

    await user.click(screen.getByRole("button", { name: "Copiar" }));

    expect(writeText).toHaveBeenCalledWith(settings.contactEmail);
    const status = screen.getByText("Email copiado");
    expect(status).toBeVisible();
    expect(status.closest("[aria-live]")).toHaveAttribute("aria-live", "polite");
  });

  it("menciona Panamá y lo remoto, y enlaza YouTube, Instagram y TikTok", () => {
    render(
      <ContactAside
        contactEmail={settings.contactEmail}
        youtubeUrl={settings.youtubeUrl}
        instagramUrl={settings.instagramUrl}
        extraSocials={settings.extraSocials}
        availabilityNote={settings.availabilityNote}
      />,
    );

    const aside = document.querySelector('[data-ui="contact-aside"]');
    expect(aside?.textContent).toMatch(/Panamá/);
    expect(aside?.textContent).toMatch(/remot/i);
    expect(aside?.textContent).toMatch(/internacional/i);
    expect(screen.getByRole("link", { name: /YouTube/ })).toHaveAttribute(
      "href",
      settings.youtubeUrl,
    );
    expect(screen.getByRole("link", { name: /Instagram/ })).toHaveAttribute(
      "href",
      settings.instagramUrl,
    );
    expect(screen.getByRole("link", { name: /TikTok/ })).toHaveAttribute(
      "href",
      "https://www.tiktok.com/@srodalmenara",
    );
  });
});
