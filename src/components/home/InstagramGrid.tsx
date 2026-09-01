import { GalleryBox } from "@/components/GalleryBox";
import { Section } from "@/components/Section";
import { TextLink } from "@/components/TextLink";
import type { InstagramPost } from "@/lib/instagram";

type InstagramGridProps = {
  href: string;
  posts: InstagramPost[];
};

export function InstagramGrid({ href, posts }: InstagramGridProps) {
  return (
    <Section
      title="Instagram"
      ui="instagram-teaser"
      className="mx-auto max-w-4xl px-6 py-section"
    >
      {posts.length > 0 ? (
        <>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
          <p className="mt-6">
            <TextLink href={href}>Ver el perfil</TextLink>
          </p>
        </>
      ) : (
        <GalleryBox className="mt-4 px-8 py-8">
          <p className="max-w-prose text-muted">
            El grid se conecta con un widget. Si no está, el perfil es el sitio:
            no inventamos un muro.
          </p>
          <p className="mt-4">
            <TextLink href={href}>Ver el perfil</TextLink>
          </p>
        </GalleryBox>
      )}
    </Section>
  );
}
