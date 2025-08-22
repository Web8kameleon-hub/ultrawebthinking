import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import type { Linter } from 'eslint';

const config: Linter.FlatConfig[] = [
  // Ignores - vendos fillimisht
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'styled-system/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      '*.config.mts',
      'next-env.d.ts',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.js', // Skip JS files for now
      'public/sw.ts', // Service worker has different globals
      'scripts/**', // Scripts can have console.log
      'vitest.setup.*'
    ]
  },
  
  // Konfigurimi bazë
  js.configs.recommended,
  
  // Konfigurimi për TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Browser globals
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        HTMLElement: 'readonly',
        ImageData: 'readonly',
        AudioBuffer: 'readonly',
        Notification: 'readonly',
        performance: 'readonly',
        
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        
        // Service Worker globals
        self: 'readonly',
        caches: 'readonly',
        ServiceWorkerGlobalScope: 'readonly',
        
        // React globals
        React: 'readonly',
        ReactDOM: 'readonly',
        JSX: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint as any
    },
    rules: {
      // TypeScript specifike
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'off', // Too many to fix right now
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'warn',
      
      // Vanilla JS/TS
      'no-console': 'off', // Allow console for now
      'no-debugger': 'error',
      'no-unused-vars': 'off', // përdor TypeScript version
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      'no-undef': 'off', // TypeScript handles this
      
      // Code quality - make less strict for now
      'eqeqeq': 'warn',
      'curly': 'warn',
      'semi': ['warn', 'always'],
      'no-useless-escape': 'warn',
      'no-case-declarations': 'warn',
      'no-unreachable': 'warn'
    }
  },
  
  // Special rules for scripts directory
  {
    files: ['scripts/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },
  
  // Special rules for test files
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', 'vitest.setup.*'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  
  // Konfigurimi për Next.js faqet
  {
    files: ['app/**/*', 'pages/**/*'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-console': 'off' // lejon console.log në development
    }
  },
  
  // Special rules for Next.js error pages
  {
    files: ['**/error.tsx', '**/error.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off' // Next.js error pages have required props
    }
  }
];

export default config;
