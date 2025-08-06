#!/usr/bin/env tsx

/**
 * 🚀 VERCEL DEPLOYMENT OPTIMIZER
 * Përgatit dhe optimizon projektin për Vercel deployment
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0-VERCEL-READY
 * @license MIT
 */

import { execSync } from 'child_process';
import { existsSync, writeFileSync, readFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = process.cwd();

interface VercelOptimizationReport {
  config: {
    vercelJson: boolean;
    nextConfig: boolean;
    packageJson: boolean;
    environmentReady: boolean;
  };
  build: {
    typeCheck: boolean;
    buildSuccess: boolean;
    bundleSize: string;
    performance: string;
  };
  deployment: {
    ready: boolean;
    optimizations: string[];
    suggestions: string[];
  };
}

class VercelOptimizer {
  private readonly report: VercelOptimizationReport = {
    config: {
      vercelJson: false,
      nextConfig: false,
      packageJson: false,
      environmentReady: false
    },
    build: {
      typeCheck: false,
      buildSuccess: false,
      bundleSize: '0MB',
      performance: 'Unknown'
    },
    deployment: {
      ready: false,
      optimizations: [],
      suggestions: []
    }
  };

  /**
   * 🚀 MAIN VERCEL OPTIMIZATION
   */
  public async optimizeForVercel(): Promise<VercelOptimizationReport> {
    console.log('🚀 VERCEL DEPLOYMENT OPTIMIZATION STARTING...\n');

    await this.optimizeVercelConfig();
    await this.optimizeNextConfig();
    await this.optimizePackageJson();
    await this.setupEnvironmentVariables();
    await this.createVercelSpecificFiles();
    await this.optimizeBuildProcess();
    await this.performTypeCheck();
    await this.testBuild();
    await this.generateDeploymentSuggestions();

    return this.report;
  }

  /**
   * ⚙️ OPTIMIZE VERCEL CONFIGURATION
   */
  private async optimizeVercelConfig(): Promise<void> {
    console.log('⚙️ Optimizing Vercel configuration...');

    const vercelConfig = {
      "$schema": "https://openapi.vercel.sh/vercel.json",
      "version": 2,
      "name": "ultraweb-platform",
      "alias": [
        "ultraweb.ai",
        "www.ultraweb.ai"
      ],
      "domains": [
        "ultraweb.ai",
        "www.ultraweb.ai",
        "api.ultraweb.ai"
      ],
      "build": {
        "env": {
          "NODE_ENV": "production",
          "NEXT_TELEMETRY_DISABLED": "1",
          "SKIP_ENV_VALIDATION": "true"
        }
      },
      "functions": {
        "app/api/**/*.ts": {
          "runtime": "nodejs18.x",
          "memory": 1024,
          "maxDuration": 30
        }
      },
      "headers": [
        {
          "source": "/(.*)",
          "headers": [
            {
              "key": "X-Frame-Options",
              "value": "DENY"
            },
            {
              "key": "X-Content-Type-Options",
              "value": "nosniff"
            },
            {
              "key": "Referrer-Policy",
              "value": "origin-when-cross-origin"
            },
            {
              "key": "Permissions-Policy",
              "value": "camera=(), microphone=(), geolocation=()"
            },
            {
              "key": "X-Robots-Tag",
              "value": "index, follow"
            },
            {
              "key": "Cache-Control",
              "value": "public, max-age=31536000, immutable"
            }
          ]
        },
        {
          "source": "/api/(.*)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "no-cache, no-store, must-revalidate"
            }
          ]
        }
      ],
      "redirects": [
        {
          "source": "/home",
          "destination": "/",
          "permanent": true
        }
      ],
      "rewrites": [
        {
          "source": "/health",
          "destination": "/api/health"
        }
      ],
      "crons": [
        {
          "path": "/api/health",
          "schedule": "0 */6 * * *"
        }
      ]
    };

    writeFileSync(
      join(PROJECT_ROOT, 'vercel.json'),
      JSON.stringify(vercelConfig, null, 2)
    );

    this.report.config.vercelJson = true;
    this.report.deployment.optimizations.push('Enhanced vercel.json with production settings');
    console.log('✅ Vercel configuration optimized');
  }

  /**
   * ⚙️ OPTIMIZE NEXT.JS CONFIGURATION
   */
  private async optimizeNextConfig(): Promise<void> {
    console.log('⚙️ Optimizing Next.js configuration for Vercel...');

    const nextConfigContent = `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Vercel optimizations
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  
  // TypeScript optimizations
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ['framer-motion', 'class-variance-authority'],
    serverComponentsExternalPackages: []
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
            test: /[\\\\/]node_modules[\\\\/]/,
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

export default nextConfig;`;

    writeFileSync(join(PROJECT_ROOT, 'next.config.mts'), nextConfigContent);
    
    this.report.config.nextConfig = true;
    this.report.deployment.optimizations.push('Next.js config optimized for Vercel');
    console.log('✅ Next.js configuration optimized for Vercel');
  }

  /**
   * 📦 OPTIMIZE PACKAGE.JSON
   */
  private async optimizePackageJson(): Promise<void> {
    console.log('📦 Optimizing package.json for Vercel...');

    const packageJsonPath = join(PROJECT_ROOT, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    // Add Vercel-specific scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      "vercel:build": "yarn type-check && next build",
      "vercel:dev": "next dev",
      "vercel:start": "next start",
      "vercel:deploy": "vercel --prod",
      "vercel:preview": "vercel",
      "postinstall": "next telemetry disable"
    };

    // Add Vercel engine requirements
    packageJson.engines = {
      "node": ">=18.0.0",
      "npm": ">=8.0.0",
      "yarn": ">=1.22.0"
    };

    // Optimize dependencies for Vercel
    if (!packageJson.devDependencies) packageJson.devDependencies = {};
    packageJson.devDependencies["@vercel/analytics"] = "^1.0.0";
    packageJson.devDependencies["@vercel/speed-insights"] = "^1.0.0";

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    this.report.config.packageJson = true;
    this.report.deployment.optimizations.push('Package.json optimized with Vercel scripts');
    console.log('✅ Package.json optimized for Vercel');
  }

  /**
   * 🌍 SETUP ENVIRONMENT VARIABLES
   */
  private async setupEnvironmentVariables(): Promise<void> {
    console.log('🌍 Setting up environment variables...');

    // Create .env.example for Vercel
    const envExample = `# UltraWeb Platform - Environment Variables
# Copy this to .env.local for local development

# Application
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
SKIP_ENV_VALIDATION=true

# Domain
NEXT_PUBLIC_APP_URL=https://ultraweb.ai
NEXT_PUBLIC_API_URL=https://api.ultraweb.ai

# Database (if needed)
# DATABASE_URL=postgresql://...

# Redis (if needed)  
# REDIS_URL=redis://...

# Analytics
# VERCEL_ANALYTICS_ID=
# NEXT_PUBLIC_VERCEL_ANALYTICS_ID=

# Security
# JWT_SECRET=your-secret-key
# API_SECRET=your-api-secret

# External APIs
# OPENAI_API_KEY=
# ANTHROPIC_API_KEY=`;

    writeFileSync(join(PROJECT_ROOT, '.env.example'), envExample);

    // Create .env.local for development
    if (!existsSync(join(PROJECT_ROOT, '.env.local'))) {
      const envLocal = `# Local development environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api`;

      writeFileSync(join(PROJECT_ROOT, '.env.local'), envLocal);
    }

    this.report.config.environmentReady = true;
    this.report.deployment.optimizations.push('Environment variables configured');
    console.log('✅ Environment variables configured');
  }

  /**
   * 📄 CREATE VERCEL-SPECIFIC FILES
   */
  private async createVercelSpecificFiles(): Promise<void> {
    console.log('📄 Creating Vercel-specific files...');

    // .vercelignore
    const vercelIgnore = `# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage
.nyc_output
test-results

# Next.js
.next/
out/

# Production
build
dist

# Environment files
.env*.local
.env.test

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Cache
.cache
.parcel-cache

# TypeScript
*.tsbuildinfo

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache`;

    writeFileSync(join(PROJECT_ROOT, '.vercelignore'), vercelIgnore);

    // robots.txt
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://ultraweb.ai/sitemap.xml`;

    const publicDir = join(PROJECT_ROOT, 'public');
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true });
    }
    writeFileSync(join(publicDir, 'robots.txt'), robotsTxt);

    // favicon.ico (placeholder)
    if (!existsSync(join(publicDir, 'favicon.ico'))) {
      console.log('ℹ️ Add favicon.ico to public/ directory');
    }

    this.report.deployment.optimizations.push('Vercel-specific files created');
    console.log('✅ Vercel-specific files created');
  }

  /**
   * 🔨 OPTIMIZE BUILD PROCESS
   */
  private async optimizeBuildProcess(): Promise<void> {
    console.log('🔨 Optimizing build process...');

    try {
      // Clean before build
      console.log('🧹 Cleaning build artifacts...');
      if (existsSync(join(PROJECT_ROOT, '.next'))) {
        execSync('rm -rf .next', { cwd: PROJECT_ROOT, stdio: 'ignore' });
      }

      // Install dependencies
      console.log('📦 Installing dependencies...');
      execSync('yarn install --frozen-lockfile', { 
        cwd: PROJECT_ROOT, 
        stdio: 'pipe' 
      });

      this.report.deployment.optimizations.push('Build process optimized');
      console.log('✅ Build process optimized');

    } catch (error) {
      console.warn('⚠️ Build optimization partial:', error);
    }
  }

  /**
   * 🔍 PERFORM TYPE CHECK
   */
  private async performTypeCheck(): Promise<void> {
    console.log('🔍 Performing TypeScript type check...');

    try {
      execSync('yarn type-check', { 
        cwd: PROJECT_ROOT, 
        stdio: 'pipe' 
      });

      this.report.build.typeCheck = true;
      console.log('✅ TypeScript type check passed');

    } catch (error) {
      console.warn('⚠️ TypeScript type check failed:', error);
      this.report.deployment.suggestions.push('Fix TypeScript errors before deployment');
    }
  }

  /**
   * 🏗️ TEST BUILD
   */
  private async testBuild(): Promise<void> {
    console.log('🏗️ Testing production build...');

    try {
      console.log('🔄 Building for production...');
      const buildOutput = execSync('yarn build', { 
        cwd: PROJECT_ROOT, 
        encoding: 'utf8',
        stdio: 'pipe'
      });

      this.report.build.buildSuccess = true;
      
      // Extract bundle size info
      if (buildOutput.includes('First Load JS')) {
        const sizeMatch = buildOutput.match(/First Load JS.*?(\\d+(?:\\.\\d+)?\\s*(?:kB|MB))/);
        if (sizeMatch) {
          this.report.build.bundleSize = sizeMatch[1];
        }
      }

      this.report.build.performance = 'Optimized';
      console.log('✅ Production build successful');

    } catch (error) {
      console.error('❌ Production build failed:', error);
      this.report.deployment.suggestions.push('Fix build errors before deployment');
    }
  }

  /**
   * 💡 GENERATE DEPLOYMENT SUGGESTIONS
   */
  private async generateDeploymentSuggestions(): Promise<void> {
    const suggestions = this.report.deployment.suggestions;

    if (this.report.build.typeCheck && this.report.build.buildSuccess) {
      this.report.deployment.ready = true;
      suggestions.push('✅ Ready for Vercel deployment!');
    }

    suggestions.push('🔧 Use "yarn vercel:deploy" to deploy to production');
    suggestions.push('👀 Use "yarn vercel:preview" for preview deployments');
    suggestions.push('📊 Monitor performance at vercel.com/analytics');
    suggestions.push('🔒 Configure environment variables in Vercel dashboard');
    suggestions.push('🌐 Set up custom domains in Vercel settings');

    if (this.report.build.bundleSize && parseFloat(this.report.build.bundleSize) > 250) {
      suggestions.push('⚠️ Consider code splitting to reduce bundle size');
    }
  }

  /**
   * 📋 PRINT VERCEL REPORT
   */
  public printReport(report: VercelOptimizationReport): void {
    console.log(`\\n${  '='.repeat(80)}`);
    console.log('🚀 VERCEL DEPLOYMENT OPTIMIZATION REPORT');
    console.log('='.repeat(80));

    // Configuration Status
    console.log('\\n⚙️ CONFIGURATION:');
    console.log(`   vercel.json: ${report.config.vercelJson ? '✅' : '❌'}`);
    console.log(`   next.config.mts: ${report.config.nextConfig ? '✅' : '❌'}`);
    console.log(`   package.json: ${report.config.packageJson ? '✅' : '❌'}`);
    console.log(`   Environment: ${report.config.environmentReady ? '✅' : '❌'}`);

    // Build Status
    console.log('\\n🏗️ BUILD:');
    console.log(`   Type Check: ${report.build.typeCheck ? '✅' : '❌'}`);
    console.log(`   Build Success: ${report.build.buildSuccess ? '✅' : '❌'}`);
    console.log(`   Bundle Size: ${report.build.bundleSize}`);
    console.log(`   Performance: ${report.build.performance}`);

    // Deployment Status
    console.log('\\n🚀 DEPLOYMENT:');
    console.log(`   Ready: ${report.deployment.ready ? '✅' : '⚠️'}`);
    
    console.log('\\n🔧 OPTIMIZATIONS APPLIED:');
    report.deployment.optimizations.forEach(opt => 
      console.log(`   ✅ ${opt}`)
    );

    console.log('\\n💡 DEPLOYMENT SUGGESTIONS:');
    report.deployment.suggestions.forEach((suggestion, index) => 
      console.log(`   ${index + 1}. ${suggestion}`)
    );

    console.log('\\n📝 NEXT STEPS:');
    console.log('   1. Install Vercel CLI: npm i -g vercel');
    console.log('   2. Login to Vercel: vercel login');
    console.log('   3. Deploy: yarn vercel:deploy');
    console.log('   4. Configure custom domain in Vercel dashboard');
    console.log('   5. Set up environment variables');

    console.log(`\\n${  '='.repeat(80)}`);
    console.log(report.deployment.ready ? 
      '✅ READY FOR VERCEL DEPLOYMENT!' : 
      '⚠️ REQUIRES FIXES BEFORE DEPLOYMENT'
    );
    console.log(`${'='.repeat(80)  }\\n`);
  }
}

/**
 * 🚀 MAIN EXECUTION
 */
async function main(): Promise<void> {
  try {
    const optimizer = new VercelOptimizer();
    const report = await optimizer.optimizeForVercel();
    optimizer.printReport(report);

    if (report.deployment.ready) {
      console.log('🎉 Platform is ready for Vercel deployment!');
      process.exit(0);
    } else {
      console.log('⚠️ Fix issues before deploying to Vercel');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Vercel optimization failed:', error);
    process.exit(1);
  }
}

// Execute main function
main();

export { VercelOptimizer };
