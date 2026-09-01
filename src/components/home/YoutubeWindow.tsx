import { GalleryBox } from "@/components/GalleryBox";
import { Section } from "@/components/Section";
import { ButtonLink } from "@/components/TextLink";
import type { YoutubeFeedResult } from "@/lib/youtube-feed";

type YoutubeWindowProps = {
  href: string;
  feed: YoutubeFeedResult;
};

/**
 * Thumbs + enlace a YouTube, no N iframes: el embed queda en hero/cases.
 * Si el RSS falla, solo el CTA — sin grid vacío de cards rotas.
 */
export function YoutubeWindow({ href, feed }: YoutubeWindowProps) {
  const videos = feed.ok ? feed.videos : [];

  return (
    <Section
      title="Proceso"
      ui="youtube-teaser"
      className="mx-auto max-w-4xl px-6 py-section"
    >
      {videos.length > 0 ? (
        <>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <li key={video.id}>
                <a
                  href={video.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="block hover:opacity-90"
                >
                  <GalleryBox className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={video.thumbnail}
                      alt=""
                      width={480}
                      height={360}
                      loading="lazy"
                      className="aspect-video w-full object-cover"
                    />
                    <h3 className="px-6 py-4 font-display text-lg font-medium tracking-tight">
                      {video.title}
                      <span className="sr-only">
                        {" "}
                        (se abre en una pestaña nueva)
                      </span>
                    </h3>
                  </GalleryBox>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <ButtonLink href={href}>Ver el canal</ButtonLink>
          </p>
        </>
      ) : (
        <GalleryBox className="mt-4 px-8 py-8">
          <ButtonLink href={href}>Ver el canal</ButtonLink>
        </GalleryBox>
      )}
    </Section>
  );
}
