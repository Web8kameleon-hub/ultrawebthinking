// @ts-strict
/**
 * Vitest Configuration - Web8 Industrial Testing
 * REAL API testing, ZERO DOM simulation, ZERO jsdom
 * Pure TypeScript + Real fetch + Real components
 */

import { defineConfig } from "vitest/config";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node', // NO jsdom - Real Node.js environment only
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.js', // NO .js files allowed
      '**/.next/**',
      '**/coverage/**'
    ],
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        '**/.next/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@/': resolve(__dirname, './'),
      '@/components': resolve(__dirname, './components'),
      '@/lib': resolve(__dirname, './lib'),
      '@/utils': resolve(__dirname, './utils'),
      '@/types': resolve(__dirname, './types')
    }
  },
  esbuild: {
    target: 'node18'
  },
  optimizeDeps: {
    include: [
      'react',
      '@testing-library/react',
      '@testing-library/jest-dom'
    ]
  }
});
