/**
 * EuroWeb Web8 Platform - Pastruesi Automatik
 * Script industrial per pastrimin automatik te projektit
 * 
 * @author Ledjan Ahmati (100% Pronar)
 * @contact dealsjona@gmail.com  
 * @version 8.0.0 Industrial
 * @license MIT
 */

import fs from 'fs';
import path from 'path';

// Files qe duhet te fshihen plotesisht
const FILES_TO_DELETE = [
  // JavaScript files
  '.config.js', '.setup.js', 'next.config.js',
  'app/page.simple.js', 'yarn.lock', 'package-lock.json',
  
  // Python files
  'backend/agi_core.py', 'backend/database.py', 'backend/main.py',
  'backend/requirements.txt', 'backend/start_agi.py', 'backend/test_agi.py',
  
  // Shell scripts
  'activate.ps1', 'activate.sh', 'deploy.sh', 'setup.sh', 'setup_env.sh',
  'docker-build.sh', 'scripts/dev-clean.ps1', 'scripts/web8-guard.sh',
  
  // Docker files (keep only Dockerfile)
  'docker-compose.yml', 'Dockerfile.new',
  
  // Config files
  'nginx.conf', 'tsconfig.tsbuildinfo',
  
  // Misc files
  'LICENSE', 'privatekey', 'publickey',
  'console . log', 'console.log', 'monitor . ts',
  'et --hard abc123git status', 'h origin main --force',
  'himet nga repo', 'Agi Core Module', 'AGI-AI avanced',
  'class Governance', 'CrossShardTransaction', 'Debuglevel', 'Nodes',
  
  // Public files (keep only needed ones)
  'public/favicon.ico', 'public/index.html', 'public/robots.txt',
  
  // Styled-system generated files (will be regenerated)
  '/',
  
  // Style backups
  'styles/globals.css.save',
  
  // Ultrawebthinking duplicates
  'ultrawebthinking/',
  
  // Duplicate configs
  'CUltraBuildweb8frontendtsconfig.json', 'CUltraBuildweb8package.json',
  'package-fresh.json', 'tsconfig.clean.json', 'next.config.old.mts'
];

// Directories te plota qe duhet te fshihen
const DIRS_TO_DELETE = [
  '',
  'ultrawebthinking'
];

// Zëvendësimet ne përmbajtje
const CONTENT_REPLACEMENTS = [
  // Hiq Tailwind nga CSS
  { from: '/* Pure CSS - No Tailwind */', to: '/* Pure CSS - No Tailwind */' },
  { from: '', to: '' },
  { from: '', to: '' },
  
  // Hiq hooks
  { from: '', to: '' },
  { from: '', to: '' },
  { from: '', to: '' },
  { from: '', to: '' },
  { from: '', to: '' },
  { from: '', to: '' },
  { from: '', to: '' },
  
  // Hiq className usage
  { from: 'function', to: 'function' },
  { from: '', to: '' },
  { from: '.then(', to: '.then(' },
  { from: '.catch(', to: '.catch(' },
  { from: 'Promise.all', to: 'Promise.all' },
  { from: 'Promise.race', to: 'Promise.race' },
  
  // Hiq imports te ndaluar
  { from: "// NO STYLED-SYSTEM", to: "// NO STYLED-SYSTEM" },
  { from: "// NO STYLED-SYSTEM", to: "// NO STYLED-SYSTEM" },
  { from: "// NO META IMPORTS", to: "// NO META IMPORTS" },
  { from: "// NO META IMPORTS", to: "// NO META IMPORTS" },
  { from: "// NO META IMPORTS", to: "// NO META IMPORTS" },
  
  // Jest -> Vitest
  { from: '', to: '' },
  { from: '@/ui', to: '@/ui' },
  
  // Hiq JS extensions
  { from: '.ts"', to: '.ts"' },
  { from: '.tsx"', to: '.tsx"' },
  { from: '.mts"', to: '.mts"' },
  { from: '.cts"', to: '.cts"' }
];

class EuroWebCleaner {
  private deletedFiles = 0;
  private cleanedFiles = 0;
  private errors: string[] = [];

  public async clean(): Promise<void> {
    console.log('🧹 EuroWeb Web8 - AUTOMATIC CLEANER');
    console.log('🚀 Transforming to Pure Industrial Architecture');
    console.log('👨‍💻 Autor: Ledjan Ahmati (100% Pronar)');
    console.log('');

    // 1. Delete forbidden files
    this.deleteFiles();
    
    // 2. Delete forbidden directories
    this.deleteDirectories();
    
    // 3. Clean file contents
    this.cleanContents();
    
    // 4. Generate clean package.json
    this.cleanPackageJson();
    
    // 5. Generate clean tsconfig.json
    this.cleanTsConfig();
    
    // 6. Clean globals.css
    this.cleanGlobalsCss();
    
    this.showResults();
  }

  private async deleteFiles(): Promise<void> {
    console.log('🗑️  Deleting forbidden files...');
    
    for (const file of FILES_TO_DELETE) {
      try {
        const fullPath = path.resolve(file);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`   ✅ Deleted: ${file}`);
          this.deletedFiles++;
        }
      } catch (error) {
        this.errors.push(`Failed to delete ${file}: ${error}`);
      }
    }
  }

  private async deleteDirectories(): Promise<void> {
    console.log('📁 Deleting forbidden directories...');
    
    for (const dir of DIRS_TO_DELETE) {
      try {
        const fullPath = path.resolve(dir);
        if (fs.existsSync(fullPath)) {
          fs.rmSync(fullPath, { recursive: true, force: true });
          console.log(`   ✅ Deleted directory: ${dir}`);
          this.deletedFiles++;
        }
      } catch (error) {
        this.errors.push(`Failed to delete directory ${dir}: ${error}`);
      }
    }
  }

  private async cleanContents(): Promise<void> {
    console.log('🧼 Cleaning file contents...');
    
    this.cleanDirectory('.');
  }

  private cleanDirectory(dir: string): void {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !this.shouldIgnoreDir(item)) {
        this.cleanDirectory(fullPath);
      } else if (stat.isFile() && this.shouldCleanFile(fullPath)) {
        this.cleanFileContent(fullPath);
      }
    }
  }

  private shouldIgnoreDir(name: string): boolean {
    const ignoreDirs = ['node_modules', '.git', '.next', 'dist', 'coverage', '.yarn'];
    return ignoreDirs.includes(name) || name.startsWith('.');
  }

  private shouldCleanFile(filePath: string): boolean {
    const ext = path.extname(filePath);
    return ['.ts', '.tsx', '.mts', '.json', '.css'].includes(ext);
  }

  private cleanFileContent(filePath: string): void {
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      let changed = false;

      for (const replacement of CONTENT_REPLACEMENTS) {
        if (content.includes(replacement.from)) {
          content = content.replace(new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement.to);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`   🧼 Cleaned: ${path.relative('.', filePath)}`);
        this.cleanedFiles++;
      }
    } catch (error) {
      this.errors.push(`Failed to clean ${filePath}: ${error}`);
    }
  }

  private async cleanPackageJson(): Promise<void> {
    console.log('📦 Generating clean package.json...');
    
    const cleanPackage = {
      "name": "euroweb-platform",
      "version": "8.0.0",
      "description": "EuroWeb - Pure TypeScript Industrial Web8 Platform",
      "private": true,
      "type": "module",
      "scripts": {
        "dev": "next dev --port 3000",
        "build": "next build",
        "start": "next start",
        "test": " run",
        "test:watch": "",
        "test:ui": " --ui",
        "test:coverage": " --coverage",
        "type-check": "tsc --noEmit",
        "tech:guard": "tsx scripts/tech-guard.ts",
        "clean": "rimraf dist .next coverage",
        "clean:all": "yarn clean && rimraf node_modules && yarn install"
      },
      "dependencies": {
        "next": "^14.2.0",
        "react": "^18.3.0",
        "react-dom": "^18.3.0",
        "typescript": "^5.8.3",
        "framer-motion": "^11.5.0"
      },
      "devDependencies": {
        "typescript": "^5.7.2",
        "@types/node": "^22.15.18",
        "@types/react": "^19.1.4",
        "@types/react-dom": "^19.1.5",
        "@/ui": "^2.0.0",
        "@/coverage-v8": "^2.0.0",
        "": "^2.0.0",
        "jsdom": "^25.0.0",
        "rimraf": "^6.0.1",
        "tsx": "^4.19.0",
        "@typescript-eslint/eslint-plugin": "^8.15.0",
        "@typescript-eslint/parser": "^8.15.0"
      },
      "engines": {
        "node": ">=18.0.0",
        "yarn": ">=1.22.22",
        "npm": "please-use-yarn"
      },
      "author": {
        "name": "Ledjan Ahmati",
        "email": "dealsjona@gmail.com"
      },
      "license": "MIT"
    };

    fs.writeFileSync('package.json', JSON.stringify(cleanPackage, null, 2));
    console.log('   ✅ Generated clean package.json');
  }

  private async cleanTsConfig(): Promise<void> {
    console.log('🔧 Generating clean tsconfig.json...');
    
    const cleanTsConfig = {
      "compilerOptions": {
        "target": "ES2022",
        "lib": ["dom", "dom.iterable", "ES6"],
        "allowJs": false,
        "skipLibCheck": true,
        "strict": true,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "incremental": true,
        "plugins": [{ "name": "next" }],
        "baseUrl": ".",
        "paths": {
          "@/*": ["./*"]
        }
      },
      "include": [
        "next-env.d.ts",
        "**/*.ts",
        "**/*.tsx",
        "**/*.mts",
        ".next/types/**/*.ts"
      ],
      "exclude": [
        "node_modules",
        ".next",
        "dist",
        "**/*.ts",
        "**/*.tsx"
      ]
    };

    fs.writeFileSync('tsconfig.json', JSON.stringify(cleanTsConfig, null, 2));
    console.log('   ✅ Generated clean tsconfig.json');
  }

  private async cleanGlobalsCss(): Promise<void> {
    console.log('🎨 Generating clean globals.css...');
    
    const cleanCss = `/* EuroWeb Web8 Platform - Pure CSS Styling */
/* Pure TypeScript Industrial Architecture - No Tailwind */

:root {
  --euroweb-primary: #d4af37;
  --euroweb-secondary: #b8982d;
  --euroweb-bg-primary: #1a1d29;
  --euroweb-bg-secondary: #2d2a45;
  --euroweb-text-primary: #f8fafc;
  --euroweb-text-secondary: #cbd5e1;
  --euroweb-border: rgba(212, 175, 55, 0.3);
  --euroweb-accent: #22c55e;
  --euroweb-warning: #f59e0b;
  --euroweb-error: #ef4444;
}

/* AGI Loading Animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.agi-spinner {
  animation: spin 1s linear infinite;
}

/* Global Reset */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--euroweb-bg-primary);
  color: var(--euroweb-text-primary);
}

/* EuroWeb Industrial Styling */
.euroweb-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f1419 0%, #1a1d29 25%, #2d2a45 50%, #1e2a4a 75%, #243447 100%);
}

.euroweb-button {
  background: var(--euroweb-primary);
  color: #000;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.euroweb-button:hover {
  background: var(--euroweb-secondary);
  transform: translateY(-1px);
}

.euroweb-card {
  background: rgba(45, 52, 70, 0.8);
  border: 1px solid var(--euroweb-border);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.euroweb-text-primary {
  color: var(--euroweb-text-primary);
}

.euroweb-text-secondary {
  color: var(--euroweb-text-secondary);
}

.euroweb-text-accent {
  color: var(--euroweb-accent);
}

.euroweb-text-gold {
  color: var(--euroweb-primary);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
}

p {
  line-height: 1.6;
}

/* Links */
a {
  color: var(--euroweb-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--euroweb-secondary);
}

/* Form Elements */
input, textarea, select {
  background: rgba(45, 52, 70, 0.8);
  border: 1px solid var(--euroweb-border);
  border-radius: 6px;
  padding: 8px 12px;
  color: var(--euroweb-text-primary);
  font-size: 14px;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--euroweb-primary);
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
}

/* Utility Classes */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.text-center {
  text-align: center;
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

.min-h-screen {
  min-height: 100vh;
}

.p-4 {
  padding: 1rem;
}

.m-4 {
  margin: 1rem;
}

.rounded {
  border-radius: 6px;
}

.shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .euroweb-card {
    padding: 16px;
  }
  
  .euroweb-button {
    padding: 10px 14px;
    font-size: 14px;
  }
}
`;

    fs.writeFileSync('app/globals.css', cleanCss);
    console.log('   ✅ Generated clean globals.css');
  }

  private showResults(): void {
    console.log('');
    console.log('📊 CLEANING RESULTS:');
    console.log('='.repeat(50));
    console.log(`🗑️  Files/dirs deleted: ${this.deletedFiles}`);
    console.log(`🧼 Files cleaned: ${this.cleanedFiles}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('');
      console.log('❌ ERRORS:');
      this.errors.forEach(error => console.log(`   ${error}`));
    }
    
    console.log('');
    console.log('🎉 CLEANING COMPLETE!');
    console.log('');
    console.log('✅ EuroWeb Web8 Industrial Architecture:');
    console.log('   🔹 Pure TypeScript + ESM');
    console.log('   🔹 No JavaScript files');
    console.log('   🔹 No React hooks');
    console.log('   🔹 No Tailwind CSS');
    console.log('   🔹 No Jest (Vitest only)');
    console.log('   🔹 No async/await');
    console.log('   🔹 Vanilla CSS + Framer Motion');
    console.log('');
    console.log('🚀 Ready for AGI Development!');
    console.log('');
    console.log('⚡ Next Steps:');
    console.log('   1. yarn install');
    console.log('   2. yarn tech:guard');
    console.log('   3. yarn dev');
  }
}

// Run the cleaner
const cleaner = new EuroWebCleaner();
cleaner.clean().catch(console.error);
