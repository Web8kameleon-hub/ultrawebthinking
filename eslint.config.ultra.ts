/**
 * SUPER MINIMAL ESLint - Only app/ directory
 */

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**', 
      '**/build/**',
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      '**/*.d.ts',
      'types/**',
      'scripts/**',
      'backend/**',
      'security/**',
      'test/**',
      'tests/**',
      '__tests__/**',
      'agisheet/**',
      'ai/**',
      'components/**',
      'lib/**',
      'utils/**',
      'hooks/**',
      'config/**',
      'styles/**',
      'public/**',
      'Web8TabSystem-backup.tsx',
      'test-connection.ts',
      '*.config.*'
    ]
  },
  {
    files: ['app/**/*.{ts,tsx}'],
    rules: {
      // Turn off ALL problematic rules
      'no-console': 'off',
      'no-unused-vars': 'off'
    }
  }
];
