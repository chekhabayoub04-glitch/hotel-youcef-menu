import type { NextConfig } from "next";

// Static export for GitHub Pages. NEXT_PUBLIC_BASE_PATH is "/hotel-youcef-menu" when deploying
// to https://<user>.github.io/hotel-youcef-menu/ and empty locally or on a custom domain.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // Dev only: let phones on the same Wi-Fi load the dev server (to test 3D/AR on a real device).
  allowedDevOrigins: ["192.168.1.4", "*.local"],
};

export default nextConfig;
