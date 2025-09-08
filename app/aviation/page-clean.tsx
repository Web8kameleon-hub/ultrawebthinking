'use client'

import React from 'react'
import { motion } from 'framer-motion'
import MainNavigation from '@/components/Navigation/MainNavigation'
import AviationDashboard from '@/components/Aviation/AviationDashboard'
import styles from './AviationPage.module.css'

export default function AviationPage() {
  return (
    <div className={styles.aviationPage}>
      <MainNavigation />
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.main}
      >
        <motion.header
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={styles.header}
        >
          <h1 className={styles.title}>✈️ UltraWebThinking Aviation</h1>
          <p className={styles.subtitle}>
            Modulare Plattform für Echtzeit-Intelligence ohne Netz & Strom
          </p>
          <div className={styles.features}>
            <span className={styles.feature}>🔒 Ed25519 Encryption</span>
            <span className={styles.feature}>📡 LoRa Mesh EU868</span>
            <span className={styles.feature}>🧠 {'>'}94% AI Accuracy</span>
            <span className={styles.feature}>⏱️ 72+ Hours Autonomous</span>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className={styles.dashboardContainer}
        >
          <AviationDashboard />
        </motion.div>
      </motion.main>
    </div>
  )
}
