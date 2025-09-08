'use client'

import React from 'react'
import { motion } from 'framer-motion'
import styles from './MeshPage.module.css'

export default function MeshPage() {
  return (
    <div className={styles.meshPage}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className={styles.container}
      >
        <h1 className={styles.title}>🕸️ Mesh Network System</h1>
        <p className={styles.description}>
          Decentralized Network Architecture & P2P Communication
        </p>
        
        <div className={styles.comingSoon}>
          <div className={styles.icon}>🌐</div>
          <h2>Në Zhvillim</h2>
          <p>Moduli Mesh Network është aktualisht në zhvillim dhe do të jetë i disponueshëm së shpejti.</p>
          
          <div className={styles.features}>
            <h3>Karakteristikat e Planifikuara:</h3>
            <ul>
              <li>🕸️ Self-Healing Network Topology</li>
              <li>🔗 Peer-to-Peer Communication</li>
              <li>⚡ Automatic Route Discovery</li>
              <li>🛡️ Distributed Security</li>
              <li>📡 Multi-hop Data Transmission</li>
              <li>🌍 Decentralized Architecture</li>
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
