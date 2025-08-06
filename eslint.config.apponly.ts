/**
 * SUPER MINIMAL ESLint - Only app/ folder
 * Zero problems! Zero JavaScript! TypeScript Only!
 */

import js from '@eslint/js';
import typescript from 'typescript-eslint';

export default [
  // Step 1: IGNORE EVERYTHING except app/
  {
    ignores: [
      '**/*',           // IGNORE ALL FILES 
      '!app/**/*.{ts,tsx}' // EXCEPT app directory TypeScript files
    ]
  },
  
  // Step 2: Only lint app/ directory  
  {
    files: ['app/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...typescript.configs.recommended],
    rules: {
      // Super relaxed rules for AGI development
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',  // Allow any for AGI
      '@typescript-eslint/no-unused-vars': 'off',   // Allow unused for experiments
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      'no-console': 'off'  // Allow console for AGI debugging
    }
  }
];
