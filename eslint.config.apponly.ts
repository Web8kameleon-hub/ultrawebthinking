/**
 * SUPER MINIMAL ESLint - Only app/ folder
 * Zero problems! Zero JavaScript! TypeScript Only!
 */

import js from '@eslint/js';
// @ts-ignore - typescript-eslint import issue
import typescript from 'typescript-eslint';

export default [
  // Step 1: Global ignores - everything except app/
  {
    ignores: [
      'backend/**',
      'components/**', 
      'lib/**',
      'hooks/**',
      'types/**',
      'utils/**',
      'scripts/**',
      'test/**',
      'tests/**',
      '__tests__/**',
      '**/*.test.*',
      '**/*.spec.*',
      '*.config.*',
      '*.setup.*',
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      '*.d.ts',
      '*-backup.*'
    ]
  },
  
  // Step 2: Base JS config
  js.configs.recommended,
  
  // Step 3: TypeScript configs
  ...typescript.configs.recommended,
  
  // Step 4: Only lint app/ directory  
  {
    files: ['app/**/*.{ts,tsx}'],
    rules: {
      // Super relaxed rules for AGI development
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',  // Allow any for AGI
      '@typescript-eslint/no-unused-vars': 'off',   // Allow unused for experiments
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      'no-console': 'off',  // Allow console for AGI debugging
      'no-case-declarations': 'off'  // Allow case declarations for dynamic imports
    }
  }
];
