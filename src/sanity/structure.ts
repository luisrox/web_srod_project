import type { StructureResolver } from "sanity/structure";

import { SITE_SETTINGS_DOCUMENT_ID, SINGLETON_TYPES } from "./singleton";

export const studioStructure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Ajustes del sitio")
        .id(SITE_SETTINGS_DOCUMENT_ID)
        .child(
          S.document()
            .schemaType(SITE_SETTINGS_DOCUMENT_ID)
            .documentId(SITE_SETTINGS_DOCUMENT_ID),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return id ? !SINGLETON_TYPES.has(id) : true;
      }),
    ]);
