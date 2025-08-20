"use client";

import { motion } from 'framer-motion';
import styles from './Home.module.css';

export const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>🚀 EuroWeb Platform</h1>
        <p className={styles.subtitle}>
          Advanced AGI-powered web browser with TypeScript + CSS Modules + CVA + Framer Motion
        </p>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <h3>🧠 AGI Core</h3>
          <p>Artificial General Intelligence powered browsing experience</p>
        </div>
        
        <div className={styles.feature}>
          <h3>📊 AGISheet</h3>
          <p>Industrial-grade spreadsheet engine with AI integration</p>
        </div>
        
        <div className={styles.feature}>
          <h3>🌿 AGIBioNature</h3>
          <p>Biology, nature, medical, and ecology analysis engines</p>
        </div>
        
        <div className={styles.feature}>
          <h3>💰 AGIEco</h3>
          <p>Economic, statistical, and crypto-analysis tools</p>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.primaryButton}>
          Explore AGI Features
        </button>
        <button className={styles.secondaryButton}>
          View Documentation
        </button>
      </div>
    </motion.div>
  );
};
