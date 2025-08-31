// eslint.config.mjs - Simple ESLint Configuration for EuroWeb Ultra

const config = [
  // Ignore patterns
  {
    ignores: [
      'node_modules/',
      '.next/',
      'dist/',
      'build/',
      'coverage/',
      'public/',
      'src/',
      'index.html',
      'vite.config.ts',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.config.ts'
    ]
  },
  
  // Main configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        React: 'readonly'
      }
    },
    rules: {
      // Basic rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-duplicate-imports': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      
      // Disable some strict rules for development
      'no-unused-expressions': 'warn',
      'no-undef': 'off', // TypeScript handles this
    }
  }
];

export default config;
