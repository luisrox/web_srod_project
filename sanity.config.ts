"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { sanityDataset, sanityProjectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemas";
import {
  singletonDocumentActions,
  withoutSingletonTemplates,
} from "./src/sanity/singleton";
import { studioStructure } from "./src/sanity/structure";

export default defineConfig({
  name: "srod-almenara-lab",
  title: "Srod Almenara",
  projectId: sanityProjectId,
  dataset: sanityDataset,
  basePath: "/studio",
  plugins: [structureTool({ structure: studioStructure })],
  schema: {
    types: schemaTypes,
    templates: (templates) => withoutSingletonTemplates(templates),
  },
  document: {
    actions: (actions, context) =>
      singletonDocumentActions(actions, context.schemaType),
  },
});
