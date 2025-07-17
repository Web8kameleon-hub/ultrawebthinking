/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Global test setup
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    
    // Coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '.next/',
        'styled-system/',
        '**/*.config.{js,ts}',
        '**/*.d.ts'
      ]
    },

    // Test file patterns
    include: [
      'tests/**/*.{test,spec}.{js,ts,tsx}',
      '**/__tests__/**/*.{js,ts,tsx}'
    ],
    
    // Exclude patterns
    exclude: [
      'node_modules/',
      'dist/',
      '.next/',
      'build/',
      'coverage/'
    ],

    // Test timeout
    testTimeout: 5000,
    hookTimeout: 10000,

    // Reporters
    reporters: ['verbose', 'html'],

    // UI settings
    ui: true,
    open: false
  },

  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/utils': path.resolve(__dirname, 'utils'),
      '@/styles': path.resolve(__dirname, 'styles'),
      '@/ai': path.resolve(__dirname, 'ai'),
      '@/tests': path.resolve(__dirname, 'tests')
    }
  },

  // ESBuild options
  esbuild: {
    target: 'es2020'
  }
})
