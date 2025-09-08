'use client'

import React from 'react'
import { motion } from 'framer-motion'
import MainNavigation from '@/components/Navigation/MainNavigation'
import AviationRealTime from '@/components/Aviation/AviationRealTime'
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
          className={styles.pageHeader}
        >
          <h1 className={styles.pageTitle}>✈️ Aviation Real-Time Platform</h1>
          <p className={styles.pageSubtitle}>
            Live flight tracking, satellite monitoring, and weather data for Albania/Kosovo region
          </p>
          <div className={styles.disclaimer}>
            <strong>Real Data Only:</strong> This platform shows actual live data from aviation APIs. 
            No simulated or fake information is displayed.
          </div>
        </motion.header>

        <AviationRealTime />
      </motion.main>
    </div>
  )
}
