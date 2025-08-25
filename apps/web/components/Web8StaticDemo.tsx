/**
 * EuroWeb Web8 Platform - Static Demo
 * Pure CSS Modules + CVA Implementation
 */

'use client'

import React from 'react'
import { cva } from 'class-variance-authority'
import styles from './Web8StaticDemo.module.css'

const cardVariants = cva(
  styles.cardBase,
  {
    variants: {
      intent: {
        primary: styles.cardPrimary,
        secondary: styles.cardSecondary,
        success: styles.cardSuccess
      }
    },
    defaultVariants: {
      intent: 'primary'
    }
  }
)

export function Web8StaticDemo() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          EuroWeb Platform Demo
        </h1>
        
        <div className={styles.grid}>
          <div className={cardVariants({ intent: 'primary' })}>
            <h2 className={styles.cardTitle}>Primary Feature</h2>
            <p className={styles.cardText}>
              This is a primary feature card demonstrating CVA styling with CSS Modules.
            </p>
          </div>
          
          <div className={cardVariants({ intent: 'secondary' })}>
            <h2 className={styles.cardTitle}>Secondary Feature</h2>
            <p className={styles.cardText}>
              This is a secondary feature card with different styling variants.
            </p>
          </div>
          
          <div className={cardVariants({ intent: 'success' })}>
            <h2 className={styles.cardTitle}>Success Feature</h2>
            <p className={styles.cardText}>
              This is a success feature card with green styling theme.
            </p>
          </div>
        </div>
        
        <div className={styles.statusSection}>
          <h2 className={styles.statusTitle}>Platform Status</h2>
          <div className={styles.statusCard}>
            <p className={`${styles.statusItem} ${styles.statusSuccess}`}>
              ✅ All systems operational
            </p>
            <p className={`${styles.statusItem} ${styles.statusInfo}`}>
              📊 Performance: Excellent
            </p>
            <p className={`${styles.statusItem} ${styles.statusWarning}`}>
              ⚡ Build: Successful
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
