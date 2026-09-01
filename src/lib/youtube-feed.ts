export type YoutubeVideo = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
};

export type YoutubeFeedResult =
  | { ok: true; videos: YoutubeVideo[] }
  | { ok: false; videos: [] };

export const YOUTUBE_FEED_REVALIDATE_SECONDS = 3600;
export const YOUTUBE_CHANNEL_ID_PATTERN = /^UC[A-Za-z0-9_-]{22}$/;

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

export function youtubeRssUrl(options: {
  channelId?: string;
  youtubeUrl: string;
}): string | null {
  const fromField = options.channelId?.trim();
  if (fromField && YOUTUBE_CHANNEL_ID_PATTERN.test(fromField)) {
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${fromField}`;
  }

  const channelFromUrl = options.youtubeUrl.match(
    /youtube\.com\/channel\/(UC[A-Za-z0-9_-]{22})/i,
  )?.[1];
  if (channelFromUrl) {
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelFromUrl}`;
  }

  const user = options.youtubeUrl.match(
    /youtube\.com\/user\/([^/?#]+)/i,
  )?.[1];
  if (user) {
    return `https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(user)}`;
  }

  return null;
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
    const thumbnail =
      matchGroup(entry, /<media:thumbnail[^>]*url="([^"]+)"/i) ??
      `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    return [{ id, title, thumbnail, url, publishedAt }];
  });
}

export async function getYoutubeFeed(options: {
  channelId?: string;
  youtubeUrl: string;
  limit: number;
}): Promise<YoutubeFeedResult> {
  const rss = youtubeRssUrl(options);
  if (!rss) {
    return { ok: false, videos: [] };
  }

  try {
    const response = await fetch(rss, {
      headers: {
        accept: "application/atom+xml, application/xml, text/xml",
      },
      next: { revalidate: YOUTUBE_FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return { ok: false, videos: [] };
    }

    const xml = await response.text();
    const videos = parseYoutubeRss(xml).slice(0, Math.max(0, options.limit));
    return { ok: true, videos };
  } catch {
    return { ok: false, videos: [] };
  }
}
