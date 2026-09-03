"use client";

import Image from "next/image";
import { useState } from "react";
import { z } from "zod";

import { youtubeVideoIdSchema } from "@/domain/schemas";

export const youtubeEmbedPropsSchema = z.strictObject({
  videoId: youtubeVideoIdSchema,
  title: z.string().min(1),
  posterSrc: z.string().min(1),
  posterWidth: z.int().positive().default(480),
  posterHeight: z.int().positive().default(270),
  priority: z.boolean().default(false),
});

export type YouTubeEmbedProps = z.input<typeof youtubeEmbedPropsSchema>;

export function youtubeEmbedSrc(
  videoId: string,
  options: { autoplay: boolean },
) {
  const params = new URLSearchParams({
    modestbranding: "1",
    rel: "0",
  });

  if (options.autoplay) {
    params.set("autoplay", "1");
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function YouTubeEmbed(props: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const parsed = youtubeEmbedPropsSchema.parse(props);

  return (
    <div
      data-ui="youtube-embed"
      className="relative aspect-video overflow-hidden bg-ink"
    >
      {playing ? (
        <iframe
          title={parsed.title}
          src={youtubeEmbedSrc(parsed.videoId, { autoplay: true })}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <Image
            src={parsed.posterSrc}
            alt=""
            fill
            sizes="(min-width: 56rem) 56rem, 100vw"
            priority={parsed.priority}
            className="object-cover"
          />
          <button
            type="button"
            aria-label={`Reproducir ${parsed.title}`}
            className="absolute inset-0 flex items-center justify-center bg-ink/20"
            onClick={() => setPlaying(true)}
          >
            <span className="inline-flex min-h-11 items-center rounded-gallery bg-accent px-4 text-sm font-medium text-accent-ink">
              Reproducir
            </span>
          </button>
        </>
      )}
    </div>
  );
}
