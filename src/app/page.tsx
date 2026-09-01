import type { Metadata } from "next";

import { AboutExcerpt } from "@/components/home/AboutExcerpt";
import { ContactCta } from "@/components/home/ContactCta";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Hero } from "@/components/home/Hero";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { KitTeaser } from "@/components/home/KitTeaser";
import { Whereabouts } from "@/components/home/Whereabouts";
import { content } from "@/content";
import { getElfsightInstagramId } from "@/lib/elfsight";
import { getInstagramPosts } from "@/lib/instagram";
import { homePageTitle } from "@/lib/metadata";
import { HERO_STILL_ALT, HERO_STILL_SRC, socialShareImages } from "@/lib/og";
import {
  getYoutubeFeed,
  splitYoutubeFeedForHome,
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
      limit: settings.youtubeFeedCount + 1,
    }),
    instagramWidgetId ? Promise.resolve([]) : getInstagramPosts(),
  ]);
  const { latest, rest: processFeed } = splitYoutubeFeedForHome(youtubeFeed);

  return (
    <>
      <Hero
        heroTitle={settings.heroTitle}
        heroSubtitle={settings.heroSubtitle}
        heroYoutubeVideoId={latest?.id ?? settings.heroYoutubeVideoId}
        heroVideoTitle={latest?.title ?? HERO_STILL_ALT}
        heroPosterSrc={latest?.thumbnail ?? HERO_STILL_SRC}
        portrait={settings.portrait}
      />
      <FeaturedWork youtubeUrl={settings.youtubeUrl} youtubeFeed={processFeed} />
      <InstagramGrid
        href={settings.instagramUrl}
        posts={instagramPosts}
        widgetId={instagramWidgetId}
      />
      <AboutExcerpt excerpt={settings.aboutExcerpt} />
      <KitTeaser items={kitTeaser} />
      <Whereabouts text={settings.whereaboutsText} />
      <ContactCta shopUrl={settings.shopUrl} />
    </>
  );
}
