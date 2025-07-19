import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // EuroWeb Web8 - Industrial Design System
  preflight: true,
  include: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  exclude: [
    './node_modules/**/*',
    './pages/**/*'
  ],
  
  // Industrial Theme
  theme: {
    extend: {
      colors: {
        industrial: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        agi: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764'
        }
      },
      fontFamily: {
        'industrial': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      }
    }
  },
  
  // Output - Only CSS
  outdir: 'styled-system',
  jsxFramework: 'react',
  
  // EuroWeb Conditions
  conditions: {
    extend: {
      agi: '&[data-agi="true"]',
      industrial: '&[data-theme="industrial"]'
    }
  }
})
