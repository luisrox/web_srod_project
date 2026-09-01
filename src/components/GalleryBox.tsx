import type { ReactNode } from "react";

type GalleryBoxElement = "div" | "section" | "article" | "figure";

type GalleryBoxProps = {
  children: ReactNode;
  as?: GalleryBoxElement;
  className?: string;
};

const galleryBoxClasses =
  "rounded-gallery border border-line bg-surface text-ink shadow-gallery";

export function GalleryBox({
  children,
  as: Element = "div",
  className,
}: GalleryBoxProps) {
  return (
    <Element
      data-ui="gallery-box"
      className={[galleryBoxClasses, className].filter(Boolean).join(" ")}
    >
      {children}
    </Element>
  );
}
