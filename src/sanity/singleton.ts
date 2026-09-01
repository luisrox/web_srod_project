/** Un solo documento de ajustes; el Structure lo abre por este id fijo. */
export const SITE_SETTINGS_DOCUMENT_ID = "siteSettings";

export const SINGLETON_TYPES = new Set([SITE_SETTINGS_DOCUMENT_ID]);

const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

export function isSingletonType(schemaType: string): boolean {
  return SINGLETON_TYPES.has(schemaType);
}

export function withoutSingletonTemplates<T extends { schemaType: string }>(
  templates: T[],
): T[] {
  return templates.filter((item) => !SINGLETON_TYPES.has(item.schemaType));
}

export function singletonDocumentActions<T extends { action?: string }>(
  actions: T[],
  schemaType: string,
): T[] {
  if (!SINGLETON_TYPES.has(schemaType)) {
    return actions;
  }
  return actions.filter(
    (item) => item.action && SINGLETON_ACTIONS.has(item.action),
  );
}
