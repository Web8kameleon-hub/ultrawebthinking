/**
 * EuroWeb Web8 Platform - Client Component Wrapper
 * Ensures proper hydration for dynamic AGI interface
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Web8TabSystem with no SSR to prevent hydration issues
const Web8TabSystem = dynamic(() => import('./Web8TabSystem'), {
  ssr: false,
  loading: () => (
    <div className={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1d29 25%, #2d2a45 50%, #1e2a4a 75%, #243447 100%)',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div className={{
        textAlign: 'center',
        padding: '40px'
      }}>
        <div 
          style={{}}
          className={{
            width: '64px',
            height: '64px',
            border: '4px solid rgba(212, 175, 55, 0.3)',
            borderTop: '4px solid #d4af37',
            borderRadius: '50%',
            margin: '0 auto 20px'
          }} 
        />
        <h2 className={{
          color: '#d4af37',
          fontSize: '24px',
          marginBottom: '10px',
          fontWeight: 600
        }}>
          🧠 Initializing AGI Core
        </h2>
        <p className={{
          color: '#cbd5e1',
          fontSize: '16px'
        }}>
          EuroWeb Web8 Platform Loading...
        </p>
      </div>
    </div>
  )
})

/**
 * Client-side wrapper component without hooks
 * Pure functional component for proper TypeScript compliance
 */
const Web8ClientWrapper: React.FC = () => {
  return (
    <div className={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1d29 25%, #2d2a45 50%, #1e2a4a 75%, #243447 100%)',
      color: '#f8fafc',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Web8TabSystem />
    </div>
  )
}

export default Web8ClientWrapper
