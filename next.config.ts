import type { NextConfig } from "next";

import { redirects } from "./src/lib/redirects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  redirects: async () => redirects,
};

export default nextConfig;
