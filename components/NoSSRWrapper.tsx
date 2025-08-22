/**
 * EuroWeb Ultra Platform - No-SSR Client Only Component
 * Completely prevents hydration errors by only rendering on client
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version Ultra 2.0.0 Client-Only
 * @license MIT
 */

'use client'

import React, { useEffect, useState } from 'react'

// Simple loading screen component
const LoadingScreen = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1d29 25%, #2d2a45 50%, #1e2a4a 75%, #243447 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'Inter, system-ui, sans-serif'
    }}
  >
    <div style={{ textAlign: 'center', color: '#f8fafc' }}>
      <div
        style={{
          width: '80px',
          height: '80px',
          border: '4px solid #d4af37',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          margin: '0 auto 24px',
          animation: 'euroweb-spin 1s linear infinite'
        }}
      />
      <h1
        style={{
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '12px',
          background: 'linear-gradient(45deg, #d4af37, #f59e0b)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent'
        }}
      >
        🧠 EuroWeb Ultra
      </h1>
      <p
        style={{
          fontSize: '16px',
          color: '#cbd5e1',
          margin: 0
        }}
      >
        Initializing Neural Networks & AGI Systems...
      </p>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes euroweb-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `
        }}
      />
    </div>
  </div>
)

export default function NoSSRWrapper() {
  const [isMounted, setIsMounted] = useState(false)
  const [TabSystem, setTabSystem] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    // Only run on client side
    setIsMounted(true)
    
    // Dynamic import only after component is mounted
    const loadTabSystem = async () => {
      try {
        const { default: Web8TabSystem } = await import('./Web8TabSystem')
        setTabSystem(() => Web8TabSystem)
      } catch (error) {
        console.error('Failed to load Web8TabSystem:', error)
      }
    }

    loadTabSystem()
  }, [])

  // Show loading screen until component is mounted and TabSystem is loaded
  if (!isMounted || !TabSystem) {
    return <LoadingScreen />
  }

  // Render the main component only on client side
  return <TabSystem />
}
