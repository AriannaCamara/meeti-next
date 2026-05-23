import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kl0ndrsxe8.ufs.sh'
      }
    ]
  }
};

export default nextConfig;
