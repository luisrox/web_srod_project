import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { siteSettingsFixture } from "@/content/fixtures";

import { ContactModal } from "./ContactModal";

vi.mock("next/link", () => ({
  default({ href, children }: { href: string; children: ReactNode }) {
    return <a href={href}>{children}</a>;
  },
}));

const settings = siteSettingsFixture;

describe("ContactModal", () => {
  it("no pinta el diálogo cerrado", () => {
    render(
      <ContactModal
        open={false}
        onClose={vi.fn()}
        contactEmail={settings.contactEmail}
        youtubeUrl={settings.youtubeUrl}
        instagramUrl={settings.instagramUrl}
      />,
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("abre el formulario y cierra con Cerrar", () => {
    const onClose = vi.fn();
    render(
      <ContactModal
        open
        onClose={onClose}
        contactEmail={settings.contactEmail}
        youtubeUrl={settings.youtubeUrl}
        instagramUrl={settings.instagramUrl}
        availabilityNote={settings.availabilityNote}
      />,
    );

    const dialog = screen.getByRole("dialog", { name: "Contacto" });
    expect(dialog).toBeVisible();
    expect(
      within(dialog).getByRole("form", { name: "Formulario de contacto" }),
    ).toBeVisible();
    expect(within(dialog).getByLabelText("Nombre")).toHaveAttribute(
      "id",
      "modal-nombre",
    );
    expect(within(dialog).getByText(settings.contactEmail)).toBeVisible();

    fireEvent.click(within(dialog).getByRole("button", { name: "Cerrar" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
