// vitest.config.ts - Robust Vitest Configuration for EuroWeb
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      '__tests__/**/*.{test,spec}.{ts,tsx}',
      '**/*.{test,spec}.{ts,tsx}'
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      'out/**',
      '**/*.d.ts',
      '**/*.java',
      '**/*.jar',
      '**/*.class'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'components/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'app/**/*.{ts,tsx}',
        'agisheet/**/*.{ts,tsx}',
        'backend/**/*.{ts,tsx}'
      ],
      exclude: [
        '**/*.d.ts',
        'node_modules/**',
        '__tests__/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/*.java',
        '**/*.jar',
        '**/*.class'
      ]
    },
    testTimeout: 10000,
    hookTimeout: 10000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@/components': resolve(__dirname, 'components'),
      '@/lib': resolve(__dirname, 'lib'),
      '@/app': resolve(__dirname, 'app'),
      '@/agisheet': resolve(__dirname, 'agisheet'),
      '@/backend': resolve(__dirname, 'backend')
    }
  },
  define: {
    'process.env.NODE_ENV': '"test"'
  }
});
