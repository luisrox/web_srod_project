export const ELFSIGHT_PLATFORM_SRC =
  "https://apps.elfsight.com/p/platform.js";

/** Widget público InstaShow de @srodalmenara en www.srodalmenara.com. */
export const DEFAULT_ELFSIGHT_INSTAGRAM_ID =
  "bd55f1a6-c98d-45e7-8afa-a6d871510258";

/**
 * ID del widget Elfsight Instagram. Vacío usa el de Srod.
 * `off` desactiva el widget y cae al grid Behold / embed.
 */
export function getElfsightInstagramId(
  fromEnv = process.env.NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID,
): string | undefined {
  const value = fromEnv?.trim();
  if (!value) {
    return DEFAULT_ELFSIGHT_INSTAGRAM_ID;
  }
  if (value.toLowerCase() === "off") {
    return undefined;
  }
  return value;
}

export function elfsightAppClass(widgetId: string): string {
  return `elfsight-app-${widgetId}`;
}
