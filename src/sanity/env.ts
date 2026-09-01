export const SANITY_API_VERSION = "2025-08-01";

export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Studio: placeholder si falta env para que CI compile `/studio`. */
export const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";

export function readConfiguredSanityProjectId(
  projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
): string | undefined {
  if (!projectId || projectId === "placeholder") {
    return undefined;
  }
  return projectId;
}

export function shouldFallbackToFixtures(
  nodeEnv: string | undefined = process.env.NODE_ENV,
  flag: string | undefined = process.env.ENABLE_FIXTURE_FALLBACK,
): boolean {
  if (flag === "true") {
    return true;
  }
  if (flag === "false") {
    return false;
  }
  return nodeEnv === "development";
}
