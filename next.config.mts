/**
 * Next.js Configuration - EuroWeb Industrial Platform
 * Web8 Architecture - No Chunks, Pure Performance
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.1 Industrial
 * @license MIT
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable chunking for cleaner builds
  experimental: {
    optimizeCss: true,
  },
  
  // Disable service worker
  serviceWorker: false,
  
  // Webpack configuration - no chunks
  webpack: (config, { isServer }) => {
    // Disable code splitting and chunking completely
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'async',
          cacheGroups: {
            default: false,
            vendors: false
          }
        },
        runtimeChunk: false,
      };
    }
    
    return config;
  },
  
  // Build configuration
  output: 'standalone',
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Environment variables
  env: {
    EUROWEB_VERSION: '8.0.1',
    EUROWEB_BUILD: 'Industrial',
    WEB8_ARCHITECTURE: 'true'
  },
  
  // Headers for security and performance  
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-EuroWeb-Version',
            value: '8.0.1-Industrial'
          },
          {
            key: 'X-Web8-Architecture',
            value: 'true'
          }
        ]
      }
    ];
  }
};

export default nextConfig;