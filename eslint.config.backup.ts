/**
 * Minimal ESLint Configuration for AGI Project
 * Only lints essential files
 */

import js from '@eslint/js';
import typescript from 'typescript-eslint';

export default [
  // Global ignores - MUST be first
  {
    ignores: [
      '**/*.js',
      '**/*.mjs', 
      '**/*.cjs',
      '*.config.*',
      '__tests__/**',
      'test-*',
      '*-backup.*',
      'logs/**',
      'docs/**',
      'scripts/**',
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**'
    ]
  },
  
  // Apply rules only to app directory
  {
    files: ['app/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...typescript.configs.recommended],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'off'
    }
  }
];