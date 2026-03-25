import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/go/:slug',
        destination: 'https://api.bodyinsight.in/go/:slug',
      },
    ];
  },
};

export default nextConfig;
