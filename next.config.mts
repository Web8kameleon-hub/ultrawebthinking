import type { NextConfig } from 'next'

const config: NextConfig = {
  // TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint minimal - vetëm bazat
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['pages', 'components', 'lib', 'utils'],
  },
  
  // Optimize for development
  experimental: {
    turbo: {
      rules: {
        '*.ts': ['typescript'],
        '*.tsx': ['typescript'],
      },
    },
  },
  
  // Static export optimization
  trailingSlash: false,
  output: 'standalone',
  
  // Custom webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Optimize for production
    if (!dev) {
      config.optimization.minimize = true
    }
    
    // Support for ESM modules
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    
    return config
  },
  
  // Environment variables
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },
  
  // Strict mode for React
  reactStrictMode: true,
  
  // SWC minification
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

export default config
