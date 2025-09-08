'use client'

import React from 'react'
import { motion } from 'framer-motion'
import styles from './UUTPage.module.css'

export default function UUTPage() {
  return (
    <div className={styles.uutPage}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className={styles.container}
      >
        <h1 className={styles.title}>🛰️ Ultra Universal Terminal (UUT)</h1>
        <p className={styles.description}>
          Satellite Communication & GPS Navigation System
        </p>
        
        <div className={styles.comingSoon}>
          <div className={styles.icon}>🚧</div>
          <h2>Në Zhvillim</h2>
          <p>Moduli UUT është aktualisht në zhvillim dhe do të jetë i disponueshëm së shpejti.</p>
          
          <div className={styles.features}>
            <h3>Karakteristikat e Planifikuara:</h3>
            <ul>
              <li>🛰️ Satellite Communication Interface</li>
              <li>📍 GPS Navigation & Tracking</li>
              <li>📡 Radio Frequency Management</li>
              <li>🌐 Global Positioning System</li>
              <li>📊 Real-time Data Transmission</li>
              <li>🔐 Secure Communication Protocols</li>
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
