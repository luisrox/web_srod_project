import { FixtureContentRepository } from "./fixture-repository";
import { createContentRepository } from "./factory";
import type { ContentRepository } from "./types";

export type { ContentRepository } from "./types";
export { CONTENT_REVALIDATE_SECONDS } from "./revalidate";

export const content: ContentRepository = createContentRepository();

export { createContentRepository, FixtureContentRepository };
