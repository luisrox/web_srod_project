export type YoutubeVideo = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
  description: string;
};

export type YoutubeFeedResult =
  | { ok: true; videos: YoutubeVideo[] }
  | { ok: false; videos: [] };

export const YOUTUBE_FEED_REVALIDATE_SECONDS = 3600;
export const YOUTUBE_CHANNEL_ID_PATTERN = /^UC[A-Za-z0-9_-]{22}$/;

/** RSS trae `hqdefault` (480px). El hero necesita el frame 16:9 nítido. */
export function youtubePosterUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

const YOUTUBE_RSS_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function channelIdFrom(options: {
  channelId?: string;
  youtubeUrl: string;
}): string | undefined {
  const fromField = options.channelId?.trim();
  if (fromField && YOUTUBE_CHANNEL_ID_PATTERN.test(fromField)) {
    return fromField;
  }
  return options.youtubeUrl.match(
    /youtube\.com\/channel\/(UC[A-Za-z0-9_-]{22})/i,
  )?.[1];
}

/** Videos largos del canal (`UC…` → `UULF…`), sin Shorts. */
export function youtubeLongFormPlaylistId(channelId?: string): string | null {
  const id = channelId?.trim();
  if (!id || !YOUTUBE_CHANNEL_ID_PATTERN.test(id)) {
    return null;
  }
  return `UULF${id.slice(2)}`;
}

export function youtubePlaylistEmbedSrc(playlistId: string): string {
  const params = new URLSearchParams({
    list: playlistId,
    modestbranding: "1",
    rel: "0",
  });
  return `https://www.youtube-nocookie.com/embed/videoseries?${params.toString()}`;
}

/** El más reciente en horizontal va al hero; Shorts y el resto, a Trabajo destacado. */
export function isYoutubeShort(video: YoutubeVideo): boolean {
  return /\/shorts\//i.test(video.url);
}

export function splitYoutubeFeedForHome(feed: YoutubeFeedResult): {
  latest: YoutubeVideo | undefined;
  rest: YoutubeFeedResult;
} {
  if (!feed.ok) {
    return { latest: undefined, rest: feed };
  }

  const latestIndex = feed.videos.findIndex((video) => !isYoutubeShort(video));
  if (latestIndex < 0) {
    return { latest: undefined, rest: { ok: true, videos: feed.videos } };
  }

  const latest = feed.videos[latestIndex];
  const rest = feed.videos.filter((_, index) => index !== latestIndex);
  return { latest, rest: { ok: true, videos: rest } };
}

function decodeXml(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();
}

function matchGroup(source: string, pattern: RegExp): string | undefined {
  const match = source.match(pattern);
  const value = match?.[1];
  return value ? decodeXml(value) : undefined;
}

export function youtubeRssCandidates(options: {
  channelId?: string;
  youtubeUrl: string;
}): string[] {
  const urls: string[] = [];
  const channelId = channelIdFrom(options);
  const longForm = youtubeLongFormPlaylistId(channelId);
  if (longForm) {
    urls.push(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${longForm}`,
    );
  }
  if (channelId) {
    urls.push(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    );
  }

  const user = options.youtubeUrl.match(
    /youtube\.com\/user\/([^/?#]+)/i,
  )?.[1];
  if (user) {
    urls.push(
      `https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(user)}`,
    );
  }

  return urls;
}

export function youtubeRssUrl(options: {
  channelId?: string;
  youtubeUrl: string;
}): string | null {
  return youtubeRssCandidates(options)[0] ?? null;
}

export function parseYoutubeRss(xml: string): YoutubeVideo[] {
  const entries = xml.match(/<entry\b[\s\S]*?<\/entry>/gi) ?? [];

  return entries.flatMap((entry) => {
    const id =
      matchGroup(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/i) ??
      matchGroup(entry, /[?&]v=([A-Za-z0-9_-]{11})/);
    if (!id) {
      return [];
    }

    const title =
      matchGroup(entry, /<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i) ?? id;
    const publishedAt =
      matchGroup(entry, /<published>([^<]+)<\/published>/i) ?? "";
    const url =
      matchGroup(entry, /<link[^>]*href="([^"]+)"/i) ??
      `https://www.youtube.com/watch?v=${id}`;
    const thumbnail = youtubePosterUrl(id);
    const description =
      matchGroup(
        entry,
        /<media:description(?:\s[^>]*)?>([\s\S]*?)<\/media:description>/i,
      ) ?? "";

    return [{ id, title, thumbnail, url, publishedAt, description }];
  });
}

const INNERTUBE_BROWSE = "https://www.youtube.com/youtubei/v1/browse?prettyPrint=false";
/** Pestaña Videos del canal (sin Shorts). */
const INNERTUBE_VIDEOS_TAB = "EgZ2aWRlb3PyBgQKAjoA";

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function lockupTitle(lockup: Record<string, unknown>): string {
  const metadata = asRecord(lockup.metadata);
  const view = asRecord(metadata?.lockupMetadataViewModel);
  const title = asRecord(view?.title);
  return typeof title?.content === "string" ? title.content : "";
}

function videoFromLockup(lockup: Record<string, unknown>): YoutubeVideo | null {
  if (
    lockup.contentType &&
    lockup.contentType !== "LOCKUP_CONTENT_TYPE_VIDEO"
  ) {
    return null;
  }

  const id = typeof lockup.contentId === "string" ? lockup.contentId : "";
  if (!/^[A-Za-z0-9_-]{11}$/.test(id)) {
    return null;
  }

  return {
    id,
    title: lockupTitle(lockup) || id,
    thumbnail: youtubePosterUrl(id),
    url: `https://www.youtube.com/watch?v=${id}`,
    publishedAt: "",
    description: "",
  };
}

export function parseInnertubeBrowse(payload: unknown): YoutubeVideo[] {
  const videos: YoutubeVideo[] = [];

  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") {
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) {
        visit(item);
      }
      return;
    }

    const record = node as Record<string, unknown>;
    const lockup = asRecord(record.lockupViewModel);
    if (lockup) {
      const video = videoFromLockup(lockup);
      if (video && !videos.some((item) => item.id === video.id)) {
        videos.push(video);
      }
      return;
    }

    for (const value of Object.values(record)) {
      visit(value);
    }
  };

  visit(payload);
  return videos;
}

async function fetchInnertubeVideos(
  channelId: string,
): Promise<YoutubeVideo[] | null> {
  try {
    const response = await fetch(INNERTUBE_BROWSE, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": YOUTUBE_RSS_UA,
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB",
            clientVersion: "2.20240901.01.00",
            hl: "es",
            gl: "US",
          },
        },
        browseId: channelId,
        params: INNERTUBE_VIDEOS_TAB,
      }),
      next: { revalidate: YOUTUBE_FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.warn("[youtube-feed] innertube no OK", response.status);
      return null;
    }

    return parseInnertubeBrowse(await response.json());
  } catch (error) {
    console.warn("[youtube-feed] innertube falló", error);
    return null;
  }
}

async function fetchYoutubeRss(rss: string): Promise<YoutubeVideo[] | null> {
  try {
    const response = await fetch(rss, {
      headers: {
        accept: "application/atom+xml, application/xml, text/xml",
        "user-agent": YOUTUBE_RSS_UA,
      },
      next: { revalidate: YOUTUBE_FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.warn("[youtube-feed] RSS no OK", response.status, rss);
      return null;
    }

    return parseYoutubeRss(await response.text());
  } catch (error) {
    console.warn("[youtube-feed] RSS falló", rss, error);
    return null;
  }
}

export async function getYoutubeFeed(options: {
  channelId?: string;
  youtubeUrl: string;
  limit: number;
}): Promise<YoutubeFeedResult> {
  const candidates = youtubeRssCandidates(options);
  if (candidates.length === 0) {
    return { ok: false, videos: [] };
  }

  for (const rss of candidates) {
    const parsed = await fetchYoutubeRss(rss);
    if (parsed && parsed.length > 0) {
      return {
        ok: true,
        videos: parsed.slice(0, Math.max(0, options.limit)),
      };
    }
  }

  const channelId = channelIdFrom(options);
  if (channelId) {
    const innertube = await fetchInnertubeVideos(channelId);
    if (innertube && innertube.length > 0) {
      return {
        ok: true,
        videos: innertube.slice(0, Math.max(0, options.limit)),
      };
    }
  }

  return { ok: false, videos: [] };
}
