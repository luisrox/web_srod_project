import type { YoutubeFeedResult } from "@/lib/youtube-feed";

const EMPTY_FEED: YoutubeFeedResult = { ok: false, videos: [] };

let inflight: Promise<YoutubeFeedResult> | undefined;

export function loadHomeYoutubeFeed(): Promise<YoutubeFeedResult> {
  inflight ??= fetch("/api/youtube-feed")
    .then(async (response) => {
      if (!response.ok) {
        return EMPTY_FEED;
      }
      return (await response.json()) as YoutubeFeedResult;
    })
    .catch(() => EMPTY_FEED);

  return inflight;
}
