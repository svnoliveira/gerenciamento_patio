import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
      {
        protocol: "https",
        hostname: "images.lrnagricola.com.br",
      },
      { hostname: "api.lrnagricola.com,br" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
    proxyClientMaxBodySize: "20mb",
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.lrnagricola.com.br/:path*",
      },
    ];
  },
};

export default nextConfig;
