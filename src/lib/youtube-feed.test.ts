import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getYoutubeFeed,
  parseInnertubeBrowse,
  parseYoutubeRss,
  splitYoutubeFeedForHome,
  youtubeLongFormPlaylistId,
  youtubePlaylistEmbedSrc,
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
      <media:description>Look de verano en Casco Viejo.</media:description>
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

describe("parseInnertubeBrowse", () => {
  it("extrae videos del lockup y ignora Shorts", () => {
    const videos = parseInnertubeBrowse({
      contents: [
        {
          lockupViewModel: {
            contentId: "SWFDM_ZuiFk",
            contentType: "LOCKUP_CONTENT_TYPE_VIDEO",
            metadata: {
              lockupMetadataViewModel: {
                title: { content: "Sony quiere COMPRAR Tamron" },
              },
            },
          },
        },
        {
          lockupViewModel: {
            contentId: "shortShort1",
            contentType: "LOCKUP_CONTENT_TYPE_SHORT",
            metadata: {
              lockupMetadataViewModel: {
                title: { content: "Clip" },
              },
            },
          },
        },
      ],
    });

    expect(videos).toEqual([
      {
        id: "SWFDM_ZuiFk",
        title: "Sony quiere COMPRAR Tamron",
        thumbnail: "https://i.ytimg.com/vi/SWFDM_ZuiFk/maxresdefault.jpg",
        url: "https://www.youtube.com/watch?v=SWFDM_ZuiFk",
        publishedAt: "",
        description: "",
      },
    ]);
  });
});

describe("parseYoutubeRss", () => {
  it("extrae id, título, thumbnail, url, publishedAt y description de 3 entries", () => {
    const videos = parseYoutubeRss(RSS_THREE);

    expect(videos).toHaveLength(3);
    expect(videos[0]).toEqual({
      id: "aaaaaaaaaaa",
      title: "Look en Casco",
      thumbnail: "https://i.ytimg.com/vi/aaaaaaaaaaa/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=aaaaaaaaaaa",
      publishedAt: "2026-01-01T12:00:00+00:00",
      description: "Look de verano en Casco Viejo.",
    });
    expect(videos[1]?.description).toBe("");
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
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("playlist_id=UULF"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "user-agent": expect.stringContaining("Chrome"),
        }),
      }),
    );
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

  it("si el RSS falla usa el listado Videos de YouTube", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async (url: string, init?: { method?: string }) => {
        if (init?.method === "POST" || String(url).includes("youtubei/v1/browse")) {
          return {
            ok: true,
            json: async () => ({
              contents: {
                lockupViewModel: {
                  contentId: "SWFDM_ZuiFk",
                  contentType: "LOCKUP_CONTENT_TYPE_VIDEO",
                  metadata: {
                    lockupMetadataViewModel: {
                      title: { content: "Sony quiere COMPRAR Tamron" },
                    },
                  },
                },
              },
            }),
          };
        }
        return { ok: false, status: 404, text: async () => "nope" };
      }),
    );

    const feed = await getYoutubeFeed({
      channelId: "UC0JZGMS9SBmv3fPVSqZh4zQ",
      youtubeUrl: "https://www.youtube.com/c/srodmode",
      limit: 6,
    });

    expect(feed.ok).toBe(true);
    expect(feed.videos[0]).toMatchObject({
      id: "SWFDM_ZuiFk",
      title: "Sony quiere COMPRAR Tamron",
      url: "https://www.youtube.com/watch?v=SWFDM_ZuiFk",
    });
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
      "https://www.youtube.com/feeds/videos.xml?playlist_id=UULF0JZGMS9SBmv3fPVSqZh4zQ",
    );
    expect(
      youtubeRssUrl({
        youtubeUrl: "https://www.youtube.com/channel/UC0JZGMS9SBmv3fPVSqZh4zQ",
      }),
    ).toContain("playlist_id=UULF0JZGMS9SBmv3fPVSqZh4zQ");
    expect(
      youtubeRssUrl({ youtubeUrl: "https://www.youtube.com/c/srodmode" }),
    ).toBeNull();
  });
});

describe("youtubeLongFormPlaylistId", () => {
  it("convierte UC… en UULF… para videos sin Shorts", () => {
    expect(youtubeLongFormPlaylistId("UC0JZGMS9SBmv3fPVSqZh4zQ")).toBe(
      "UULF0JZGMS9SBmv3fPVSqZh4zQ",
    );
    expect(youtubeLongFormPlaylistId("nope")).toBeNull();
    expect(
      youtubePlaylistEmbedSrc("UULF0JZGMS9SBmv3fPVSqZh4zQ"),
    ).toContain("list=UULF0JZGMS9SBmv3fPVSqZh4zQ");
  });
});

describe("splitYoutubeFeedForHome", () => {
  it("separa el último video para el hero y deja el resto en Trabajo destacado", () => {
    const videos = parseYoutubeRss(RSS_THREE);
    const { latest, rest } = splitYoutubeFeedForHome({
      ok: true,
      videos,
    });

    expect(latest?.id).toBe("aaaaaaaaaaa");
    expect(rest).toEqual({
      ok: true,
      videos: videos.slice(1),
    });
  });

  it("salta Shorts y pone en el hero el último video horizontal", () => {
    const short = {
      ...parseYoutubeRss(RSS_THREE)[0]!,
      id: "shortShort1",
      url: "https://www.youtube.com/shorts/shortShort1",
    };
    const videos = [short, ...parseYoutubeRss(RSS_THREE)];
    const { latest, rest } = splitYoutubeFeedForHome({
      ok: true,
      videos,
    });

    expect(latest?.id).toBe("aaaaaaaaaaa");
    expect(rest.ok).toBe(true);
    expect(rest.videos.map((video) => video.id)).toEqual([
      "shortShort1",
      "bbbbbbbbbbb",
      "ccccccccccc",
    ]);
  });

  it("si solo hay Shorts no los pone en el hero", () => {
    const { latest, rest } = splitYoutubeFeedForHome({
      ok: true,
      videos: [
        {
          id: "shortShort1",
          title: "Clip",
          thumbnail: "https://i.ytimg.com/vi/shortShort1/maxresdefault.jpg",
          url: "https://www.youtube.com/shorts/shortShort1",
          publishedAt: "",
          description: "",
        },
      ],
    });

    expect(latest).toBeUndefined();
    expect(rest.ok).toBe(true);
    expect(rest.videos).toHaveLength(1);
  });

  it("si el feed falla no inventa un destacado", () => {
    expect(splitYoutubeFeedForHome({ ok: false, videos: [] })).toEqual({
      latest: undefined,
      rest: { ok: false, videos: [] },
    });
  });
});
