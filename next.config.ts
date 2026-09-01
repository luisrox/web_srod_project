import type { NextConfig } from "next";

import { redirects } from "./src/lib/redirects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "**.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  redirects: async () => redirects,
};

export default nextConfig;
