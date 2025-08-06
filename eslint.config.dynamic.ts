/**
 * ESLint Configuration - Dynamic AGI Project
 * Configured for real-time, live, interactive AGI systems
 * No static limitations - optimized for dynamic intelligence
 */

import js from '@eslint/js';
import { config, configs } from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import tsParser from '@typescript-eslint/parser';

const eslintConfig = config(
  // Base JavaScript recommendations
  js.configs.recommended,
  
  // TypeScript configurations
  ...configs.recommended,
  ...configs.stylistic,
  
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
          modules: true,
          globalReturn: false
        },
        project: './tsconfig.json'
      },
      globals: {
        // Browser globals for live/dynamic functionality
        fetch: 'readonly',
        WebSocket: 'readonly',
        EventSource: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        // Node.js globals for API routes
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        // Next.js globals
        module: 'readonly',
        require: 'readonly'
      }
    },
    
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin
    },
    
    rules: {
      // === DYNAMIC/LIVE SYSTEM OPTIMIZATIONS ===
      
      // Allow any type for dynamic AGI responses
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      
      // Allow dynamic imports for live functionality
      '@typescript-eslint/no-require-imports': 'off',
      'import/no-dynamic-require': 'off',
      
      // Allow console for live debugging and AGI feedback
      'no-console': 'off',
      
      // Allow unused vars for dynamic parameters
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
      
      // Allow empty functions for event handlers
      '@typescript-eslint/no-empty-function': 'off',
      
      // Allow non-null assertions for real-time data
      '@typescript-eslint/no-non-null-assertion': 'off',
      
      // === REACT/JSX OPTIMIZATIONS ===
      
      // React hooks for real-time updates
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Allow missing React import (Next.js handles this)
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      
      // Allow dynamic children for AGI content
      'react/no-children-prop': 'off',
      'react/no-danger': 'off',
      'react/no-unescaped-entities': 'off',
      
      // === ACCESSIBILITY FOR AGI INTERFACES ===
      
      // Relax a11y for dynamic AGI interfaces
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      
      // === IMPORT/EXPORT OPTIMIZATIONS ===
      
      // Allow relative imports for modular AGI components
      'import/no-relative-packages': 'off',
      'import/no-unresolved': 'off', // Next.js handles path resolution
      
      // === CODE QUALITY FOR LIVE SYSTEMS ===
      
      // Allow bitwise for performance optimizations
      'no-bitwise': 'off',
      
      // Allow continue/break for control flow
      'no-continue': 'off',
      
      // Allow nested ternary for compact AGI logic
      'no-nested-ternary': 'off',
      
      // Allow underscore dangle for private methods
      'no-underscore-dangle': 'off',
      
      // Allow param reassign for performance
      'no-param-reassign': 'off',
      
      // Allow plusplus for loops
      'no-plusplus': 'off',
      
      // === PERFORMANCE OPTIMIZATIONS ===
      
      // Prefer const for immutability
      'prefer-const': 'error',
      
      // Use template literals
      'prefer-template': 'warn',
      
      // Arrow function consistency
      'prefer-arrow-callback': 'warn',
      
      // === STYLE CONSISTENCY ===
      
      // Indent with 2 spaces
      'indent': ['error', 2, { SwitchCase: 1 }],
      
      // Single quotes
      'quotes': ['error', 'single', { allowTemplateLiterals: true }],
      
      // Semicolons
      'semi': ['error', 'always'],
      
      // Trailing commas
      'comma-dangle': ['error', 'never'],
      
      // Object spacing
      'object-curly-spacing': ['error', 'always'],
      
      // Array spacing
      'array-bracket-spacing': ['error', 'never'],
      
      // Function spacing
      'space-before-function-paren': ['error', 'never']
    },
    
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json'
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    }
  },
  
  // API Routes specific configuration
  {
    files: ['app/api/**/*.ts', 'pages/api/**/*.ts'],
    rules: {
      // Allow any for API responses
      '@typescript-eslint/no-explicit-any': 'off',
      
      // Allow require for dynamic imports
      '@typescript-eslint/no-require-imports': 'off',
      
      // Allow console for API logging
      'no-console': 'off'
    }
  },
  
  // Test files configuration
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      // Allow any in tests
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      
      // Allow non-null assertions in tests
      '@typescript-eslint/no-non-null-assertion': 'off'
    }
  },
  
  // Configuration files
  {
    files: ['*.config.{js,ts,mjs}', '*.setup.{js,ts}'],
    rules: {
      // Allow require in config files
      '@typescript-eslint/no-require-imports': 'off',
      
      // Allow any in configurations
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
);

export default eslintConfig;
