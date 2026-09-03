import { YoutubeWindow } from "@/components/home/YoutubeWindow";
import { Section } from "@/components/Section";
import type { YoutubeFeedResult } from "@/lib/youtube-feed";

type FeaturedWorkProps = {
  youtubeUrl: string;
  youtubeFeed: YoutubeFeedResult;
  limit?: number;
};

export function FeaturedWork({
  youtubeUrl,
  youtubeFeed,
  limit,
}: FeaturedWorkProps) {
  return (
    <Section
      title="Trabajo destacado"
      intro="Videos recientes del canal."
      ui="featured-work"
      className="mx-auto max-w-6xl px-6 py-section-sm"
    >
      <YoutubeWindow href={youtubeUrl} feed={youtubeFeed} limit={limit} />
    </Section>
  );
}
