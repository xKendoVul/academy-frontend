import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.GATEWAY_URL ?? "http://client-gateway:3000"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
