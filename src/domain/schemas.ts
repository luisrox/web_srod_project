import { z } from "zod";

/** Slug kebab en minúsculas, sin tildes: p. ej. `lookbook-verano-casco`. */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

/** ID de video YouTube (11 caracteres). Los fixtures usan dummies documentados. */
export const youtubeVideoIdSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{11}$/);

const nonEmpty = z.string().min(1);

export const stillSchema = z.strictObject({
  src: nonEmpty,
  alt: nonEmpty,
});

export const extraBlockSchema = z.strictObject({
  title: nonEmpty,
  body: nonEmpty,
});

const featuredSlugsSchema = z.array(slugSchema).min(2).max(3);
const kitTeaserIdsSchema = z.array(nonEmpty).min(2).max(3);

export const extraSocialSchema = z.strictObject({
  label: nonEmpty,
  url: z.url(),
});

export const siteSettingsSchema = z.strictObject({
  heroTitle: nonEmpty,
  heroSubtitle: nonEmpty,
  contactEmail: z.email(),
  youtubeUrl: z.url(),
  /**
   * ID de canal `UC…` para el RSS (`feeds/videos.xml?channel_id=`).
   * `/c/` y `@handle` no bastan: el feed no resuelve el canal sin este campo.
   */
  youtubeChannelId: z
    .string()
    .regex(/^UC[A-Za-z0-9_-]{22}$/)
    .optional(),
  instagramUrl: z.url(),
  youtubeFeedCount: z.int().min(1).max(24),
  /** Bloque “dónde encontrarme”: vacío o null es válido (SPEC §5). */
  whereaboutsText: z.string().nullable(),
  shopUrl: z.url(),
  musicUrl: z.url().optional(),
  extraSocials: z.array(extraSocialSchema).optional(),
  formCcEmail: z.email().optional(),
  /** Línea corta de ubicación en /contacto. No se usa en el hero. */
  availabilityNote: nonEmpty.optional(),
  heroYoutubeVideoId: youtubeVideoIdSchema,
  featuredProjectSlugs: featuredSlugsSchema,
  kitTeaserIds: kitTeaserIdsSchema,
  aboutExcerpt: nonEmpty,
  aboutBody: nonEmpty,
  portrait: nonEmpty,
});

const geekFields = {
  camera: nonEmpty.optional(),
  lenses: nonEmpty.optional(),
  lighting: nonEmpty.optional(),
  look: nonEmpty.optional(),
  whyNotes: nonEmpty.optional(),
  codec: nonEmpty.optional(),
  pipeline: nonEmpty.optional(),
  extraBlocks: z.array(extraBlockSchema).optional(),
};

export const projectSchema = z.strictObject({
  title: nonEmpty,
  slug: slugSchema,
  client: nonEmpty,
  role: nonEmpty,
  year: z.int().min(2000).max(2100),
  youtubeVideoId: youtubeVideoIdSchema,
  stills: z.array(stillSchema).min(1),
  summary: nonEmpty,
  order: z.int(),
  featured: z.boolean().optional(),
  ...geekFields,
});

export const kitItemSchema = z.strictObject({
  id: slugSchema,
  name: nonEmpty,
  photo: nonEmpty.optional(),
  usageNote: nonEmpty,
  order: z.int(),
});

export type Still = z.infer<typeof stillSchema>;
export type ExtraBlock = z.infer<typeof extraBlockSchema>;
export type ExtraSocial = z.infer<typeof extraSocialSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type Project = z.infer<typeof projectSchema>;
export type KitItem = z.infer<typeof kitItemSchema>;

export const GEEK_FIELD_KEYS = [
  "camera",
  "lenses",
  "lighting",
  "look",
  "whyNotes",
  "codec",
  "pipeline",
  "extraBlocks",
] as const satisfies ReadonlyArray<keyof Project>;

export function hasGeekFields(project: Project): boolean {
  return GEEK_FIELD_KEYS.some((key) => {
    const value = project[key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return typeof value === "string" && value.length > 0;
  });
}
