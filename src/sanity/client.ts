import { createClient } from "next-sanity";

import {
  readConfiguredSanityProjectId,
  SANITY_API_VERSION,
  sanityDataset,
} from "./env";

export type SanityFetcher = {
  fetch: (
    query: string,
    params?: Record<string, unknown>,
  ) => Promise<unknown>;
};

export function createSanityReadClient(): SanityFetcher {
  const projectId = readConfiguredSanityProjectId();
  if (!projectId) {
    throw new Error("Sanity no configurado: falta NEXT_PUBLIC_SANITY_PROJECT_ID.");
  }

  return createClient({
    projectId,
    dataset: sanityDataset,
    apiVersion: SANITY_API_VERSION,
    useCdn: true,
    token: process.env.SANITY_API_READ_TOKEN,
    perspective: "published",
  });
}

export function createSanityWriteClient() {
  const projectId = readConfiguredSanityProjectId();
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token) {
    throw new Error(
      "Seed: hacen falta NEXT_PUBLIC_SANITY_PROJECT_ID y SANITY_API_WRITE_TOKEN.",
    );
  }

  return createClient({
    projectId,
    dataset: sanityDataset,
    apiVersion: SANITY_API_VERSION,
    useCdn: false,
    token,
  });
}
