import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Dish photos are resized in the browser, but leave headroom for the upload.
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
