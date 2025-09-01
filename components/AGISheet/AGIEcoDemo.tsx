'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
// import { AGIEco } from '../components/AGISheet/AGIEco'; // Temporarily disabled due to missing module

// Placeholder component
const AGIEco = ({ ecosystemHealth, analysisMode, onDataUpdate }: any) => (
  <div className="p-4 border rounded bg-green-50">
    <h3 className="text-lg font-semibold text-green-700">AGI Eco System</h3>
    <p className="text-green-600">Ecosystem Health: {ecosystemHealth}%</p>
    <p className="text-sm text-gray-600">Analysis Mode: {analysisMode}</p>
    <p className="text-xs text-gray-500">Placeholder - AGIEco module not found</p>
  </div>
);
import styles from './AGIEcoDemo.module.css';

const containerVariants = cva(styles.container, {
  variants: {
    layout: {
      fullscreen: styles.fullscreen,
      windowed: styles.windowed,
      embedded: styles.embedded
    }
  },
  defaultVariants: {
    layout: 'windowed'
  }
});

const controlVariants = cva(styles.control, {
  variants: {
    type: {
      primary: styles.primaryControl,
      secondary: styles.secondaryControl,
      toggle: styles.toggleControl
    },
    state: {
      active: styles.active,
      inactive: styles.inactive
    }
  }
});

interface AGIEcoDemoProps {
  layout?: 'fullscreen' | 'windowed' | 'embedded';
  showControls?: boolean;
}

export const AGIEcoDemo = ({ 
  layout = 'windowed',
  showControls = true 
}: AGIEcoDemoProps) => {
  const [mode, setMode] = useState<'statistics' | 'economics' | 'crypto' | 'comprehensive'>('comprehensive');
  const [theme, setTheme] = useState<'green' | 'blue' | 'gold' | 'dark'>('green');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [dataSource, setDataSource] = useState('real-time');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const modes = [
    { value: 'comprehensive' as const, label: '🌐 Comprehensive', description: 'Full economic intelligence dashboard' },
    { value: 'statistics' as const, label: '📊 Statistics', description: 'Statistical analysis and forecasting' },
    { value: 'economics' as const, label: '💰 Economics', description: 'Market and economic indicators' },
    { value: 'crypto' as const, label: '₿ Crypto', description: 'Cryptocurrency analysis and trading signals' }
  ];

  const themes = [
    { value: 'green' as const, label: '🌱 Eco Green', color: '#10b981' },
    { value: 'blue' as const, label: '🌊 Ocean Blue', color: '#3b82f6' },
    { value: 'gold' as const, label: '✨ Golden', color: '#f59e0b' },
    { value: 'dark' as const, label: '🌙 Dark Mode', color: '#6b7280' }
  ];

  const dataSources = [
    { value: 'real-time', label: '⚡ Real-time', description: 'Live market data' },
    { value: 'demo', label: '🎭 Demo', description: 'Simulated data for testing' },
    { value: 'historical', label: '📚 Historical', description: 'Historical market data' }
  ];

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={containerVariants({ layout: isFullscreen ? 'fullscreen' : layout })}>
      {/* Demo Controls */}
      {showControls && (
        <motion.div
          className={styles.controls}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.controlsHeader}>
            <h2 className={styles.controlsTitle}>
              🧠 AGI×Eco Demo Controls
            </h2>
            <motion.button
              className={controlVariants({ type: 'secondary' })}
              onClick={toggleFullscreen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isFullscreen ? '🪟 Window' : '🔍 Fullscreen'}
            </motion.button>
          </div>

          <div className={styles.controlsGrid}>
            {/* Mode Selection */}
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Analysis Mode</label>
              <div className={styles.buttonGroup}>
                {modes.map((modeOption) => (
                  <motion.button
                    key={modeOption.value}
                    className={controlVariants({ 
                      type: 'toggle',
                      state: mode === modeOption.value ? 'active' : 'inactive'
                    })}
                    onClick={() => setMode(modeOption.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title={modeOption.description}
                  >
                    {modeOption.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Visual Theme</label>
              <div className={styles.buttonGroup}>
                {themes.map((themeOption) => (
                  <motion.button
                    key={themeOption.value}
                    className={controlVariants({ 
                      type: 'toggle',
                      state: theme === themeOption.value ? 'active' : 'inactive'
                    })}
                    onClick={() => setTheme(themeOption.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ 
                      background: theme === themeOption.value 
                        ? `linear-gradient(135deg, ${themeOption.color}, transparent)` 
                        : undefined 
                    }}
                  >
                    {themeOption.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Data Source */}
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Data Source</label>
              <div className={styles.buttonGroup}>
                {dataSources.map((source) => (
                  <motion.button
                    key={source.value}
                    className={controlVariants({ 
                      type: 'toggle',
                      state: dataSource === source.value ? 'active' : 'inactive'
                    })}
                    onClick={() => setDataSource(source.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title={source.description}
                  >
                    {source.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Auto Update Toggle */}
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Auto Update</label>
              <motion.button
                className={controlVariants({ 
                  type: 'toggle',
                  state: autoUpdate ? 'active' : 'inactive'
                })}
                onClick={() => setAutoUpdate(!autoUpdate)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {autoUpdate ? '🔄 Enabled' : '⏸️ Disabled'}
              </motion.button>
            </div>
          </div>

          {/* Status Indicators */}
          <div className={styles.statusBar}>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Status:</span>
              <motion.span 
                className={styles.statusValue}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✅ Active
              </motion.span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Mode:</span>
              <span className={styles.statusValue}>
                {modes.find(m => m.value === mode)?.label}
              </span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Theme:</span>
              <span className={styles.statusValue}>
                {themes.find(t => t.value === theme)?.label}
              </span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Updates:</span>
              <span className={styles.statusValue}>
                {autoUpdate ? '⚡ Live' : '⏸️ Paused'}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main AGIEco Component */}
      <motion.div
        className={styles.ecoContainer}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AGIEco
          mode={mode}
          theme={theme}
          autoUpdate={autoUpdate}
          dataSource={dataSource}
        />
      </motion.div>

      {/* Demo Information */}
      {showControls && !isFullscreen && (
        <motion.div
          className={styles.demoInfo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h3 className={styles.demoInfoTitle}>🎯 Demo Features</h3>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📊</div>
              <div className={styles.featureContent}>
                <h4>Statistical Engine</h4>
                <p>Advanced statistical analysis with trend detection, anomaly identification, and predictive modeling.</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💰</div>
              <div className={styles.featureContent}>
                <h4>Economic Intelligence</h4>
                <p>Real-time market analysis, risk assessment, and economic forecasting with sentiment analysis.</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>₿</div>
              <div className={styles.featureContent}>
                <h4>Crypto Analytics</h4>
                <p>Comprehensive cryptocurrency analysis including technical indicators, portfolio optimization, and DeFi metrics.</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🧠</div>
              <div className={styles.featureContent}>
                <h4>AGI-Powered Insights</h4>
                <p>Artificial General Intelligence algorithms for pattern recognition, prediction, and automated decision support.</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <div className={styles.featureContent}>
                <h4>Real-time Updates</h4>
                <p>Live data streaming with configurable update intervals and automatic anomaly alerts.</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎨</div>
              <div className={styles.featureContent}>
                <h4>Adaptive Themes</h4>
                <p>Dynamic visual themes that adapt to market conditions and user preferences for optimal readability.</p>
              </div>
            </div>
          </div>

          <div className={styles.technicalSpecs}>
            <h4 className={styles.specsTitle}>🔧 Technical Specifications</h4>
            <div className={styles.specsGrid}>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Frontend:</span>
                <span className={styles.specValue}>React + TypeScript + CSS Modules</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Animation:</span>
                <span className={styles.specValue}>Framer Motion</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Styling:</span>
                <span className={styles.specValue}>Class Variance Authority (CVA)</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Data Processing:</span>
                <span className={styles.specValue}>Statistical & Economic Engines</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Performance:</span>
                <span className={styles.specValue}>Optimized for real-time analytics</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Accessibility:</span>
                <span className={styles.specValue}>WCAG 2.1 AA compliant</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

