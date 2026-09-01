export type InstagramPost = {
  id: string;
  url: string;
  imageUrl: string;
  alt: string;
};

export interface InstagramFeed {
  getPosts(): Promise<InstagramPost[]>;
}

export const INSTAGRAM_FEED_REVALIDATE_SECONDS = 3600;
export const INSTAGRAM_FEED_MAX = 9;
export const INSTAGRAM_PREVIEW_SENTINEL = "preview";

/**
 * Stills del propio lab para ver el grid en desarrollo.
 * No es el muro de Instagram: los clics van al perfil CMS.
 */
export const INSTAGRAM_PREVIEW_POSTS: InstagramPost[] = [
  {
    id: "preview-1",
    url: "https://www.instagram.com/srodalmenara/",
    imageUrl: "/placeholders/lookbook-verano-1.svg",
    alt: "Modelo recortada contra un muro de cal en Casco Viejo",
  },
  {
    id: "preview-2",
    url: "https://www.instagram.com/srodalmenara/",
    imageUrl: "/placeholders/cafe-boquete-1.svg",
    alt: "Manos seleccionando grano de café en Boquete",
  },
  {
    id: "preview-3",
    url: "https://www.instagram.com/srodalmenara/",
    imageUrl: "/placeholders/reloj-nocturno-1.svg",
    alt: "Reloj sobre mesa oscura recortado por un grid de luz",
  },
  {
    id: "preview-4",
    url: "https://www.instagram.com/srodalmenara/",
    imageUrl: "/placeholders/marca-ciudad-1.svg",
    alt: "Peatón cruzando una calle de la ciudad a mediodía",
  },
  {
    id: "preview-5",
    url: "https://www.instagram.com/srodalmenara/",
    imageUrl: "/placeholders/estudio-blanco-1.svg",
    alt: "Retrato de estudio sobre fondo claro",
  },
  {
    id: "preview-6",
    url: "https://www.instagram.com/srodalmenara/",
    imageUrl: "/placeholders/lookbook-verano-2.svg",
    alt: "Detalle de textura de cal y tejido a contraluz",
  },
];

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function mediaUrlFrom(value: unknown): string | undefined {
  return asString(asRecord(value)?.mediaUrl);
}

function imageFromPost(item: Record<string, unknown>): string | undefined {
  const sizes = asRecord(item.sizes);
  const fromSizes =
    mediaUrlFrom(sizes?.medium) ??
    mediaUrlFrom(sizes?.large) ??
    mediaUrlFrom(sizes?.small) ??
    mediaUrlFrom(sizes?.full);
  if (fromSizes) {
    return fromSizes;
  }

  const thumbnail = asString(item.thumbnailUrl);
  if (thumbnail) {
    return thumbnail;
  }

  if (asString(item.mediaType)?.toUpperCase() === "VIDEO") {
    return undefined;
  }

  return asString(item.mediaUrl) ?? asString(item.image);
}

export function parseInstagramFeed(raw: unknown): InstagramPost[] {
  const wrapper = asRecord(raw);
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(wrapper?.posts)
      ? (wrapper?.posts as unknown[])
      : Array.isArray(wrapper?.data)
        ? (wrapper?.data as unknown[])
        : [];

  return list.flatMap((entry) => {
    const item = asRecord(entry);
    if (!item) {
      return [];
    }

    const id = asString(item.id);
    const url = asString(item.permalink) ?? asString(item.url);
    const imageUrl = imageFromPost(item);
    if (!id || !url || !imageUrl) {
      return [];
    }

    const caption =
      asString(item.alt) ??
      asString(item.prunedCaption) ??
      asString(item.caption) ??
      "Publicación de Instagram";

    return [{ id, url, imageUrl, alt: caption }];
  });
}

export class EmptyInstagramFeed implements InstagramFeed {
  async getPosts(): Promise<InstagramPost[]> {
    return [];
  }
}

export class PreviewInstagramFeed implements InstagramFeed {
  async getPosts(): Promise<InstagramPost[]> {
    return INSTAGRAM_PREVIEW_POSTS.slice(0, INSTAGRAM_FEED_MAX);
  }
}

export class ConfigInstagramFeed implements InstagramFeed {
  constructor(private readonly feedUrl: string) {}

  async getPosts(): Promise<InstagramPost[]> {
    try {
      const response = await fetch(this.feedUrl, {
        headers: { accept: "application/json" },
        next: { revalidate: INSTAGRAM_FEED_REVALIDATE_SECONDS },
      });
      if (!response.ok) {
        return [];
      }
      const raw: unknown = await response.json();
      return parseInstagramFeed(raw).slice(0, INSTAGRAM_FEED_MAX);
    } catch {
      return [];
    }
  }
}

export function createInstagramFeed(
  feedUrl = process.env.BEHOLD_FEED_URL,
): InstagramFeed {
  const url = feedUrl?.trim();
  if (!url || url === INSTAGRAM_PREVIEW_SENTINEL) {
    if (url === INSTAGRAM_PREVIEW_SENTINEL || process.env.NODE_ENV === "development") {
      return new PreviewInstagramFeed();
    }
    return new EmptyInstagramFeed();
  }
  return new ConfigInstagramFeed(url);
}

export function getInstagramPosts(
  feed: InstagramFeed = createInstagramFeed(),
): Promise<InstagramPost[]> {
  return feed.getPosts();
}
