import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

/**
 * @author Ledjan Ahmati 
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@/components': resolve(__dirname, './components'),
      '@/lib': resolve(__dirname, './lib'),
      '@/hooks': resolve(__dirname, './hooks'),
      '@/backend': resolve(__dirname, './backend'),
      '@/app': resolve(__dirname, './app')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'agi-core': ['./lib/AGICore.ts', './lib/agiAnalytics.ts'],
          'agi-eco': ['./lib/agiEco.ts'],
          'agi-bio': ['./components/AGISheet/AGIBioNature.tsx'],
          'neural': ['./lib/NeuralPlanner.ts', './lib/neuralAnalyzer.ts']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  preview: {
    port: 3001,
    host: true
  }
})
