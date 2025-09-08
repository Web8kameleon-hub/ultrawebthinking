'use client'

import React from 'react'
import { motion } from 'framer-motion'
import styles from './AGISheetPage.module.css'

export default function AGISheetPage() {
  return (
    <div className={styles.agisheetPage}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className={styles.container}
      >
        <h1 className={styles.title}>🧠 AGI Sheet Platform</h1>
        <p className={styles.description}>
          AI-Powered Spreadsheet Intelligence & Data Analysis
        </p>
        
        <div className={styles.comingSoon}>
          <div className={styles.icon}>🤖</div>
          <h2>Në Zhvillim</h2>
          <p>Moduli AGI Sheet është aktualisht në zhvillim dhe do të jetë i disponueshëm së shpejti.</p>
          
          <div className={styles.features}>
            <h3>Karakteristikat e Planifikuara:</h3>
            <ul>
              <li>🧠 AI-Powered Data Analysis</li>
              <li>📊 Intelligent Spreadsheet Functions</li>
              <li>🔮 Predictive Analytics</li>
              <li>📈 Automated Insights Generation</li>
              <li>🤖 Natural Language Queries</li>
              <li>⚡ Real-time Data Processing</li>
            </ul>
          </div>
          
          <button className={styles.backButton} onClick={() => window.history.back()}>
            ← Kthehu Prapa
          </button>
        </div>
      </motion.div>
    </div>
  )
}
