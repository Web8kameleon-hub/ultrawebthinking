import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        plugins: {
            '@typescript-eslint': typescriptEslint
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            'no-console': 'off',
            // Allow inline styles - projekti ynë përdor inline CSS
            'react/forbid-dom-props': 'off',
            'react/no-inline-styles': 'off'
        }
    },
    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'dist/**',
            'build/**',
            'coverage/**',
            'styled-system/**'
        ]
    }
];
