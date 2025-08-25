/**
 * EuroWeb - Loading Spinner Component
 * Pure CSS Modules + CVA
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.0 Ultra
 */

'use client'

import React from 'react'
import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'accent'
  className?: string
}

export function LoadingSpinner({ 
  size = 'medium', 
  color = 'primary', 
  className 
}: LoadingSpinnerProps) {
  const sizeClass = size === 'small' ? styles.small : 
                   size === 'large' ? styles.large : styles.medium
  const colorClass = color === 'secondary' ? styles.secondary :
                    color === 'accent' ? styles.accent : styles.primary

  return (
    <div
      className={`${styles.spinner} ${sizeClass} ${colorClass} ${className || ''}`}
      style={{
        animation: 'spin 1s linear infinite'
      }}
      aria-label="Loading..."
      role="status"
    >
      <div className={styles.inner} />
    </div>
  )
}
