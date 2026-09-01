import { ImageResponse } from "next/og";

import { color } from "@/styles/tokens";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon({
  params,
}: {
  params?: Promise<Record<string, string | string[]>>;
}) {
  if (params) {
    await params;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: color.bg,
          color: color.accent,
          fontSize: 110,
          fontWeight: 600,
          letterSpacing: -4,
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
