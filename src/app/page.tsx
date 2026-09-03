import type { Metadata } from "next";

import { ContactCta } from "@/components/home/ContactCta";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Hero } from "@/components/home/Hero";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { KitTeaser } from "@/components/home/KitTeaser";
import { Reveal } from "@/components/home/Reveal";
import { Whereabouts } from "@/components/home/Whereabouts";
import { content } from "@/content";
import { getElfsightInstagramId } from "@/lib/elfsight";
import { getInstagramPosts } from "@/lib/instagram";
import { homePageTitle } from "@/lib/metadata";
import { HERO_STILL_ALT, HERO_STILL_SRC, socialShareImages } from "@/lib/og";
import {
  getYoutubeFeed,
  isYoutubeShort,
  splitYoutubeFeedForHome,
  youtubeLongFormPlaylistId,
} from "@/lib/youtube-feed";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await content.getSiteSettings();

  return {
    title: homePageTitle(settings.heroTitle),
    description: settings.heroSubtitle,
    ...socialShareImages(HERO_STILL_SRC, HERO_STILL_ALT),
  };
}

export default async function Home() {
  const settings = await content.getSiteSettings();
  const instagramWidgetId = getElfsightInstagramId();
  const [kitTeaser, youtubeFeed, instagramPosts] = await Promise.all([
    content.getKitTeaser(),
    getYoutubeFeed({
      channelId: settings.youtubeChannelId,
      youtubeUrl: settings.youtubeUrl,
      limit: settings.youtubeFeedCount + 8,
    }),
    instagramWidgetId ? Promise.resolve([]) : getInstagramPosts(),
  ]);
  const { latest, rest } = splitYoutubeFeedForHome(youtubeFeed);
  const processFeed = rest.ok
    ? {
        ok: true as const,
        videos: rest.videos
          .filter((video) => !isYoutubeShort(video))
          .slice(0, settings.youtubeFeedCount),
      }
    : rest;
  const longFormPlaylistId = youtubeLongFormPlaylistId(
    settings.youtubeChannelId,
  );

  return (
    <>
      <Hero
        heroTitle={settings.heroTitle}
        heroSubtitle={settings.heroSubtitle}
        heroYoutubeVideoId={latest?.id}
        heroVideoTitle={latest?.title ?? HERO_STILL_ALT}
        heroPosterSrc={latest?.thumbnail ?? HERO_STILL_SRC}
        heroPlaylistId={longFormPlaylistId ?? undefined}
        portrait={settings.portrait}
      />
      <Reveal>
        <FeaturedWork
          youtubeUrl={settings.youtubeUrl}
          youtubeFeed={processFeed}
          limit={settings.youtubeFeedCount}
        />
      </Reveal>
      <Reveal>
        <InstagramGrid
          href={settings.instagramUrl}
          posts={instagramPosts}
          widgetId={instagramWidgetId}
        />
      </Reveal>
      <Reveal>
        <KitTeaser items={kitTeaser} />
      </Reveal>
      <Reveal>
        <Whereabouts text={settings.whereaboutsText} />
      </Reveal>
      <Reveal>
        <ContactCta shopUrl={settings.shopUrl} />
      </Reveal>
    </>
  );
}
