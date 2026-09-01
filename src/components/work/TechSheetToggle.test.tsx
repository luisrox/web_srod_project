import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { content } from "@/content";

import { TechSheetToggle } from "./TechSheetToggle";

async function loadLookbook() {
  const project = await content.getProjectBySlug("lookbook-verano-casco");
  expect(project).not.toBeNull();
  expect(project!.camera).toBeDefined();
  return project!;
}

describe("TechSheetToggle", () => {
  it("abre la ficha con click y teclado, y el segundo click la cierra", async () => {
    const user = userEvent.setup();
    const project = await loadLookbook();
    render(<TechSheetToggle project={project} />);

    const button = screen.getByRole("button", { name: "Ficha técnica" });
    const panel = document.querySelector('[data-ui="case-geek"]');

    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", panel?.id);
    expect(panel).not.toBeVisible();
    expect(screen.getByText("Cámara")).not.toBeVisible();

    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(panel).toBeVisible();
    expect(screen.getByText("Cámara")).toBeVisible();
    expect(screen.getByText(project.camera!)).toBeVisible();
    expect(screen.getByText("Lentes")).toBeVisible();
    expect(screen.queryByText("Codec")).not.toBeInTheDocument();

    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(panel).not.toBeVisible();
    expect(screen.getByText("Cámara")).not.toBeVisible();

    button.focus();
    await user.keyboard("{Enter}");

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(panel).toBeVisible();

    await user.keyboard(" ");

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(panel).not.toBeVisible();
  });

  it("no pinta el botón si el proyecto no tiene campos geek", async () => {
    const project = await content.getProjectBySlug("retrato-estudio-blanco");
    expect(project).not.toBeNull();

    render(<TechSheetToggle project={project!} />);

    expect(
      screen.queryByRole("button", { name: "Ficha técnica" }),
    ).not.toBeInTheDocument();
    expect(document.querySelector('[data-ui="case-geek"]')).toBeNull();
  });
});
