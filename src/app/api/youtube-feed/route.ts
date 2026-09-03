import { content } from "@/content";
import { getYoutubeFeed } from "@/lib/youtube-feed";

export async function GET() {
  const settings = await content.getSiteSettings();
  const feed = await getYoutubeFeed({
    channelId: settings.youtubeChannelId,
    youtubeUrl: settings.youtubeUrl,
    limit: settings.youtubeFeedCount + 8,
  });

  return Response.json(feed, {
    headers: {
      "cache-control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
