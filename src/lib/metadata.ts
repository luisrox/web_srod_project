import { SITE_NAME } from "./site";

const SEPARATOR = "—";

/** Titles de rutas internas. Home usa `homePageTitle`, no este helper. */
export function pageTitle(segment: string): string {
  return `${segment} ${SEPARATOR} ${SITE_NAME}`;
}

/** Title de `/`: wordmark + titular CMS, distinto al patrón de las demás rutas. */
export function homePageTitle(heroTitle: string): string {
  return `${SITE_NAME} ${SEPARATOR} ${heroTitle}`;
}
