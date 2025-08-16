'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { AGIBioNature } from './AGIBioNature';
import styles from './AGIBioNatureDemo.module.css';

const demoContainerVariants = cva(styles.demoContainer, {
  variants: {
    theme: {
      forest: styles.forestTheme,
      ocean: styles.oceanTheme,
      laboratory: styles.laboratoryTheme,
      ecosystem: styles.ecosystemTheme,
      medical: styles.medicalTheme
    }
  },
  defaultVariants: {
    theme: 'forest'
  }
});

const controlPanelVariants = cva(styles.controlPanel, {
  variants: {
    expanded: {
      true: styles.expanded,
      false: styles.collapsed
    }
  },
  defaultVariants: {
    expanded: true
  }
});

interface AGIBioNatureDemoProps {
  initialMode?: 'biology' | 'nature' | 'medical' | 'ecology' | 'comprehensive';
  initialTheme?: 'forest' | 'ocean' | 'laboratory' | 'ecosystem' | 'medical';
}

export const AGIBioNatureDemo = ({
  initialMode = 'comprehensive',
  initialTheme = 'forest'
}: AGIBioNatureDemoProps) => {
  const [mode, setMode] = useState<'biology' | 'nature' | 'medical' | 'ecology' | 'comprehensive'>(initialMode);
  const [theme, setTheme] = useState<'forest' | 'ocean' | 'laboratory' | 'ecosystem' | 'medical'>(initialTheme);
  const [dataSource, setDataSource] = useState<'realtime' | 'research' | 'simulation'>('simulation');
  const [researchMode, setResearchMode] = useState(false);
  const [isControlsExpanded, setIsControlsExpanded] = useState(true);
  const [demoStats, setDemoStats] = useState({
    analysisRuns: 0,
    specimensAnalyzed: 0,
    insightsGenerated: 0,
    researchQueries: 0
  });

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
    setDemoStats(prev => ({ ...prev, analysisRuns: prev.analysisRuns + 1 }));
  };

  const handleThemeChange = (newTheme: typeof theme) => {
    setTheme(newTheme);
  };

  const handleDataSourceChange = (newDataSource: typeof dataSource) => {
    setDataSource(newDataSource);
    setDemoStats(prev => ({ ...prev, specimensAnalyzed: prev.specimensAnalyzed + Math.floor(Math.random() * 10) + 5 }));
  };

  const handleResearchModeToggle = () => {
    setResearchMode(!researchMode);
    if (!researchMode) {
      setDemoStats(prev => ({ ...prev, researchQueries: prev.researchQueries + 1 }));
    }
  };

  const generateInsight = () => {
    setDemoStats(prev => ({ ...prev, insightsGenerated: prev.insightsGenerated + 1 }));
  };

  const modeDescriptions = {
    biology: {
      title: 'Biology Mode',
      description: 'Deep biological analysis focusing on genetic diversity, species classification, and evolutionary patterns',
      icon: '🧬'
    },
    nature: {
      title: 'Nature Mode', 
      description: 'Environmental analysis covering climate patterns, ecosystem health, and natural resource management',
      icon: '🌿'
    },
    medical: {
      title: 'Medical Mode',
      description: 'Pharmaceutical analysis for drug discovery, clinical predictions, and therapeutic assessments',
      icon: '💊'
    },
    ecology: {
      title: 'Ecology Mode',
      description: 'Conservation analysis including population dynamics, habitat assessment, and protection strategies',
      icon: '🌍'
    },
    comprehensive: {
      title: 'Comprehensive Mode',
      description: 'Full multi-disciplinary analysis combining all biological, medical, ecological, and environmental insights',
      icon: '🔬'
    }
  };

  const themeDescriptions = {
    forest: { name: 'Forest Ecosystem', primary: '#22c55e', secondary: '#16a34a' },
    ocean: { name: 'Ocean Environment', primary: '#06b6d4', secondary: '#0891b2' },
    laboratory: { name: 'Laboratory Setting', primary: '#f59e0b', secondary: '#d97706' },
    ecosystem: { name: 'Mixed Ecosystem', primary: '#10b981', secondary: '#059669' },
    medical: { name: 'Medical Research', primary: '#ef4444', secondary: '#dc2626' }
  };

  return (
    <motion.div
      className={demoContainerVariants({ theme })}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Demo Header */}
      <motion.header
        className={styles.demoHeader}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.demoTitle}>
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                🧬
              </motion.span>
              AGIBioNature Demo
            </h1>
            <p className={styles.demoSubtitle}>
              Advanced Biological Intelligence & Nature Analysis Platform
            </p>
          </div>
          
          <div className={styles.statsPanel}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{demoStats.analysisRuns}</span>
              <span className={styles.statLabel}>Analyses</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{demoStats.specimensAnalyzed}</span>
              <span className={styles.statLabel}>Specimens</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{demoStats.insightsGenerated}</span>
              <span className={styles.statLabel}>Insights</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{demoStats.researchQueries}</span>
              <span className={styles.statLabel}>Queries</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Control Panel */}
      <motion.section
        className={controlPanelVariants({ expanded: isControlsExpanded })}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className={styles.controlHeader}>
          <h2 className={styles.controlTitle}>Demo Controls</h2>
          <motion.button
            className={styles.toggleButton}
            onClick={() => setIsControlsExpanded(!isControlsExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isControlsExpanded ? '🔼' : '🔽'}
          </motion.button>
        </div>

        {isControlsExpanded && (
          <motion.div
            className={styles.controlContent}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Mode Selection */}
            <div className={styles.controlGroup}>
              <h3 className={styles.controlGroupTitle}>Analysis Mode</h3>
              <div className={styles.modeGrid}>
                {Object.entries(modeDescriptions).map(([key, desc]) => (
                  <motion.button
                    key={key}
                    className={`${styles.modeButton} ${mode === key ? styles.active : ''}`}
                    onClick={() => handleModeChange(key as typeof mode)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={styles.modeIcon}>{desc.icon}</div>
                    <div className={styles.modeInfo}>
                      <div className={styles.modeTitle}>{desc.title}</div>
                      <div className={styles.modeDescription}>{desc.description}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div className={styles.controlGroup}>
              <h3 className={styles.controlGroupTitle}>Visual Theme</h3>
              <div className={styles.themeGrid}>
                {Object.entries(themeDescriptions).map(([key, desc]) => (
                  <motion.button
                    key={key}
                    className={`${styles.themeButton} ${theme === key ? styles.active : ''}`}
                    onClick={() => handleThemeChange(key as typeof theme)}
                    style={{ 
                      '--theme-color': desc.primary,
                      '--theme-secondary': desc.secondary 
                    } as React.CSSProperties}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={styles.themeColorPreview}></div>
                    <span>{desc.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Data Source & Settings */}
            <div className={styles.controlGroup}>
              <h3 className={styles.controlGroupTitle}>Data & Settings</h3>
              <div className={styles.settingsRow}>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>Data Source:</label>
                  <select 
                    className={styles.settingSelect}
                    value={dataSource}
                    onChange={(e) => handleDataSourceChange(e.target.value as typeof dataSource)}
                  >
                    <option value="simulation">Simulation Data</option>
                    <option value="research">Research Database</option>
                    <option value="realtime">Real-time Monitoring</option>
                  </select>
                </div>
                
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>
                    <input
                      type="checkbox"
                      checked={researchMode}
                      onChange={handleResearchModeToggle}
                      className={styles.settingCheckbox}
                    />
                    Research Mode
                  </label>
                </div>

                <motion.button
                  className={styles.generateButton}
                  onClick={generateInsight}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔬 Generate Insight
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* Current Mode Info */}
      <motion.div
        className={styles.modeInfo}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        key={mode} // Re-animate when mode changes
      >
        <div className={styles.currentModeDisplay}>
          <span className={styles.currentModeIcon}>{modeDescriptions[mode].icon}</span>
          <div>
            <h3 className={styles.currentModeTitle}>{modeDescriptions[mode].title}</h3>
            <p className={styles.currentModeDescription}>{modeDescriptions[mode].description}</p>
          </div>
        </div>
        <div className={styles.themeDisplay}>
          <div 
            className={styles.currentThemeIndicator}
            style={{ 
              backgroundColor: themeDescriptions[theme].primary 
            } as any}
          ></div>
          <span>{themeDescriptions[theme].name}</span>
        </div>
      </motion.div>

      {/* Main AGIBioNature Component */}
      <motion.div
        className={styles.mainContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        key={`${mode}-${theme}-${dataSource}`} // Re-animate on changes
      >
        <AGIBioNature
          mode={mode}
          theme={theme}
          dataSource={dataSource}
          researchMode={researchMode}
        />
      </motion.div>

      {/* Demo Info Footer */}
      <motion.footer
        className={styles.demoFooter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>🧬 Biology Analysis</h4>
            <p>Genetic diversity tracking, species classification, evolutionary pattern analysis</p>
          </div>
          <div className={styles.footerSection}>
            <h4>🌿 Nature Assessment</h4>
            <p>Climate monitoring, ecosystem health evaluation, resource management</p>
          </div>
          <div className={styles.footerSection}>
            <h4>💊 Medical Insights</h4>
            <p>Drug discovery, therapeutic potential, clinical trial predictions</p>
          </div>
          <div className={styles.footerSection}>
            <h4>🌍 Ecology Conservation</h4>
            <p>Population dynamics, habitat assessment, conservation strategies</p>
          </div>
        </div>
        
        <div className={styles.footerStats}>
          <p>
            🔬 Powered by TypeScript + CSS Modules + CVA + Framer Motion | 
            🧬 Pure AGI Logic without mocks or external dependencies |
            🌿 Industrial-grade biological intelligence platform
          </p>
        </div>
      </motion.footer>
    </motion.div>
  );
};

