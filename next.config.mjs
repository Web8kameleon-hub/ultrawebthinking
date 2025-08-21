import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },
  
  // 🚀 PERFORMANCE OPTIMIZATIONS
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // 📦 Advanced Bundle Splitting
      if (!dev) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 244000,
            cacheGroups: {
              // AGI Core modules bundle
              agiCore: {
                test: /[\\/]backend[\\/]agi[\\/]/,
                name: 'agi-core',
                chunks: 'all',
                priority: 30,
                enforce: true
              },
              // AGI Engines bundle
              agiEngines: {
                test: /[\\/]backend[\\/]engines[\\/]/,
                name: 'agi-engines',
                chunks: 'all',
                priority: 29,
                enforce: true
              },
              // I18n bundle
              i18n: {
                test: /[\\/](locales|lib[\\/]i18n)[\\/]/,
                name: 'i18n',
                chunks: 'all',
                priority: 28,
                enforce: true
              },
              // UI Components bundle
              components: {
                test: /[\\/]components[\\/]/,
                name: 'components',
                chunks: 'all',
                priority: 27,
                minChunks: 2
              },
              // Third-party libraries
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 20,
                maxSize: 200000
              },
              // Common utilities
              common: {
                test: /[\\/](lib|utils)[\\/]/,
                name: 'common',
                chunks: 'all',
                priority: 25,
                minChunks: 2
              },
              // React/Next.js core
              framework: {
                test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
                name: 'framework',
                chunks: 'all',
                priority: 40,
                enforce: true
              }
            }
          },
          // Tree shaking optimizations
          usedExports: true,
          sideEffects: false,
          // Minimize bundle size
          minimize: true
        };
      }
    }

    // Performance optimizations for both server and client
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            experimentalWatchApi: true
          }
        }
      ]
    });

    return config;
  },

  // 🔧 Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false
  },

  // 📊 Performance monitoring
  outputFileTracing: true,
  
  // 🚀 Static optimization
  trailingSlash: false,
  poweredByHeader: false,

  // 📦 Image optimizations  
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // 🔄 Headers for caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300'
          }
        ]
      }
    ];
  },

  // 🔄 Redirects for optimization
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      }
    ];
  }
                name: 'agi-modules',
                test: /[\\/]backend[\\/]agi[\\/]/,
                priority: 30,
                reuseExistingChunk: true,
              },
              // Engines bundle
              engines: {
                name: 'agi-engines',
                test: /[\\/]backend[\\/]engines[\\/]/,
                priority: 25,
                reuseExistingChunk: true,
              },
              // I18n bundle (language-specific)
              i18n: {
                name: 'i18n-bundle',
                test: /[\\/]locales[\\/]/,
                priority: 20,
                reuseExistingChunk: true,
              },
              // Components bundle
              components: {
                name: 'components',
                test: /[\\/]components[\\/]/,
                priority: 15,
                reuseExistingChunk: true,
              },
              // Vendor libraries
              vendor: {
                name: 'vendor',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                reuseExistingChunk: true,
              },
            },
          },
        };
      }
    }
    
    // Handle .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    return config;
  },
  
  // 📈 Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // 🖼️ Enhanced image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // 📄 Security & Performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=60',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Disable static generation for dynamic routes
  output: undefined
};

export default withNextIntl(nextConfig);