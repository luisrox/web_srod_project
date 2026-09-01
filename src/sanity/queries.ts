import { SITE_SETTINGS_DOCUMENT_ID } from "./singleton";

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings" && _id == "${SITE_SETTINGS_DOCUMENT_ID}"][0]`;

export const PROJECTS_QUERY = `*[_type == "project"] | order(order asc)`;

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug == $slug][0]`;

export const KIT_ITEMS_QUERY = `*[_type == "kitItem"] | order(order asc)`;
