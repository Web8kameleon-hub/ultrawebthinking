/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Allow resolving symlinks
    config.resolve.symlinks = true
    return config
  },
}

module.exports = nextConfig
