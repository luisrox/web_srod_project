import { describe, expect, it } from "vitest";

import {
  extraBlockType,
  extraSocialType,
  kitItemType,
  projectType,
  siteSettingsType,
  stillType,
} from "@/sanity/schemas";
import {
  SITE_SETTINGS_DOCUMENT_ID,
  isSingletonType,
  singletonDocumentActions,
  withoutSingletonTemplates,
} from "@/sanity/singleton";
import {
  kitItemSchema,
  projectSchema,
  siteSettingsSchema,
} from "@/domain/schemas";

type NamedFields = { name: string; type: string; fields?: NamedFields[] };

function fieldNames(type: { fields?: NamedFields[] }): string[] {
  return type.fields?.map((field) => field.name) ?? [];
}

const SITE_SETTINGS_FIELDS = [
  "heroTitle",
  "heroSubtitle",
  "contactEmail",
  "youtubeUrl",
  "youtubeChannelId",
  "instagramUrl",
  "youtubeFeedCount",
  "whereaboutsText",
  "shopUrl",
  "musicUrl",
  "extraSocials",
  "formCcEmail",
  "availabilityNote",
  "heroYoutubeVideoId",
  "featuredProjectSlugs",
  "kitTeaserIds",
  "aboutExcerpt",
  "aboutBody",
  "portrait",
] as const;

const PROJECT_FIELDS = [
  "title",
  "slug",
  "client",
  "role",
  "year",
  "youtubeVideoId",
  "stills",
  "summary",
  "order",
  "featured",
  "camera",
  "lenses",
  "lighting",
  "look",
  "whyNotes",
  "codec",
  "pipeline",
  "extraBlocks",
] as const;

const KIT_ITEM_FIELDS = ["id", "name", "photo", "usageNote", "order"] as const;

describe("schemas Sanity ↔ Zod", () => {
  it("siteSettings declara name/type y todos los campos del Zod", () => {
    expect(siteSettingsType.name).toBe("siteSettings");
    expect(siteSettingsType.type).toBe("document");
    expect(fieldNames(siteSettingsType)).toEqual([...SITE_SETTINGS_FIELDS]);
    expect([...fieldNames(siteSettingsType)].sort()).toEqual(
      Object.keys(siteSettingsSchema.shape).sort(),
    );
  });

  it("project declara name/type y todos los campos del Zod", () => {
    expect(projectType.name).toBe("project");
    expect(projectType.type).toBe("document");
    expect(fieldNames(projectType)).toEqual([...PROJECT_FIELDS]);
    expect([...fieldNames(projectType)].sort()).toEqual(
      Object.keys(projectSchema.shape).sort(),
    );
  });

  it("kitItem declara name/type y todos los campos del Zod", () => {
    expect(kitItemType.name).toBe("kitItem");
    expect(kitItemType.type).toBe("document");
    expect(fieldNames(kitItemType)).toEqual([...KIT_ITEM_FIELDS]);
    expect([...fieldNames(kitItemType)].sort()).toEqual(
      Object.keys(kitItemSchema.shape).sort(),
    );
  });

  it("los objetos anidados siguen el Zod (still, extraBlock, extraSocial)", () => {
    expect(stillType.name).toBe("still");
    expect(stillType.type).toBe("object");
    expect(fieldNames(stillType)).toEqual(["src", "alt"]);

    expect(extraBlockType.name).toBe("extraBlock");
    expect(fieldNames(extraBlockType)).toEqual(["title", "body"]);

    expect(extraSocialType.name).toBe("extraSocial");
    expect(fieldNames(extraSocialType)).toEqual(["label", "url"]);
  });
});

describe("siteSettings singleton", () => {
  it("es un único documento con id fijo", () => {
    expect(SITE_SETTINGS_DOCUMENT_ID).toBe("siteSettings");
    expect(siteSettingsType.name).toBe(SITE_SETTINGS_DOCUMENT_ID);
    expect(isSingletonType("siteSettings")).toBe(true);
    expect(isSingletonType("project")).toBe(false);

    expect(
      withoutSingletonTemplates([
        { schemaType: "siteSettings" },
        { schemaType: "project" },
      ]),
    ).toEqual([{ schemaType: "project" }]);

    expect(
      singletonDocumentActions(
        [
          { action: "publish" },
          { action: "delete" },
          { action: "duplicate" },
          { action: "discardChanges" },
        ],
        "siteSettings",
      ),
    ).toEqual([{ action: "publish" }, { action: "discardChanges" }]);
  });
});
