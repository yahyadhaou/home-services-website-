import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pin the workspace root; other lockfiles higher up the tree would otherwise confuse detection.
  turbopack: { root: path.resolve(process.cwd()) },
};

export default nextConfig;
