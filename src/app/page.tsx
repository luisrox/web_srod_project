import type { Metadata } from "next";

import { AboutExcerpt } from "@/components/home/AboutExcerpt";
import { ContactCta } from "@/components/home/ContactCta";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Hero } from "@/components/home/Hero";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { KitTeaser } from "@/components/home/KitTeaser";
import { Whereabouts } from "@/components/home/Whereabouts";
import { YoutubeWindow } from "@/components/home/YoutubeWindow";
import { content } from "@/content";
import { getInstagramPosts } from "@/lib/instagram";
import { homePageTitle } from "@/lib/metadata";
import { HERO_STILL_ALT, HERO_STILL_SRC, socialShareImages } from "@/lib/og";
import { getYoutubeFeed } from "@/lib/youtube-feed";

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
  const [featuredProjects, kitTeaser, youtubeFeed, instagramPosts] =
    await Promise.all([
      content.getFeaturedProjects(),
      content.getKitTeaser(),
      getYoutubeFeed({
        channelId: settings.youtubeChannelId,
        youtubeUrl: settings.youtubeUrl,
        limit: settings.youtubeFeedCount,
      }),
      getInstagramPosts(),
    ]);

  return (
    <>
      <Hero
        heroTitle={settings.heroTitle}
        heroSubtitle={settings.heroSubtitle}
        heroYoutubeVideoId={settings.heroYoutubeVideoId}
      />
      <AboutExcerpt excerpt={settings.aboutExcerpt} />
      <FeaturedWork projects={featuredProjects} />
      <InstagramGrid href={settings.instagramUrl} posts={instagramPosts} />
      <YoutubeWindow href={settings.youtubeUrl} feed={youtubeFeed} />
      <KitTeaser items={kitTeaser} />
      <Whereabouts text={settings.whereaboutsText} />
      <ContactCta shopUrl={settings.shopUrl} />
    </>
  );
}
