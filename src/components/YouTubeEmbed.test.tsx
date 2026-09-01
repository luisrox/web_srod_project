import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  youtubeEmbedPropsSchema,
  youtubeEmbedSrc,
  YouTubeEmbed,
} from "./YouTubeEmbed";

vi.mock("next/image", () => ({
  default({
    src,
    alt,
    width,
    height,
    ...rest
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} width={width} height={height} {...rest} />
    );
  },
}));

const props = {
  videoId: "srodLookbk1",
  title: "Lookbook verano en Casco",
  posterSrc: "/placeholders/lookbook-verano-1.svg",
};

describe("YouTubeEmbed", () => {
  it("no carga el iframe hasta el gesto y el botón incluye el título", async () => {
    const user = userEvent.setup();
    const { container } = render(<YouTubeEmbed {...props} />);

    const embed = container.querySelector('[data-ui="youtube-embed"]');
    expect(embed).toHaveClass("aspect-video");
    expect(screen.queryByTitle(props.title)).not.toBeInTheDocument();
    expect(container.querySelector("iframe")).toBeNull();
    expect(container.innerHTML).not.toContain("autoplay=1");

    const play = screen.getByRole("button", {
      name: `Reproducir ${props.title}`,
    });
    expect(play.tagName).toBe("BUTTON");

    await user.click(play);

    const iframe = screen.getByTitle(props.title);
    expect(iframe.tagName).toBe("IFRAME");
    expect(iframe).toHaveAttribute(
      "src",
      youtubeEmbedSrc(props.videoId, { autoplay: true }),
    );
    expect(iframe.getAttribute("src")).toContain("youtube-nocookie.com");
    expect(iframe.getAttribute("src")).toContain("modestbranding=1");
    expect(iframe.getAttribute("src")).toContain(`/${props.videoId}?`);
    expect(iframe.getAttribute("src")).toContain("autoplay=1");
  });

  it("exige título en el schema de props", () => {
    expect(youtubeEmbedPropsSchema.safeParse(props).success).toBe(true);
    expect(
      youtubeEmbedPropsSchema.safeParse({
        videoId: props.videoId,
        posterSrc: props.posterSrc,
      }).success,
    ).toBe(false);
  });
});
