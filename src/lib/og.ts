import type { Metadata } from "next";

import { absoluteUrl } from "./site-url";

export const OG_LOCALE = "es";

export const HERO_STILL_SRC = "/placeholders/lookbook-verano-1.svg";
export const HERO_STILL_ALT = "Reel de dirección de fotografía";

export function ogImageHref(images: Metadata["openGraph"] | undefined): string {
  const raw = images?.images;
  let first: unknown = Array.isArray(raw) ? raw[0] : raw;
  if (Array.isArray(first)) {
    first = first[0];
  }
  if (!first) {
    return "";
  }
  if (typeof first === "string") {
    return first;
  }
  if (first instanceof URL) {
    return first.href;
  }
  if (typeof first === "object" && "url" in first) {
    const url = (first as { url: string | URL }).url;
    return typeof url === "string" ? url : url.href;
  }
  return "";
}

export function socialShareImages(
  path: string,
  alt: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  const url = absoluteUrl(path);

  return {
    openGraph: {
      locale: OG_LOCALE,
      images: [{ url, alt }],
    },
    twitter: {
      card: "summary_large_image",
      images: [{ url, alt }],
    },
  };
}
