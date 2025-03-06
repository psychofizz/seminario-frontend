import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'campusvirtual.unah.edu.hn',
        
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
