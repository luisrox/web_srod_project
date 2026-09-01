import { GalleryBox } from "@/components/GalleryBox";
import { HeroParallax } from "@/components/home/HeroParallax";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { HERO_STILL_SRC } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

type HeroProps = {
  heroTitle: string;
  heroSubtitle: string;
  heroYoutubeVideoId: string;
};

export function Hero({
  heroTitle,
  heroSubtitle,
  heroYoutubeVideoId,
}: HeroProps) {
  return (
    <section data-ui="hero" className="mx-auto max-w-4xl px-6 py-section">
      <GalleryBox className="overflow-hidden">
        <div className="px-8 pt-section-sm sm:px-12">
          <p className="text-sm font-medium tracking-[0.2em] text-muted uppercase">
            Laboratorio
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="mt-6 font-display text-xl font-medium tracking-tight sm:text-2xl">
            {heroTitle}
          </p>
          <p className="mt-3 max-w-prose text-muted">{heroSubtitle}</p>
        </div>
        <div className="mt-8">
          <HeroParallax>
            <YouTubeEmbed
              videoId={heroYoutubeVideoId}
              title="Reel de dirección de fotografía"
              posterSrc={HERO_STILL_SRC}
              posterWidth={1600}
              posterHeight={900}
            />
          </HeroParallax>
        </div>
      </GalleryBox>
    </section>
  );
}
