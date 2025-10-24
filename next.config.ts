import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    domains: ['raw.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '**',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;