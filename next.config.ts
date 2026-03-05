import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.realtor.ca',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.realtor.ca',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.realtor.ca',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
