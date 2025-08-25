/**
 * Web8TabSystem Page - Advanced Tab Management Interface
 * EuroWeb Ultra Platform
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 9.1.0
 */

'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamic import for better performance
const Web8TabSystem = dynamic(() => import('@/components/web8-tabs/Web8TabSystem'), {
  loading: () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#60a5fa'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        border: '4px solid rgba(96, 165, 250, 0.2)',
        borderTop: '4px solid #60a5fa',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '24px'
      }} />
      <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
        🚀 Loading Web8TabSystem Ultra
      </div>
      <div style={{ fontSize: '16px', color: '#94a3b8', textAlign: 'center', maxWidth: '400px' }}>
        Initializing advanced tab management system with all major modules...
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  ),
  ssr: false
})

export default function Web8TabSystemPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0f172a',
        color: '#60a5fa'
      }}>
        Loading Web8TabSystem...
      </div>
    }>
      <Web8TabSystem />
    </Suspense>
  )
}
