import Image from "next/image";

import { ABOUT_PORTRAIT_ALT } from "@/components/about/AboutBio";
import { GalleryBox } from "@/components/GalleryBox";
import { HeroParallax } from "@/components/home/HeroParallax";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { SITE_NAME } from "@/lib/site";

type HeroProps = {
  heroTitle: string;
  heroSubtitle: string;
  heroYoutubeVideoId: string;
  heroVideoTitle: string;
  heroPosterSrc: string;
  portrait: string;
};

export function Hero({
  heroTitle,
  heroSubtitle,
  heroYoutubeVideoId,
  heroVideoTitle,
  heroPosterSrc,
  portrait,
}: HeroProps) {
  return (
    <section data-ui="hero" className="mx-auto max-w-4xl px-6 py-section">
      <GalleryBox className="overflow-hidden">
        <div className="px-8 pt-section-sm sm:px-12">
          <div className="flex items-center gap-4 sm:gap-5">
            <Image
              src={portrait}
              alt={ABOUT_PORTRAIT_ALT}
              width={96}
              height={96}
              className="size-16 shrink-0 rounded-full object-cover sm:size-20"
            />
            <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
              {SITE_NAME}
            </h1>
          </div>
          <p className="mt-6 font-display text-xl font-medium tracking-tight sm:text-2xl">
            {heroTitle}
          </p>
          <p className="mt-3 max-w-prose text-muted">{heroSubtitle}</p>
        </div>
        <div className="mt-8">
          <HeroParallax>
            <YouTubeEmbed
              videoId={heroYoutubeVideoId}
              title={heroVideoTitle}
              posterSrc={heroPosterSrc}
              posterWidth={1600}
              posterHeight={900}
            />
          </HeroParallax>
        </div>
      </GalleryBox>
    </section>
  );
}
