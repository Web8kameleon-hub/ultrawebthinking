/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false
  },
  webpack: (config) => {
    return config;
  }
};

export default nextConfig;