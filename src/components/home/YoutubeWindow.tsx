import { GalleryBox } from "@/components/GalleryBox";
import { ButtonLink } from "@/components/TextLink";
import type { YoutubeFeedResult, YoutubeVideo } from "@/lib/youtube-feed";

type YoutubeWindowProps = {
  href: string;
  feed: YoutubeFeedResult;
};

function cardThumbnail(video: YoutubeVideo): string {
  return `https://i.ytimg.com/vi/${video.id}/sddefault.jpg`;
}

/**
 * Thumbs grandes + overlay al hover, no N iframes: el embed queda en hero/cases.
 * Si el RSS falla, solo el CTA — sin grid vacío de cards rotas.
 */
export function YoutubeWindow({ href, feed }: YoutubeWindowProps) {
  const videos = feed.ok ? feed.videos : [];

  return (
    <div data-ui="youtube-teaser" className="mt-6">
      {videos.length > 0 ? (
        <>
          <ul className="grid gap-8 sm:grid-cols-2">
            {videos.map((video) => (
              <li key={video.id}>
                <a
                  href={video.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="group block"
                >
                  <GalleryBox className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cardThumbnail(video)}
                      alt=""
                      width={640}
                      height={360}
                      loading="lazy"
                      className="aspect-video w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
                    />
                    <div
                      data-ui="youtube-card-overlay"
                      className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-bg/95 via-bg/55 to-transparent px-6 py-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:opacity-100"
                    >
                      <h3 className="font-display text-xl font-medium tracking-tight text-[#f5e6d0] sm:text-2xl">
                        {video.title}
                        <span className="sr-only">
                          {" "}
                          (se abre en una pestaña nueva)
                        </span>
                      </h3>
                      {video.description ? (
                        <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm text-[#f5e6d0]/80">
                          {video.description}
                        </p>
                      ) : null}
                    </div>
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
        <p>
          <ButtonLink href={href}>Ver el canal</ButtonLink>
        </p>
      )}
    </div>
  );
}
