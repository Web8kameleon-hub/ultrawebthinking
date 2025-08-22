// eslint.config.mjs - ESLint Configuration for Web8

const config = [
  {
    ignores: [
      'node_modules/',
      '.next/',
      'dist/',
      'build/',
      'coverage/',
      'styled-system/',
      'patterns/',
      'tokens/',
      'css/',
      'public/sw.js',
      '**/*.d.ts',
      '__tests__/',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs'
    ]
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
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
        document: 'readonly',
        navigator: 'readonly',
        React: 'readonly'
      }
    },
    rules: {
      // TypeScript best practices
      'no-console': 'warn',
      'no-unused-vars': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-debugger': 'error',
      'eqeqeq': 'error',
      'curly': 'error',
      
      // Import/Export - NAMED EXPORTS ONLY for components/libs/utils
      'no-duplicate-imports': 'error',
      
      // Pure TypeScript enforcement
      'no-restricted-file-extensions': 'off'
    }
  }
];

export default config;
