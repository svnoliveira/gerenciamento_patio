import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  cacheLife: {
    blog: {
      stale: 3600, // 1 hour
      revalidate: 900, // 15 minutes
      expire: 86400, // 1 day
    },
  },
  images: {
    remotePatterns: [
      new URL("https://fakestoreapi.com/**"),
      {
        protocol: "https",
        hostname: "pub-1aa60336a99943a2b9b32c661a00c884.r2.dev",
      },
    ],
  },
};

export default nextConfig;
