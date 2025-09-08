'use client'

import React from 'react'
import { motion } from 'framer-motion'
import MainNavigation from '@/components/Navigation/MainNavigation'
import DashboardPanel from '@/components/Dashboard/DashboardPanel'
import DashboardAGI from '@/components/Dashboard/DashboardAGI'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  return (
    <div className={styles.dashboardPage}>
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
          <h1 className={styles.title}>📊 EuroWeb Ultra Dashboard</h1>
          <p className={styles.subtitle}>
            Monitoring dhe kontroll për të gjitha modulet e platformës
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className={styles.dashboardContainer}
        >
          <DashboardPanel />
          <DashboardAGI />
        </motion.div>
      </motion.main>
    </div>
  )
}
