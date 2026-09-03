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
        hostname: "i1.ytimg.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "i2.ytimg.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "i3.ytimg.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "i4.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  redirects: async () => redirects,
};

export default nextConfig;
