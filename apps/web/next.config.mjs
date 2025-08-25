/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // app dir është default në Next 14, por e lëmë qartë
    appDir: true
  },
  transpilePackages: [
    "@euroweb/utt",
    "@euroweb/agi",
    "@euroweb/ui",
    "@euroweb/utils"
  ]
};
export default nextConfig;
