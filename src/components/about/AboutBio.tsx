import Image from "next/image";
import type { ReactNode } from "react";

import { GalleryBox } from "@/components/GalleryBox";
import { TextLink } from "@/components/TextLink";

export const ABOUT_PORTRAIT_ALT =
  "Retrato de Srod Almenara, director de fotografía";

type AboutBioProps = {
  aboutExcerpt: string;
  aboutBody: string;
  portrait: string;
  musicUrl?: string;
};

export function splitAboutBody(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function paragraphWithMusicLink(text: string, musicUrl: string): ReactNode {
  const match = text.match(/música/i);

  if (!match || match.index === undefined) {
    return text;
  }

  const word = match[0];
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + word.length);

  return (
    <>
      {before}
      <TextLink href={musicUrl}>{word}</TextLink>
      {after}
    </>
  );
}

export function AboutBio({
  aboutExcerpt,
  aboutBody,
  portrait,
  musicUrl,
}: AboutBioProps) {
  const paragraphs = splitAboutBody(aboutBody);
  const musicParagraphIndex =
    musicUrl === undefined
      ? -1
      : paragraphs.findIndex((paragraph) => /música/i.test(paragraph));

  return (
    <div data-ui="about">
      <GalleryBox as="figure" className="overflow-hidden">
        <Image
          src={portrait}
          alt={ABOUT_PORTRAIT_ALT}
          width={1200}
          height={1500}
          className="w-full object-cover"
        />
      </GalleryBox>
      <p className="mt-8 font-display text-xl font-medium tracking-tight">
        {aboutExcerpt}
      </p>
      <div className="mt-6 space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={paragraph.slice(0, 48)} className="max-w-prose text-muted">
            {index === musicParagraphIndex && musicUrl
              ? paragraphWithMusicLink(paragraph, musicUrl)
              : paragraph}
          </p>
        ))}
      </div>
      <p className="mt-8 max-w-prose">
        Si hay un encargo, <TextLink href="/contacto">escríbeme</TextLink>.
      </p>
    </div>
  );
}
