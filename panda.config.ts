import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: [
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}'
  ],

  // Files to exclude
  exclude: [],

  // EuroWeb Design Tokens from v8.0.1-stabil
  theme: {
    extend: {
      tokens: {
        colors: {
          // EuroWeb Primary Colors
          euroweb: {
            primary: { value: '#d4af37' },    // Gold
            secondary: { value: '#1a2332' },  // Dark Blue
            accent: { value: '#f59e0b' },     // Amber
            background: { value: '#0f1419' }, // Deep Dark
            surface: { value: '#1e293b' },   // Slate
            text: { value: '#f1f5f9' },      // Light
            muted: { value: '#64748b' },     // Gray
          },
          
          // Gradient Colors
          gradient: {
            start: { value: '#0f1419' },
            middle: { value: '#1a2332' },
            end: { value: '#0f1419' },
          },
          
          // Status Colors
          status: {
            success: { value: '#10b981' },
            warning: { value: '#f59e0b' },
            error: { value: '#ef4444' },
            info: { value: '#3b82f6' },
          },
          
          // Mesh Colors
          mesh: {
            primary: { value: '#f59e0b' },
            secondary: { value: '#d97706' },
            accent: { value: '#92400e' },
            node: { value: '#1d4ed8' },
            connection: { value: '#059669' },
          },
          
          // AGI Colors
          agi: {
            primary: { value: '#6366f1' },
            secondary: { value: '#8b5cf6' },
            accent: { value: '#06b6d4' },
            neural: { value: '#10b981' },
            quantum: { value: '#f59e0b' },
          },
          
          // Solana Colors
          solana: {
            primary: { value: '#9945ff' },
            secondary: { value: '#14f195' },
            accent: { value: '#7c3aed' },
          },
          
          // Industrial Colors
          industrial: {
            primary: { value: '#059669' },
            secondary: { value: '#0d9488' },
            accent: { value: '#0f766e' },
            warning: { value: '#dc2626' },
          },
        },
        
        gradients: {
          euroweb: {
            primary: { value: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%)' },
            gold: { value: 'linear-gradient(135deg, #f59e0b, #d97706, #92400e)' },
            mesh: { value: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%)' },
            agi: { value: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)' },
            solana: { value: 'linear-gradient(135deg, #9945ff, #14f195)' },
            industrial: { value: 'linear-gradient(135deg, #059669, #0d9488, #0f766e)' },
          },
        },
        
        shadows: {
          euroweb: {
            sm: { value: '0 1px 2px 0 rgba(245, 158, 11, 0.05)' },
            md: { value: '0 4px 6px -1px rgba(245, 158, 11, 0.1)' },
            lg: { value: '0 10px 15px -3px rgba(245, 158, 11, 0.1)' },
            xl: { value: '0 20px 25px -5px rgba(245, 158, 11, 0.1)' },
            glow: { value: '0 0 30px rgba(245, 158, 11, 0.3)' },
          },
        },
        
        spacing: {
          euroweb: {
            xs: { value: '0.5rem' },
            sm: { value: '1rem' },
            md: { value: '1.5rem' },
            lg: { value: '2rem' },
            xl: { value: '3rem' },
            '2xl': { value: '4rem' },
          },
        },
        
        borderRadius: {
          euroweb: {
            sm: { value: '0.375rem' },
            md: { value: '0.5rem' },
            lg: { value: '0.75rem' },
            xl: { value: '1rem' },
            '2xl': { value: '1.5rem' },
          },
        },
        
        fontSizes: {
          euroweb: {
            xs: { value: '0.75rem' },
            sm: { value: '0.875rem' },
            md: { value: '1rem' },
            lg: { value: '1.125rem' },
            xl: { value: '1.25rem' },
            '2xl': { value: '1.5rem' },
            '3xl': { value: '1.875rem' },
            '4xl': { value: '2.25rem' },
            '5xl': { value: '3rem' },
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
  
  // Global CSS
  globalCss: {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },
    body: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%)',
      color: '#f1f5f9',
      minHeight: '100vh',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    html: {
      scrollBehavior: 'smooth',
    },
  },
  
  // JSX runtime
  jsxFramework: 'react',
})
