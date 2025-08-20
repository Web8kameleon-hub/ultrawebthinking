"use client";

import { motion } from 'framer-motion';
import styles from './AGICore.module.css';

export const AGICore = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>🧠 AGI Core</h1>
        <p className={styles.subtitle}>
          Artificial General Intelligence Control Center
        </p>
      </div>

      <div className={styles.dashboard}>
        <div className={styles.statusPanel}>
          <h2>System Status</h2>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>AGI Engine</span>
            <span className={`${styles.statusIndicator} ${styles.active}`}>Online</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Neural Networks</span>
            <span className={`${styles.statusIndicator} ${styles.active}`}>Active</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Memory Core</span>
            <span className={`${styles.statusIndicator} ${styles.warning}`}>76% Used</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Processing Units</span>
            <span className={`${styles.statusIndicator} ${styles.active}`}>8/8 Online</span>
          </div>
        </div>

        <div className={styles.analyticsPanel}>
          <h2>Analytics Engines</h2>
          <div className={styles.engineGrid}>
            <div className={styles.engine}>
              <h3>📊 AGISheet</h3>
              <p>Spreadsheet & Data Analysis</p>
              <div className={styles.engineStatus}>Ready</div>
            </div>
            <div className={styles.engine}>
              <h3>🌿 AGIBioNature</h3>
              <p>Biology & Nature Analysis</p>
              <div className={styles.engineStatus}>Ready</div>
            </div>
            <div className={styles.engine}>
              <h3>💰 AGIEco</h3>
              <p>Economic & Crypto Analysis</p>
              <div className={styles.engineStatus}>Ready</div>
            </div>
            <div className={styles.engine}>
              <h3>🔬 Research Module</h3>
              <p>Scientific Research Assistant</p>
              <div className={styles.engineStatus}>Ready</div>
            </div>
          </div>
        </div>

        <div className={styles.controlPanel}>
          <h2>Control Panel</h2>
          <div className={styles.controls}>
            <button className={styles.controlButton}>
              🚀 Initialize Deep Analysis
            </button>
            <button className={styles.controlButton}>
              📈 Run Predictive Models
            </button>
            <button className={styles.controlButton}>
              🔄 Refresh Neural Networks
            </button>
            <button className={styles.controlButton}>
              💾 Save Current State
            </button>
          </div>
        </div>

        <div className={styles.metricsPanel}>
          <h2>Performance Metrics</h2>
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <span className={styles.metricValue}>847ms</span>
              <span className={styles.metricLabel}>Avg Response Time</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricValue}>99.7%</span>
              <span className={styles.metricLabel}>Accuracy Rate</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricValue}>1.2M</span>
              <span className={styles.metricLabel}>Queries Processed</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricValue}>4.8GB</span>
              <span className={styles.metricLabel}>Memory Usage</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
