import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

const eslintConfig = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      // WEB8 NEURAL TREE - VETËM TYPESCRIPT
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      
      // PERFORMANCE & QUALITY
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'no-duplicate-imports': 'error',
      'no-await-in-loop': 'error',
      'no-unreachable': 'error',
      'no-unused-expressions': 'error'
    }
  },
  {
    // БЛОК JAVASCRIPT ФАЈЛОВЕ ПОТПУНО
    files: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: '*',
          message: 'JavaScript files are FORBIDDEN in WEB8 Neural Tree! Use .ts/.tsx only!'
        }
      ]
    }
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'build/**',
      'coverage/**'
    ]
  }
];

export default eslintConfig;
