"use client";

import { useEffect, useState } from "react";

import {
  YouTubeEmbed,
  YoutubePlaylistEmbed,
} from "@/components/YouTubeEmbed";
import { loadHomeYoutubeFeed } from "@/lib/youtube-feed-client";
import { splitYoutubeFeedForHome } from "@/lib/youtube-feed";

type HomeHeroMediaProps = {
  videoId?: string;
  title: string;
  posterSrc: string;
  playlistId?: string;
};

export function HomeHeroMedia({
  videoId,
  title,
  posterSrc,
  playlistId,
}: HomeHeroMediaProps) {
  const [latest, setLatest] = useState(
    videoId
      ? { id: videoId, title, thumbnail: posterSrc }
      : undefined,
  );

  useEffect(() => {
    if (latest || process.env.VITEST) {
      return;
    }

    let cancelled = false;
    void loadHomeYoutubeFeed().then((feed) => {
      const next = splitYoutubeFeedForHome(feed).latest;
      if (!cancelled && next) {
        setLatest({
          id: next.id,
          title: next.title,
          thumbnail: next.thumbnail,
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [latest]);

  if (latest) {
    return (
      <YouTubeEmbed
        videoId={latest.id}
        title={latest.title}
        posterSrc={latest.thumbnail}
        priority
      />
    );
  }

  if (playlistId) {
    return <YoutubePlaylistEmbed playlistId={playlistId} title={title} />;
  }

  return null;
}
