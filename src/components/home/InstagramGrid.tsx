import { ElfsightInstagram } from "@/components/home/ElfsightInstagram";
import { GalleryBox } from "@/components/GalleryBox";
import { Section } from "@/components/Section";
import {
  instagramEmbedUrl,
  type InstagramPost,
} from "@/lib/instagram";

type InstagramGridProps = {
  href: string;
  posts: InstagramPost[];
  widgetId?: string;
};

export function InstagramGrid({ href, posts, widgetId }: InstagramGridProps) {
  return (
    <Section
      title="Instagram"
      ui="instagram-teaser"
      className="mx-auto max-w-6xl px-6 py-section-sm"
    >
      {widgetId ? (
        <ElfsightInstagram widgetId={widgetId} />
      ) : posts.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <a
                href={post.url}
                rel="noopener noreferrer"
                target="_blank"
                className="block hover:opacity-90"
              >
                <GalleryBox as="figure" className="overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.imageUrl}
                    alt={post.alt}
                    width={640}
                    height={640}
                    className="aspect-square w-full object-cover"
                  />
                </GalleryBox>
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div data-ui="instagram-embed" className="mt-6 flex justify-center">
          <iframe
            title="Últimas publicaciones de Instagram"
            src={instagramEmbedUrl(href)}
            className="h-[620px] w-full max-w-[330px] rounded-gallery border-0 bg-surface"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}
    </Section>
  );
}
