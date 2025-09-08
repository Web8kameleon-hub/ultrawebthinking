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
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className={styles.main}
      >
        <motion.header
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
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
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          className={styles.dashboardContainer}
        >
          <AviationDashboard />
        </motion.div>
      </motion.main>
    </div>
  )
}
