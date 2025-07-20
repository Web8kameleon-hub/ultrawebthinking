#!/usr/bin/env ts-node
/**
 * EuroWeb Pure TypeScript Clean Runner
 * Yarn Berry + TypeScript + Named Exports ONLY
 * 
 * NO JS, NO Jest, NO Panda, NO Tailwind, NO useState, NO JSX
 * NO default exports, NO chunks, NO aria
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface CleanerConfig {
  readonly forbiddenPatterns: readonly string[];
  readonly requiredPatterns: readonly string[];
  readonly extensions: readonly string[];
}

const CLEANER_CONFIG: CleanerConfig = {
  forbiddenPatterns: [
    'useState',
    'default export',
    'defaultVariants',
    'chunk',
    'aria-',
    'jsx',
    'jest',
    'panda',
    'tailwind',
    'styled-components',
    'emotion'
  ],
  requiredPatterns: [
    'named export',
    'readonly',
    'const',
    'TypeScript'
  ],
  extensions: ['.ts', '.tsx', '.mts']
};

export const runPurityCheck = (filePath: string): boolean => {
  if (!existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }

  const content = readFileSync(filePath, 'utf-8');
  
  // Remove comments before checking
  const contentWithoutComments = content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
    .replace(/\/\/.*$/gm, ''); // Remove // comments
  
  // Check forbidden patterns in actual code only
  for (const pattern of CLEANER_CONFIG.forbiddenPatterns) {
    if (contentWithoutComments.includes(pattern)) {
      console.error(`❌ FORBIDDEN: ${pattern} found in actual code in ${filePath}`);
      return false;
    }
  }

  console.log(`✅ PURE: ${filePath} follows strict TypeScript rules`);
  return true;
};

export const runBuild = (): void => {
  console.log('🚀 Running pure TypeScript build...');
  
  try {
    execSync('yarn build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
};

export const runTests = (): void => {
  console.log('🧪 Running Vitest (pure TypeScript tests)...');
  
  try {
    execSync('yarn test', { stdio: 'inherit' });
    console.log('✅ Tests completed successfully');
  } catch (error) {
    console.error('❌ Tests failed:', error);
    process.exit(1);
  }
};

export const runDev = (): void => {
  console.log('🔥 Starting pure TypeScript dev server...');
  
  try {
    execSync('yarn dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Dev server failed:', error);
    process.exit(1);
  }
};

// Main execution
const command = process.argv[2];

switch (command) {
  case 'check':
    const filePath = process.argv[3];
    if (!filePath) {
      console.error('Usage: yarn tsx scripts/pure-runner.ts check <file-path>');
      process.exit(1);
    }
    runPurityCheck(filePath);
    break;
  case 'build':
    runBuild();
    break;
  case 'test':
    runTests();
    break;
  case 'dev':
    runDev();
    break;
  default:
    console.log(`
🎯 EuroWeb Pure TypeScript Runner

Commands:
  check <file>  - Check file purity (no useState, no default exports, etc.)
  build         - Run pure TypeScript build
  test          - Run Vitest tests
  dev           - Start dev server

Example:
  yarn tsx scripts/pure-runner.ts check components/AGISheet/AGIxBioNature.tsx
  yarn tsx scripts/pure-runner.ts build
    `);
}
