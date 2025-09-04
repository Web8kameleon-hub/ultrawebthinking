#!/usr/bin/env tsx
/**
 * EuroWeb Route Checker - Pure TypeScript Industrial
 * Yarn Berry + TypeScript 5.8 + Next.js 14 + CVA + Framer Motion
 * 
 * ZERO: .js, jest, useState, chunks, default exports
 * ONLY: named exports, dynamic imports, lazy loading
 */

import { readdirSync, statSync, existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';

// Pure TypeScript console colors - NO dependencies
const colors = {
  blue: (text: string): string => `\x1b[34m${text}\x1b[0m`,
  green: (text: string): string => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string): string => `\x1b[33m${text}\x1b[0m`,
  red: (text: string): string => `\x1b[31m${text}\x1b[0m`,
  cyan: (text: string): string => `\x1b[36m${text}\x1b[0m`,
  gray: (text: string): string => `\x1b[90m${text}\x1b[0m`
} as const;

interface RouteInfo {
  readonly path: string;
  readonly type: 'page' | 'layout' | 'loading' | 'error' | 'not-found';
  readonly exists: boolean;
  readonly isDirectory: boolean;
}

// Pure TypeScript class - NO useState, NO default exports
export class RouteChecker {
  private readonly routes: RouteInfo[] = [];
  private readonly appDir: string;

  constructor() {
    this.appDir = join(process.cwd(), 'app');
  }

  checkRoutes(): void {
    console.log(colors.blue('🔍 EuroWeb Route Checker'));
    console.log(colors.gray('─'.repeat(50)));

    if (!existsSync(this.appDir)) {
      console.log(colors.red('❌ App directory not found!'));
      console.log(colors.yellow('📁 Creating app directory...'));
      this.createAppDirectory();
      return;
    }

    this.scanDirectory(this.appDir, '');
    this.printRoutes();
    this.checkRequiredFiles();
    this.checkServerComponentIssues();
    this.suggestFixes();
    this.autoFix();
  }

  private createAppDirectory(): void {
    try {
      mkdirSync(this.appDir, { recursive: true });
      console.log(colors.green('✅ Created app directory'));
      this.createBasicFiles();
    } catch (error) {
      console.log(colors.red(`❌ Failed to create app directory: ${  error}`));
    }
  }

  private createBasicFiles(): void {
    const files = [
      {
        path: 'layout.tsx',
        content: `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EuroWeb Platform',
  description: 'AGI-Powered Web8 Browser',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sq">
      <body>{children}</body>
    </html>
  )
}
`
      },
      {
        path: 'page.tsx',
        content: `'use client'

import dynamic from 'next/dynamic'

const Web8TabSystem = dynamic(() => import('../components/Web8TabSystem'), {
  ssr: false,
  loading: () => <div>Loading EuroWeb Platform...</div>
})

export default function HomePage() {
  return <Web8TabSystem />
}
`
      },
      {
        path: 'loading.tsx',
        content: `export default function Loading() {
  return (
    <div className={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1d29 0%, #2d2a45 30%)',
      color: '#f8fafc'
    }}>
      <div className={{ textAlign: 'center' }}>
        <div className={{
          width: '60px',
          height: '60px',
          border: '3px solid #d4af37',
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <h2 className={{ color: '#d4af37' }}>🚀 EuroWeb Platform</h2>
        <p>AGI Core po inicializohet...</p>
      </div>
    </div>
  )
}
`
      },
      {
        path: 'globals.css',
        content: `* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html, body {
  max-width: 100vw;
  overflow-x: hidden;
  background: #1a1d29;
  color: #f8fafc;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`
      }
    ];

    for (const file of files) {
      const filePath = join(this.appDir, file.path);
      try {
        writeFileSync(filePath, file.content);
        console.log(colors.green(`✅ Created ${file.path}`));
      } catch (error) {
        console.log(colors.red(`❌ Failed to create ${file.path}: ${  error}`));
      }
    }
  }

  private scanDirectory(dir: string, relativePath: string): void {
    try {
      const items = readdirSync(dir);
      
      for (const item of items) {
        const fullPath = join(dir, item);
        const itemRelativePath = join(relativePath, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          this.scanDirectory(fullPath, itemRelativePath);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          const routeType = this.determineRouteType(item);
          if (routeType) {
            this.routes.push({
              path: itemRelativePath,
              type: routeType,
              exists: true,
              isDirectory: false
            });
          }
        }
      }
    } catch (error) {
      console.log(colors.red(`Error scanning ${dir}: ${  error}`));
    }
  }

  private determineRouteType(filename: string): RouteInfo['type'] | null {
    if (filename === 'page.tsx' || filename === 'page.ts') {return 'page';}
    if (filename === 'layout.tsx' || filename === 'layout.ts') {return 'layout';}
    if (filename === 'loading.tsx' || filename === 'loading.ts') {return 'loading';}
    if (filename === 'error.tsx' || filename === 'error.ts') {return 'error';}
    if (filename === 'not-found.tsx' || filename === 'not-found.ts') {return 'not-found';}
    return null;
  }

  private printRoutes(): void {
    console.log(colors.yellow('\n📋 Found Routes:'));
    
    if (this.routes.length === 0) {
      console.log(colors.red('❌ No routes found!'));
      return;
    }

    const groupedRoutes = this.groupRoutesByType();
    
    for (const [type, routes] of Object.entries(groupedRoutes)) {
      console.log(colors.cyan(`\n${this.getTypeIcon(type as RouteInfo['type'])} ${type.toUpperCase()}:`));
      routes.forEach(route => {
        console.log(colors.green(`  ✅ ${route.path}`));
      });
    }
  }

  private groupRoutesByType(): Record<string, RouteInfo[]> {
    return this.routes.reduce((acc, route) => {
      if (!acc[route.type]) {acc[route.type] = [];}
      acc[route.type].push(route);
      return acc;
    }, {} as Record<string, RouteInfo[]>);
  }

  private getTypeIcon(type: RouteInfo['type']): string {
    switch (type) {
      case 'page': return '📄';
      case 'layout': return '🏗️';
      case 'loading': return '⏳';
      case 'error': return '❌';
      case 'not-found': return '🚫';
      default: return '📁';
    }
  }

  private checkRequiredFiles(): void {
    console.log(colors.yellow('\n🔍 Checking Required Files:'));

    const requiredFiles = [
      { path: 'app/layout.tsx', required: true, description: 'Root layout' },
      { path: 'app/page.tsx', required: true, description: 'Home page' },
      { path: 'app/not-found.tsx', required: false, description: '404 page' },
      { path: 'app/error.tsx', required: false, description: 'Error boundary' },
      { path: 'app/loading.tsx', required: false, description: 'Loading UI' },
      { path: 'components/Web8TabSystem.tsx', required: true, description: 'Main component' }
    ];

    for (const file of requiredFiles) {
      const fullPath = join(process.cwd(), file.path);
      const exists = existsSync(fullPath);
      const icon = exists ? '✅' : (file.required ? '❌' : '⚠️');
      const status = exists ? 'Found' : (file.required ? 'MISSING' : 'Optional');
      
      console.log(`${icon} ${file.path} - ${status} (${file.description})`);
    }
  }

  private checkServerComponentIssues(): void {
    console.log(colors.yellow('\n🔍 Checking Server Component Issues:'));
    
    const loadingFile = join(this.appDir, 'loading.tsx');
    if (existsSync(loadingFile)) {
      const content = readFileSync(loadingFile, 'utf8');
      if (content.includes('styled-jsx') || content.includes('style jsx')) {
        console.log(colors.red('❌ loading.tsx uses styled-jsx (not allowed in Server Components)'));
      } else {
        console.log(colors.green('✅ loading.tsx is Server Component compatible'));
      }
    }
    
    const layoutFile = join(this.appDir, 'layout.tsx');
    if (existsSync(layoutFile)) {
      const content = readFileSync(layoutFile, 'utf8');
      if (content.includes("'use client'")) {
        console.log(colors.yellow('⚠️ layout.tsx uses client directive (consider server-side rendering)'));
      } else {
        console.log(colors.green('✅ layout.tsx is Server Component'));
      }
    }
  }

  private suggestFixes(): void {
    console.log(colors.yellow('\n🛠️ Suggested Fixes:'));

    const hasRootPage = this.routes.some(r => r.type === 'page' && r.path === 'page.tsx');
    const hasRootLayout = this.routes.some(r => r.type === 'layout' && r.path === 'layout.tsx');

    if (!hasRootLayout) {
      console.log(colors.red('❌ Missing app/layout.tsx'));
      console.log(colors.gray('   Will auto-create server-compatible layout'));
    }

    if (!hasRootPage) {
      console.log(colors.red('❌ Missing app/page.tsx'));
      console.log(colors.gray('   Will auto-create with client-side Web8TabSystem'));
    }

    if (!existsSync(join(process.cwd(), 'components', 'Web8TabSystem.tsx'))) {
      console.log(colors.red('❌ Missing Web8TabSystem component'));
      console.log(colors.gray('   Component needed for main functionality'));
    }

    // Check package.json scripts
    const packageJsonPath = join(process.cwd(), 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      const missingScripts = [
        'dev:quick',
        'check:routes', 
        'debug:routes',
        'push',
        'kontroll',
        'teste'
      ];
      
      const missing = missingScripts.filter(script => !packageJson.scripts[script]);
      if (missing.length > 0) {
        console.log(colors.red(`❌ Missing package.json scripts: ${missing.join(', ')}`));
        console.log(colors.gray('   Will add missing scripts'));
      }
    }

    console.log(colors.green('\n✅ Auto-fix available:'));
    console.log(colors.cyan('Run this checker with --fix flag to auto-repair'));
  }

  private autoFix(): void {
    const shouldFix = process.argv.includes('--fix') || process.argv.includes('-f');
    
    if (!shouldFix) {
      console.log(colors.blue('\n💡 Add --fix flag to auto-repair issues'));
      return;
    }

    console.log(colors.blue('\n🔧 Auto-fixing issues...'));

    // Fix missing app files
    this.fixMissingAppFiles();
    
    // Fix package.json scripts
    this.fixPackageJsonScripts();
    
    // Fix server component issues
    this.fixServerComponentIssues();

    console.log(colors.green('\n🎉 Auto-fix completed!'));
  }

  private fixMissingAppFiles(): void {
    const hasRootPage = this.routes.some(r => r.type === 'page' && r.path === 'page.tsx');
    const hasRootLayout = this.routes.some(r => r.type === 'layout' && r.path === 'layout.tsx');

    if (!hasRootLayout || !hasRootPage) {
      this.createBasicFiles();
    }
  }

  private fixPackageJsonScripts(): void {
    const packageJsonPath = join(process.cwd(), 'package.json');
    if (!existsSync(packageJsonPath)) {return;}

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    const scriptsToAdd = {
      'dev:quick': 'next dev --port 3001',
      'check:routes': 'tsx scripts/check-routes.ts',
      'debug:routes': 'tsx scripts/check-routes.ts --fix',
      'push': 'tsx scripts/project-control.ts push',
      'kontroll': 'tsx scripts/project-control.ts',
      'teste': 'tsx scripts/project-control.ts test',
      'ts:check': 'tsx scripts/ts-only-check.ts',
      'fix:routes': 'tsx scripts/check-routes.ts --fix',
      'openmind': 'tsx scripts/openmind-setup.ts',
      'ai:chat': 'next dev --port 3001 && open http://localhost:3001/openmind',
      'domain:setup': 'tsx scripts/domain-setup.ts',
      'domain:verify': 'curl -I https://euroweb.ai',
      'deploy:production': 'vercel --prod',
      'deploy:preview': 'vercel',
      'deploy': 'tsx scripts/deploy.ts',
      'deploy:vercel': 'tsx scripts/deploy.ts vercel production',
      'deploy:docker': 'tsx scripts/deploy.ts docker production',
      'docker:build': 'docker build -t euroweb-platform .',
      'docker:run': 'docker run -d -p 3001:3000 --name euroweb euroweb-platform',
      'docker:stop': 'docker stop euroweb && docker rm euroweb',
      'docker:logs': 'docker logs euroweb -f'
    };

    let modified = false;
    for (const [script, command] of Object.entries(scriptsToAdd)) {
      if (!packageJson.scripts[script]) {
        packageJson.scripts[script] = command;
        modified = true;
        console.log(colors.green(`✅ Added script: ${script}`));
      }
    }

    if (modified) {
      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(colors.green('✅ Updated package.json scripts'));
    }
  }

  private fixServerComponentIssues(): void {
    const loadingFile = join(this.appDir, 'loading.tsx');
    if (existsSync(loadingFile)) {
      const content = readFileSync(loadingFile, 'utf8');
      if (content.includes('styled-jsx') || content.includes('style jsx')) {
        const fixedContent = `export default function Loading() {
  return (
    <div className={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1d29 0%, #2d2a45 30%)',
      color: '#f8fafc'
    }}>
      <div className={{ textAlign: 'center' }}>
        <div className={{
          width: '60px',
          height: '60px',
          border: '3px solid #d4af37',
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <h2 className={{ color: '#d4af37' }}>🚀 EuroWeb Platform</h2>
        <p>AGI Core po inicializohet...</p>
      </div>
    </div>
  )
}
`;
        writeFileSync(loadingFile, fixedContent);
        console.log(colors.green('✅ Fixed loading.tsx server component issue'));
      }
    }
  }
}

// Run the checker - Pure TypeScript
export const runRouteChecker = (): void => {
  const checker = new RouteChecker();
  checker.checkRoutes();
};

// ES Module execution
const command = process.argv[2];
if (command === 'check' || !command) {
  runRouteChecker();
}
