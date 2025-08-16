/**
 * Ultra Minimal ESLint Config for AGI Project
 * Only checks app/ directory - TypeScript only
 */

import js from '@eslint/js';
// @ts-ignore - typescript-eslint import issue
import typescript from 'typescript-eslint';

export default [
  // Global ignores - applies to ALL files
  {
    ignores: [
      '**/*.js',           // No JavaScript
      '**/*.mjs',          // No ES modules  
      '**/*.cjs',          // No CommonJS
      '**/*.test.*',       // No test files
      '**/*.spec.*',       // No spec files
      '__tests__/**',      // No test folder
      'scripts/**',        // No scripts
      'types/**',          // No types folder  
      'utils/**',          // No utils folder
      'lib/**',            // No lib folder
      'backend/**',        // No backend folder
      'components/**',     // No components folder
      'security/**',       // No security folder
      'agisheet/**',       // No agisheet folder
      'ai/**',             // No ai folder
      'test/**',           // No test folder
      'tests/**',          // No tests folder
      '*-backup.*',        // No backup files
      '*.d.ts',            // No declaration files
      '.next/**',          // No Next.js build
      'node_modules/**',   // No dependencies
      'dist/**',           // No dist folder
      'build/**'           // No build folder
    ]
  },
  
  // Only app directory gets linted
  {
    files: ['app/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...typescript.configs.recommended],
    rules: {
      // Minimal rules for AGI development
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn', 
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': 'off'  // Allow console for AGI debugging
    }
  }
];
