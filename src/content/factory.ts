import { createSanityReadClient } from "@/sanity/client";
import {
  readConfiguredSanityProjectId,
  shouldFallbackToFixtures,
} from "@/sanity/env";
import { SanityContentRepository } from "@/sanity/sanity-repository";

import { FallbackContentRepository } from "./fallback-repository";
import { FixtureContentRepository } from "./fixture-repository";
import type { ContentRepository } from "./types";

export type ContentFactoryOptions = {
  nodeEnv?: string;
  projectId?: string | undefined;
  enableFallback?: boolean;
  fixtureRepo?: ContentRepository;
  sanityRepo?: ContentRepository;
};

export function createContentRepository(
  options: ContentFactoryOptions = {},
): ContentRepository {
  const fixture = options.fixtureRepo ?? new FixtureContentRepository();
  const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV;

  if (nodeEnv === "test") {
    return fixture;
  }

  const configuredId = readConfiguredSanityProjectId(
    "projectId" in options
      ? options.projectId
      : process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  );

  if (!configuredId) {
    return fixture;
  }

  const sanity =
    options.sanityRepo ?? new SanityContentRepository(createSanityReadClient());
  const enableFallback =
    options.enableFallback ?? shouldFallbackToFixtures(nodeEnv);

  if (!enableFallback) {
    return sanity;
  }

  return new FallbackContentRepository(sanity, fixture, true);
}
