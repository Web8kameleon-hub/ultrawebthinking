/**
 * EuroWeb Ultra Platform - Hydration Safe Client Component
 * Prevents hydration errors with dynamic imports
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version Ultra 2.0.0 Hydration-Safe
 * @license MIT
 */

'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Create loading component
const LoadingComponent = () => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f1419 0%, #1a1d29 25%, #2d2a45 50%, #1e2a4a 75%, #243447 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#f8fafc',
    fontFamily: 'Inter, sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '80px',
        height: '80px',
        border: '4px solid #d4af37',
        borderTop: '4px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }} />
      <h2 style={{
        fontSize: '24px',
        marginBottom: '10px',
        background: 'linear-gradient(45deg, #d4af37, #f59e0b)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🧠 EuroWeb Ultra Loading...
      </h2>
      <p style={{ color: '#cbd5e1', fontSize: '16px' }}>
        Initializing Neural Networks & AGI Modules
      </p>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  </div>
)

// Dynamic import with no SSR to prevent hydration errors
const Web8TabSystem = dynamic(
  () => import('./Web8TabSystem'),
  {
    ssr: false,
    loading: LoadingComponent
  }
)

export default function HydrationSafeApp() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <LoadingComponent />
  }

  return <Web8TabSystem />
}
