import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
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
      '**/*.spec.tsx'
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
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        window: 'readonly',
        document: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      // TypeScript specifike
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'error',
      
      // Vanilla JS/TS + Panda CSS
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // përdor TypeScript version
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Import/Export
      'no-duplicate-imports': 'error',
      
      // Framer Motion compatibility
      'prefer-arrow-callback': 'error',
      
      // Code quality
      'eqeqeq': 'error',
      'curly': 'error',
      'semi': ['error', 'always']
    }
  },
  
  // Konfigurimi për Next.js faqet
  {
    files: ['app/**/*', 'pages/**/*'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-console': 'off' // lejon console.log në development
    }
  }
];
