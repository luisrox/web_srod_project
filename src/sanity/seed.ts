import {
  kitItemFixtures,
  projectFixtures,
  siteSettingsFixture,
} from "@/content/fixtures";

import { SITE_SETTINGS_DOCUMENT_ID } from "./singleton";

export function buildSeedDocuments() {
  return {
    siteSettings: {
      _id: SITE_SETTINGS_DOCUMENT_ID,
      _type: "siteSettings" as const,
      ...siteSettingsFixture,
    },
    projects: projectFixtures.map((project) => ({
      _id: `project.${project.slug}`,
      _type: "project" as const,
      ...project,
    })),
    kitItems: kitItemFixtures.map((item) => ({
      _id: `kitItem.${item.id}`,
      _type: "kitItem" as const,
      ...item,
    })),
  };
}

export async function runSeed(client: {
  createOrReplace: (doc: object) => Promise<unknown>;
}): Promise<number> {
  if (process.env.NODE_ENV === "test") {
    throw new Error("El seed no corre en test.");
  }

  const docs = buildSeedDocuments();
  const payload = [docs.siteSettings, ...docs.projects, ...docs.kitItems];

  for (const doc of payload) {
    await client.createOrReplace(doc);
  }

  return payload.length;
}

async function main() {
  const { createSanityWriteClient } = await import("./client");
  const client = createSanityWriteClient();
  const count = await runSeed({
    createOrReplace: (doc) =>
      client.createOrReplace(doc as { _id: string; _type: string }),
  });
  console.info(`[seed] upsert de ${count} documentos placeholder`);
}

const invoked = process.argv[1]?.replace(/\\/g, "/").includes("sanity/seed.ts");
if (invoked) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
