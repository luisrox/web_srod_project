import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ConfigInstagramFeed,
  createInstagramFeed,
  EmptyInstagramFeed,
  INSTAGRAM_FEED_MAX,
  INSTAGRAM_PREVIEW_POSTS,
  parseInstagramFeed,
  PreviewInstagramFeed,
} from "./instagram";

const beholdJson = {
  posts: [
    {
      id: "ig-1",
      permalink: "https://www.instagram.com/p/aaa/",
      mediaUrl: "https://cdn.example/1.jpg",
      caption: "Look en Casco",
    },
    {
      id: "ig-2",
      permalink: "https://www.instagram.com/p/bbb/",
      thumbnailUrl: "https://cdn.example/2.jpg",
      prunedCaption: "Café",
    },
  ],
};

describe("InstagramFeed", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sin URL usa el adapter empty fuera de development", async () => {
    const feed = createInstagramFeed("");

    expect(feed).toBeInstanceOf(EmptyInstagramFeed);
    await expect(feed.getPosts()).resolves.toEqual([]);
  });

  it("con sentinel preview usa stills del lab, no Unsplash", async () => {
    const feed = createInstagramFeed("preview");

    expect(feed).toBeInstanceOf(PreviewInstagramFeed);
    await expect(feed.getPosts()).resolves.toEqual(
      INSTAGRAM_PREVIEW_POSTS.slice(0, INSTAGRAM_FEED_MAX),
    );
    expect(INSTAGRAM_PREVIEW_POSTS).toHaveLength(6);
    expect(INSTAGRAM_PREVIEW_POSTS.every((post) => post.imageUrl.startsWith("/placeholders/"))).toBe(
      true,
    );
  });

  it("con BEHOLD_FEED_URL usa el adapter config y parsea el JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => beholdJson,
      }),
    );

    const feed = createInstagramFeed("https://feeds.behold.so/demo");

    expect(feed).toBeInstanceOf(ConfigInstagramFeed);
    await expect(feed.getPosts()).resolves.toEqual([
      {
        id: "ig-1",
        url: "https://www.instagram.com/p/aaa/",
        imageUrl: "https://cdn.example/1.jpg",
        alt: "Look en Casco",
      },
      {
        id: "ig-2",
        url: "https://www.instagram.com/p/bbb/",
        imageUrl: "https://cdn.example/2.jpg",
        alt: "Café",
      },
    ]);
  });

  it("si el fetch falla devuelve lista vacía", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      }),
    );

    const failed = new ConfigInstagramFeed("https://feeds.behold.so/demo");
    await expect(failed.getPosts()).resolves.toEqual([]);

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(failed.getPosts()).resolves.toEqual([]);
  });

  it("recorta el feed a INSTAGRAM_FEED_MAX", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () =>
          Array.from({ length: 12 }, (_, index) => ({
            id: `ig-${index}`,
            permalink: `https://www.instagram.com/p/${index}/`,
            mediaUrl: `https://cdn.example/${index}.jpg`,
          })),
      }),
    );

    const feed = new ConfigInstagramFeed("https://feeds.behold.so/demo");
    await expect(feed.getPosts()).resolves.toHaveLength(INSTAGRAM_FEED_MAX);
  });
});

describe("parseInstagramFeed", () => {
  it("acepta array suelto y omite items incompletos", () => {
    const posts = parseInstagramFeed([
      {
        id: "ok",
        url: "https://www.instagram.com/p/ok/",
        image: "https://cdn.example/ok.jpg",
      },
      { id: "roto" },
    ]);

    expect(posts).toEqual([
      {
        id: "ok",
        url: "https://www.instagram.com/p/ok/",
        imageUrl: "https://cdn.example/ok.jpg",
        alt: "Publicación de Instagram",
      },
    ]);
  });

  it("usa sizes de Behold y no mete un video en el <img>", () => {
    const posts = parseInstagramFeed({
      data: [
        {
          id: "vid",
          permalink: "https://www.instagram.com/p/vid/",
          mediaType: "VIDEO",
          mediaUrl: "https://cdn.example/clip.mp4",
          sizes: { medium: { mediaUrl: "https://cdn.example/vid.jpg" } },
          caption: "Reel",
        },
      ],
    });

    expect(posts).toEqual([
      {
        id: "vid",
        url: "https://www.instagram.com/p/vid/",
        imageUrl: "https://cdn.example/vid.jpg",
        alt: "Reel",
      },
    ]);
  });
});
