import { describe, expect, it } from "vitest";

import {
  kitItemFixtures,
  projectFixtures,
  siteSettingsFixture,
} from "@/content/fixtures";
import {
  GEEK_FIELD_KEYS,
  hasGeekFields,
  kitItemSchema,
  projectSchema,
  siteSettingsSchema,
} from "@/domain/schemas";

function withoutKey<T extends object, K extends keyof T>(
  obj: T,
  key: K,
): Omit<T, K> {
  const copy = { ...obj };
  delete copy[key];
  return copy;
}

describe("siteSettingsSchema", () => {
  it("parsea el fixture de settings", () => {
    expect(siteSettingsSchema.parse(siteSettingsFixture).heroTitle).toBe(
      siteSettingsFixture.heroTitle,
    );
  });

  it("permite dónde encontrarme vacío o nulo y omite el enlace de música", () => {
    expect(
      siteSettingsSchema.parse({
        ...siteSettingsFixture,
        whereaboutsText: "",
      }).whereaboutsText,
    ).toBe("");

    expect(
      siteSettingsSchema.parse({
        ...siteSettingsFixture,
        whereaboutsText: null,
      }).whereaboutsText,
    ).toBeNull();

    const parsed = siteSettingsSchema.parse(
      withoutKey(
        { ...siteSettingsFixture, musicUrl: "https://example.com/musica" },
        "musicUrl",
      ),
    );

    expect(parsed.musicUrl).toBeUndefined();
  });

  it("acepta youtubeChannelId opcional para el RSS del Home", () => {
    expect(siteSettingsSchema.parse(siteSettingsFixture).youtubeChannelId).toBe(
      "UC0JZGMS9SBmv3fPVSqZh4zQ",
    );

    expect(
      siteSettingsSchema.parse(
        withoutKey(siteSettingsFixture, "youtubeChannelId"),
      ).youtubeChannelId,
    ).toBeUndefined();
  });

  it("acepta availabilityNote opcional para el aside de contacto", () => {
    expect(
      siteSettingsSchema.parse(siteSettingsFixture).availabilityNote,
    ).toMatch(/Panamá/);

    expect(
      siteSettingsSchema.parse(
        withoutKey(siteSettingsFixture, "availabilityNote"),
      ).availabilityNote,
    ).toBeUndefined();
  });

  it("exige 2 o 3 destacados y teasers de kit cuyos ids existen en fixtures", () => {
    const settings = siteSettingsSchema.parse(siteSettingsFixture);
    const projectSlugs = new Set(projectFixtures.map((project) => project.slug));
    const kitIds = new Set(kitItemFixtures.map((item) => item.id));

    expect(settings.featuredProjectSlugs.length).toBeGreaterThanOrEqual(2);
    expect(settings.featuredProjectSlugs.length).toBeLessThanOrEqual(3);
    expect(settings.kitTeaserIds.length).toBeGreaterThanOrEqual(2);
    expect(settings.kitTeaserIds.length).toBeLessThanOrEqual(3);

    for (const slug of settings.featuredProjectSlugs) {
      expect(projectSlugs.has(slug)).toBe(true);
    }

    for (const id of settings.kitTeaserIds) {
      expect(kitIds.has(id)).toBe(true);
    }

    expect(
      siteSettingsSchema.safeParse({
        ...siteSettingsFixture,
        featuredProjectSlugs: ["un-solo-slug"],
      }).success,
    ).toBe(false);

    expect(
      siteSettingsSchema.safeParse({
        ...siteSettingsFixture,
        kitTeaserIds: ["uno", "dos", "tres", "cuatro"],
      }).success,
    ).toBe(false);
  });

  it("acepta extraSocials opcional y lo omite si no viene", () => {
    expect(
      siteSettingsSchema.parse(siteSettingsFixture).extraSocials,
    ).toBeUndefined();

    const withExtras = siteSettingsSchema.parse({
      ...siteSettingsFixture,
      extraSocials: [{ label: "Vimeo", url: "https://vimeo.com/srod" }],
    });

    expect(withExtras.extraSocials).toEqual([
      { label: "Vimeo", url: "https://vimeo.com/srod" },
    ]);
  });

  it("exige heroYoutubeVideoId con formato de video YouTube", () => {
    const parsed = siteSettingsSchema.parse(siteSettingsFixture);
    expect(parsed.heroYoutubeVideoId).toBe("srodHeroVid");

    expect(
      siteSettingsSchema.safeParse(
        withoutKey(siteSettingsFixture, "heroYoutubeVideoId"),
      ).success,
    ).toBe(false);
  });
});

describe("projectSchema", () => {
  const sample = projectFixtures[0];

  it("parsea todos los proyectos fixture", () => {
    expect(sample).toBeDefined();

    for (const project of projectFixtures) {
      expect(projectSchema.parse(project).slug).toBe(project.slug);
    }
  });

  it("falla sin título, slug, año, video YouTube, galería o contexto", () => {
    expect(sample).toBeDefined();
    const required = [
      "title",
      "slug",
      "year",
      "youtubeVideoId",
      "stills",
      "summary",
    ] as const;

    for (const key of required) {
      expect(
        projectSchema.safeParse(withoutKey(sample!, key)).success,
        `debería fallar sin ${key}`,
      ).toBe(false);
    }

    expect(
      projectSchema.safeParse({ ...sample, stills: [] }).success,
    ).toBe(false);
  });

  it("permite omitir los campos geek opcionales", () => {
    const lean = projectFixtures.find(
      (project) => project.slug === "retrato-estudio-blanco",
    );
    expect(lean).toBeDefined();

    const parsed = projectSchema.parse(lean);

    for (const key of GEEK_FIELD_KEYS) {
      expect(parsed[key]).toBeUndefined();
    }
  });

  it("deja cuatro fichas ricas y un proyecto sin ningún campo geek", () => {
    const parsed = projectFixtures.map((project) => projectSchema.parse(project));
    const withGeek = parsed.filter(hasGeekFields);
    const withoutGeek = parsed.filter((project) => !hasGeekFields(project));

    expect(withGeek).toHaveLength(4);
    expect(withoutGeek).toHaveLength(1);
    expect(withoutGeek[0]?.slug).toBe("retrato-estudio-blanco");
  });
});

describe("kitItemSchema", () => {
  const sample = kitItemFixtures[0];

  it("parsea todas las piezas de kit fixture", () => {
    expect(sample).toBeDefined();

    for (const item of kitItemFixtures) {
      expect(kitItemSchema.parse(item).id).toBe(item.id);
    }
  });

  it("acepta una pieza sin foto y rechaza sin nombre o sin nota de uso", () => {
    expect(sample).toBeDefined();

    expect(
      kitItemSchema.safeParse(withoutKey(sample!, "photo")).success,
    ).toBe(true);

    expect(kitItemSchema.safeParse(withoutKey(sample!, "name")).success).toBe(
      false,
    );
    expect(
      kitItemSchema.safeParse(withoutKey(sample!, "usageNote")).success,
    ).toBe(false);
  });
});
