/**
 * ESLint Configuration - EuroWeb Platform v9.0.1 Ultra
 * Industrial-Grade TypeScript/React Linting & Code Quality
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 9.0.1 Ultra Industrial
 * @license MIT
 * @created August 25, 2025
 */

import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      // 🚀 TypeScript Industrial Rules
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-shadow': 'error',

      // 🏭 General Industrial Rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-unused-vars': 'off', // Using TypeScript version
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': 'error',
      'curly': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'object-shorthand': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-return': 'error',
      'no-useless-concat': 'error',
      'no-throw-literal': 'error',
      'require-await': 'error',
      'no-param-reassign': 'error',
      'no-shadow': 'off', // Using TypeScript version
      'spaced-comment': 'error',
      'yoda': 'error'
    }
  },

  // 🧪 Test files configuration
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser
    },
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': 'off'
    }
  },

  // 📁 Ignore patterns
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.min.js',
      '.git/**',
      'public/**',
      '*.d.ts'
    ]
  }
]
