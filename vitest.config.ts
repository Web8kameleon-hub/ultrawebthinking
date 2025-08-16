/**
 * Vitest Configuration - Pure TypeScript Testing
 * ZERO jest, ZERO chunks, industrial testing
 */

import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/*.js', // NO .js files allowed
      '**/*jest*', // NO jest files
      '**/*chunk*' // NO chunk files
    ],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.js', // NO .js coverage
        '**/*jest*',
        '**/*chunk*'
      ]
    },
    // Pure TypeScript performance
    isolate: true,
    pool: 'threads',
    maxConcurrency: 8
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@/components': resolve(__dirname, './components'),
      '@/lib': resolve(__dirname, './lib'),
      '@/utils': resolve(__dirname, './utils')
    }
  },
  // Optimize for industrial use
  optimizeDeps: {
    include: [
      'vitest',
      '@testing-library/react',
      '@testing-library/user-event',
      '@testing-library/jest-dom',
      '@popperjs/core'
    ],
    exclude: [
      'jest', // FORBIDDEN
      'chunks', // FORBIDDEN
      'useState' // FORBIDDEN (this won't work but shows intent)
    ]
  }
});
