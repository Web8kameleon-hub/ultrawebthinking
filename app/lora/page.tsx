'use client'

import React from 'react'
import { motion } from 'framer-motion'
import styles from './LoRaPage.module.css'

export default function LoRaPage() {
  return (
    <div className={styles.loraPage}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className={styles.container}
      >
        <h1 className={styles.title}>📡 LoRa Gateway System</h1>
        <p className={styles.description}>
          Long Range Radio Communication & IoT Gateway
        </p>
        
        <div className={styles.comingSoon}>
          <div className={styles.icon}>🔧</div>
          <h2>Në Zhvillim</h2>
          <p>Moduli LoRa Gateway është aktualisht në zhvillim dhe do të jetë i disponueshëm së shpejti.</p>
          
          <div className={styles.features}>
            <h3>Karakteristikat e Planifikuara:</h3>
            <ul>
              <li>📡 Long Range Communication (up to 15km)</li>
              <li>🔗 IoT Device Management</li>
              <li>⚡ Low Power Consumption</li>
              <li>🌐 Wide Area Network (WAN)</li>
              <li>📊 Real-time Data Collection</li>
              <li>🔐 Encrypted Data Transmission</li>
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
