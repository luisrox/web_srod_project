import { describe, expect, it, vi } from "vitest";

import { siteSettingsFixture } from "@/content/fixtures";

import { mapKitItems, mapProjects, mapSiteSettings } from "./mapper";

const groqSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  _rev: "rev",
  ...siteSettingsFixture,
};

const groqProject = {
  _id: "project.lookbook-verano-casco",
  _type: "project",
  _createdAt: "2025-01-01T00:00:00Z",
  title: "Lookbook verano en Casco",
  slug: "lookbook-verano-casco",
  client: "Casa Textil",
  role: "Director de fotografía",
  year: 2025,
  youtubeVideoId: "srodLookbk1",
  stills: [
    {
      src: "/placeholders/lookbook-verano-1.svg",
      alt: "Modelo recortada contra un muro de cal en Casco Viejo, tela en movimiento",
    },
  ],
  summary: "Un lookbook de día en Casco Viejo.",
  order: 1,
  featured: true,
  camera: "Sony FX3",
};

describe("mapper Sanity → dominio", () => {
  it("convierte un documento GROQ en SiteSettings válido", () => {
    const settings = mapSiteSettings(groqSettings);

    expect(settings.heroTitle).toBe(siteSettingsFixture.heroTitle);
    expect(settings.contactEmail).toBe(siteSettingsFixture.contactEmail);
    expect(settings.featuredProjectSlugs).toHaveLength(3);
  });

  it("convierte un documento GROQ en Project válido", () => {
    const [project] = mapProjects([groqProject]);

    expect(project?.slug).toBe("lookbook-verano-casco");
    expect(project?.stills.length).toBeGreaterThan(0);
    expect(project?.camera).toBe("Sony FX3");
  });

  it("omite documentos incompletos (log + skip) y no tira la lista", () => {
    const log = vi.fn();
    const projects = mapProjects(
      [groqProject, { _id: "project.roto", _type: "project", slug: "roto" }],
      log,
    );

    expect(projects).toHaveLength(1);
    expect(projects[0]?.slug).toBe("lookbook-verano-casco");
    expect(log).toHaveBeenCalled();
    expect(String(log.mock.calls[0]?.[0])).toMatch(/omitido/);
  });

  it("omite kitItems incompletos y sigue con los válidos", () => {
    const log = vi.fn();
    const items = mapKitItems(
      [
        {
          _id: "kitItem.sony-fx3",
          _type: "kitItem",
          id: "sony-fx3",
          name: "Sony FX3",
          usageNote: "Cuerpo chico.",
          order: 1,
        },
        { _id: "kitItem.roto", _type: "kitItem", name: "Sin id" },
      ],
      log,
    );

    expect(items.map((item) => item.id)).toEqual(["sony-fx3"]);
    expect(log).toHaveBeenCalled();
  });
});
