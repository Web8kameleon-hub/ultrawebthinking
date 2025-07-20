import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Pure TypeScript + Vanilla CSS + CVA + Framer Motion
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: [],
    // Optimize package imports to reduce chunk sizes
    optimizePackageImports: ['framer-motion', 'class-variance-authority'],
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  images: {
    domains: ['localhost'],
  },
  // CSS Modules support për vanilla CSS
  cssModules: true,
  // Enforce që të mos ketë JS files
  pageExtensions: ['ts', 'tsx', 'mts'],
  // Disable prerendering/static generation që po shkakton error
  trailingSlash: false,
  
  // Bundle optimization for better First Load JS
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Only apply optimizations in production builds
    if (!dev && !isServer) {
      // Split chunks more efficiently
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Framework chunk (React, Next.js core)
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Framer Motion in separate chunk (it's heavy)
          framerMotion: {
            chunks: 'all',
            name: 'framer-motion',
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            priority: 30,
            enforce: true,
          },
          // AGI Engines in separate chunks (lazy loaded)
          agiEngines: {
            chunks: 'async',
            name: 'agi-engines',
            test: /[\\/]components[\\/]AGISheet[\\/].*Engine\.ts$/,
            priority: 20,
            enforce: true,
          },
          // Common utilities
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'lib',
            priority: 10,
            minChunks: 1,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    return config;
  },
}

export default nextConfig
