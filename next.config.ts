import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pin the workspace root; other lockfiles higher up the tree would otherwise confuse detection.
  turbopack: { root: path.resolve(process.cwd()) },
  experimental: {
    // The on-disk Turbopack cache records environment values, including the
    // server-side Gmail app password, and hosts scan build output for secrets.
    // Production builds here are fast, so skip writing it.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
