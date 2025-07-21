import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
domains: [
  "i.ibb.co",
]
  },
  eslint: {
       ignoreDuringBuilds: true,
  }
};

export default nextConfig;
