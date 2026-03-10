import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.realtor.ca',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
