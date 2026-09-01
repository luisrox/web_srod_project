import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getYoutubeFeed,
  parseYoutubeRss,
  youtubeRssUrl,
} from "./youtube-feed";

const RSS_THREE = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015"
      xmlns:media="http://search.yahoo.com/mrss/"
      xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <yt:videoId>aaaaaaaaaaa</yt:videoId>
    <title>Look en Casco</title>
    <published>2026-01-01T12:00:00+00:00</published>
    <link rel="alternate" href="https://www.youtube.com/watch?v=aaaaaaaaaaa"/>
    <media:group>
      <media:thumbnail url="https://i.ytimg.com/vi/aaaaaaaaaaa/hqdefault.jpg"/>
    </media:group>
  </entry>
  <entry>
    <yt:videoId>bbbbbbbbbbb</yt:videoId>
    <title>Café en Boquete</title>
    <published>2026-02-01T12:00:00+00:00</published>
    <link rel="alternate" href="https://www.youtube.com/watch?v=bbbbbbbbbbb"/>
    <media:group>
      <media:thumbnail url="https://i.ytimg.com/vi/bbbbbbbbbbb/hqdefault.jpg"/>
    </media:group>
  </entry>
  <entry>
    <yt:videoId>ccccccccccc</yt:videoId>
    <title>Reloj nocturno</title>
    <published>2026-03-01T12:00:00+00:00</published>
    <link rel="alternate" href="https://www.youtube.com/watch?v=ccccccccccc"/>
    <media:group>
      <media:thumbnail url="https://i.ytimg.com/vi/ccccccccccc/hqdefault.jpg"/>
    </media:group>
  </entry>
</feed>`;

describe("parseYoutubeRss", () => {
  it("extrae id, título, thumbnail, url y publishedAt de 3 entries", () => {
    const videos = parseYoutubeRss(RSS_THREE);

    expect(videos).toHaveLength(3);
    expect(videos[0]).toEqual({
      id: "aaaaaaaaaaa",
      title: "Look en Casco",
      thumbnail: "https://i.ytimg.com/vi/aaaaaaaaaaa/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=aaaaaaaaaaa",
      publishedAt: "2026-01-01T12:00:00+00:00",
    });
    expect(videos[2]?.id).toBe("ccccccccccc");
  });
});

describe("getYoutubeFeed", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("limita a N aunque el RSS traiga más", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => RSS_THREE,
      }),
    );

    const feed = await getYoutubeFeed({
      channelId: "UC0JZGMS9SBmv3fPVSqZh4zQ",
      youtubeUrl: "https://www.youtube.com/c/srodmode",
      limit: 2,
    });

    expect(feed.ok).toBe(true);
    expect(feed.videos).toHaveLength(2);
    expect(feed.videos.map((video) => video.id)).toEqual([
      "aaaaaaaaaaa",
      "bbbbbbbbbbb",
    ]);
  });

  it("si el fetch es 500 o lanza, devuelve ok:false y lista vacía", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => "nope",
      }),
    );

    const failed = await getYoutubeFeed({
      channelId: "UC0JZGMS9SBmv3fPVSqZh4zQ",
      youtubeUrl: "https://www.youtube.com/c/srodmode",
      limit: 6,
    });

    expect(failed).toEqual({ ok: false, videos: [] });

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const threw = await getYoutubeFeed({
      channelId: "UC0JZGMS9SBmv3fPVSqZh4zQ",
      youtubeUrl: "https://www.youtube.com/c/srodmode",
      limit: 6,
    });

    expect(threw).toEqual({ ok: false, videos: [] });
  });
});

describe("youtubeRssUrl", () => {
  it("usa youtubeChannelId o /channel/UC…, no un id mágico", () => {
    expect(
      youtubeRssUrl({
        channelId: "UC0JZGMS9SBmv3fPVSqZh4zQ",
        youtubeUrl: "https://www.youtube.com/c/srodmode",
      }),
    ).toBe(
      "https://www.youtube.com/feeds/videos.xml?channel_id=UC0JZGMS9SBmv3fPVSqZh4zQ",
    );
    expect(
      youtubeRssUrl({
        youtubeUrl: "https://www.youtube.com/channel/UC0JZGMS9SBmv3fPVSqZh4zQ",
      }),
    ).toContain("channel_id=UC0JZGMS9SBmv3fPVSqZh4zQ");
    expect(
      youtubeRssUrl({ youtubeUrl: "https://www.youtube.com/c/srodmode" }),
    ).toBeNull();
  });
});
