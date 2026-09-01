export const DEFAULT_SITE_URL = "https://www.srodalmenara.com";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function asHttpsOrigin(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_SITE_URL;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return stripTrailingSlash(trimmed);
  }
  return `https://${stripTrailingSlash(trimmed)}`;
}

/**
 * Base absoluta para metadata, OG y sitemap.
 * Orden: NEXT_PUBLIC_SITE_URL → preview Vercel → dominio de lanzamiento.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return asHttpsOrigin(explicit);
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return asHttpsOrigin(vercel);
  }

  return DEFAULT_SITE_URL;
}

export function absoluteUrl(path: string, base = getSiteUrl()): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, `${base}/`).href;
}
