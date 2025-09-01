/**
 * ESLint Configuration - EuroWeb Ultra
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        globalThis: 'readonly',
        // Jest globals
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Basic JavaScript/TypeScript rules
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-undef': 'error',
      'no-duplicate-imports': 'error',
      'no-unreachable': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
    },
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/__tests__/**/*'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: {
      'no-console': 'off', // Allow console in tests
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      '*.min.js',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
    ],
  },
];

export default config;
