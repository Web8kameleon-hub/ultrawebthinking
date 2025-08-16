import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // === DYNAMIC AGI SYSTEM CONFIGURATION ===
  // Optimized for real-time, live, interactive intelligence
  
  // Disable static optimizations for dynamic content
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  
  // Dynamic features enabled
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ['framer-motion', 'class-variance-authority'],
    serverComponentsExternalPackages: [],
    // Enable partial prerendering for hybrid static/dynamic
    ppr: false // Disabled for full dynamic behavior
  },
  
  typescript: {
    tsconfigPath: './tsconfig.json',
    ignoreBuildErrors: false
  },
  
  // Image optimization for Vercel
  images: {
    domains: ['localhost', 'ultraweb.ai', 'api.ultraweb.ai'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: false
  },
  
  // CSS optimizations
  cssModules: true,
  pageExtensions: ['ts', 'tsx', 'mts'],
  trailingSlash: false,
  
  // Bundle optimization for Vercel Edge
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!dev && !isServer) {
      // Optimize for smaller bundle sizes
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true
          }
        }
      };

      // Reduce bundle size
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    return config;
  },

  // Environment variables
  env: {
    NODE_ENV: process.env.NODE_ENV || 'production',
    VERCEL_ENV: process.env.VERCEL_ENV || 'production'
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ];
  }
}

export default nextConfig;