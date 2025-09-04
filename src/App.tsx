/**
 * EuroWeb Ultra - Vite Main App Component
 * @author Ledjan Ahmati
 * @version 8.0.0 Vite
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import UltraThemeProvider from '../themes/UltraThemeProvider';
import './App.css';

// Import existing components
import Aviation from '../components/Aviation';
import Surfing from '../components/Surfing-Beautiful';
import UltraDemo from '../components/UltraDemo';

type AppMode = 'overview' | 'surfing' | 'aviation' | 'neural' | ''

function App() {
  const [mode, setMode] = useState<AppMode>('overview')

  const modes = {
    overview: {
      name: '🚀 Overview',
      description: 'EuroWeb Ultra Dashboard',
      component: <Overview />
    },
    surfing: {
      name: '🌊 Surfing',
      description: 'AGI-powered assistance',
      component: <Surfing />
    },
    aviation: {
      name: '✈️ Aviation',
      description: 'Flight control system',
      component: <Aviation />
    },
    neural: {
      name: '🧠 Neural',
      description: 'Neural network monitoring',
      component: <NeuralPlaceholder />
    },
    ultraTheme: {
      name: '🎨 UltraTheme',
      description: 'UltraThemeEngine showcase',
      component: <UltraDemo />
    }
  }

  return (
    <UltraThemeProvider>
      <div className="app ultra-fade-in">
        {/* Header Navigation */}
        <header className="app-header ultra-glass">
          <div className="app-brand">
            <span className="app-logo">🚀</span>
            <span className="app-title ultra-text-gradient">EuroWeb Ultra</span>
            <span className="app-badge ultra-btn ultra-btn-primary">Vite</span>
          </div>
          
          <nav className="app-nav">
            {Object.entries(modes).map(([key, modeData]) => (
              <button
                key={key}
                onClick={() => setMode(key as AppMode)}
                className={`nav-btn ultra-btn ${mode === key ? 'ultra-btn-primary' : 'ultra-btn-ghost'}`}
              >
                {modeData.name}
              </button>
            ))}
          </nav>
        </header>

        {/* Main Content */}
        <main className="app-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="app-content"
            >
              {modes[mode].component}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="app-footer ultra-glass">
          <span>⚡ Powered by Vite • 🧠 AGI-Enhanced • 🔒 Secure</span>
        </footer>
      </div>
    </UltraThemeProvider>
  )
}

// Overview Component
function Overview() {
  return (
    <div className="overview">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="overview-hero"
      >
        <h1 className="ultra-text-gradient">🚀 EuroWeb Ultra</h1>
        <p className="ultra-text-secondary">High-performance platform with Vite + React + TypeScript</p>
      </motion.div>

      <div className="overview-stats">
        {[
          { label: 'Build Time', value: '<2s', icon: '⚡' },
          { label: 'Hot Reload', value: '<50ms', icon: '🔥' },
          { label: 'Bundle Size', value: 'Optimized', icon: '📦' },
          { label: 'Performance', value: 'Ultra', icon: '🚀' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card ultra-card ultra-fade-in"
          >
            <span className="stat-icon ultra-float">{stat.icon}</span>
            <span className="stat-value ultra-text-royal">{stat.value}</span>
            <span className="stat-label ultra-text-secondary">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="overview-features ultra-card ultra-overview-features">
        <h2 className="ultra-text-royal">✨ Features</h2>
        <ul className="ultra-features-list">
          <li className="ultra-feature-item">⚡ Lightning-fast Vite development</li>
          <li className="ultra-feature-item">🌊 Real AGI-powered Surfing component</li>
          <li className="ultra-feature-item">✈️ Live Aviation control system</li>
          <li className="ultra-feature-item">🧠 Neural network monitoring</li>
          <li className="ultra-feature-item">🎨 Beautiful UltraThemeEngine UI</li>
          <li className="ultra-feature-item">🔧 TypeScript for type safety</li>
        </ul>
      </div>
    </div>
  )
}

// Neural 
function NeuralPlaceholder() {
  return (
    <div className="neural-">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="-content"
      >
        <h2>🧠 Neural Network Center</h2>
        <p>Neural monitoring component coming soon...</p>
        <div className="neural-animation">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity
              }}
              className="neural-node"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default App

