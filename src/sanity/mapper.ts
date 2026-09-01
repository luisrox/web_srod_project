import {
  kitItemSchema,
  projectSchema,
  siteSettingsSchema,
  type KitItem,
  type Project,
  type SiteSettings,
} from "@/domain/schemas";

type Logger = (message: string) => void;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function optionalUrl(value: unknown): string | undefined {
  return optionalString(value);
}

function optionalBool(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function docId(raw: Record<string, unknown>): string {
  if (typeof raw._id === "string") {
    return raw._id;
  }
  if (typeof raw.slug === "string") {
    return raw.slug;
  }
  if (typeof raw.id === "string") {
    return raw.id;
  }
  return "sin-id";
}

function mapObjects<T>(
  value: unknown,
  mapOne: (item: Record<string, unknown>) => T | undefined,
): T[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items = value.flatMap((entry) => {
    const record = asRecord(entry);
    if (!record) {
      return [];
    }
    const mapped = mapOne(record);
    return mapped ? [mapped] : [];
  });
  return items;
}

export function mapSiteSettings(raw: unknown): SiteSettings {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("siteSettings ausente o inválido");
  }

  const parsed = siteSettingsSchema.safeParse({
    heroTitle: record.heroTitle,
    heroSubtitle: record.heroSubtitle,
    contactEmail: record.contactEmail,
    youtubeUrl: record.youtubeUrl,
    youtubeChannelId: optionalString(record.youtubeChannelId),
    instagramUrl: record.instagramUrl,
    youtubeFeedCount: record.youtubeFeedCount,
    whereaboutsText:
      record.whereaboutsText === undefined ? "" : record.whereaboutsText,
    shopUrl: record.shopUrl,
    musicUrl: optionalUrl(record.musicUrl),
    extraSocials: mapObjects(record.extraSocials, (item) => {
      const label = optionalString(item.label);
      const url = optionalUrl(item.url);
      if (!label || !url) {
        return undefined;
      }
      return { label, url };
    }),
    formCcEmail: optionalString(record.formCcEmail),
    availabilityNote: optionalString(record.availabilityNote),
    heroYoutubeVideoId: record.heroYoutubeVideoId,
    featuredProjectSlugs: record.featuredProjectSlugs,
    kitTeaserIds: record.kitTeaserIds,
    aboutExcerpt: record.aboutExcerpt,
    aboutBody: record.aboutBody,
    portrait: record.portrait,
  });

  if (!parsed.success) {
    throw new Error("siteSettings no cumple el esquema del dominio");
  }

  return parsed.data;
}

export function mapProject(
  raw: unknown,
  log: Logger = console.warn,
): Project | null {
  const record = asRecord(raw);
  if (!record) {
    log("[content] documento project omitido: no es un objeto");
    return null;
  }

  const parsed = projectSchema.safeParse({
    title: record.title,
    slug: record.slug,
    client: record.client,
    role: record.role,
    year: record.year,
    youtubeVideoId: record.youtubeVideoId,
    stills: mapObjects(record.stills, (item) => {
      const src = optionalString(item.src);
      const alt = optionalString(item.alt);
      if (!src || !alt) {
        return undefined;
      }
      return { src, alt };
    }),
    summary: record.summary,
    order: record.order,
    featured: optionalBool(record.featured),
    camera: optionalString(record.camera),
    lenses: optionalString(record.lenses),
    lighting: optionalString(record.lighting),
    look: optionalString(record.look),
    whyNotes: optionalString(record.whyNotes),
    codec: optionalString(record.codec),
    pipeline: optionalString(record.pipeline),
    extraBlocks: mapObjects(record.extraBlocks, (item) => {
      const title = optionalString(item.title);
      const body = optionalString(item.body);
      if (!title || !body) {
        return undefined;
      }
      return { title, body };
    }),
  });

  if (!parsed.success) {
    log(`[content] documento project omitido (${docId(record)})`);
    return null;
  }

  return parsed.data;
}

export function mapProjects(
  raw: unknown,
  log: Logger = console.warn,
): Project[] {
  if (!Array.isArray(raw)) {
    log("[content] lista de project omitida: no es un array");
    return [];
  }

  return raw
    .flatMap((doc) => {
      const project = mapProject(doc, log);
      return project ? [project] : [];
    })
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

export function mapKitItem(
  raw: unknown,
  log: Logger = console.warn,
): KitItem | null {
  const record = asRecord(raw);
  if (!record) {
    log("[content] documento kitItem omitido: no es un objeto");
    return null;
  }

  const parsed = kitItemSchema.safeParse({
    id: record.id,
    name: record.name,
    photo: optionalString(record.photo),
    usageNote: record.usageNote,
    shopUrl: optionalUrl(record.shopUrl),
    order: record.order,
  });

  if (!parsed.success) {
    log(`[content] documento kitItem omitido (${docId(record)})`);
    return null;
  }

  return parsed.data;
}

export function mapKitItems(
  raw: unknown,
  log: Logger = console.warn,
): KitItem[] {
  if (!Array.isArray(raw)) {
    log("[content] lista de kitItem omitida: no es un array");
    return [];
  }

  return raw
    .flatMap((doc) => {
      const item = mapKitItem(doc, log);
      return item ? [item] : [];
    })
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}
