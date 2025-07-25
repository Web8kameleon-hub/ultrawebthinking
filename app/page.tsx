/**
 * EuroWeb Ultra - Industrial Tab System Homepage
 * Pure TypeScript + CSS Modules + AGI Integration
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.0 Ultra
 */

'use client'

import dynamic from 'next/dynamic'

const Web8TabSystemFixed = dynamic(
  () => import('../components/Web8TabSystem-fixed').then(mod => ({ default: mod.Web8TabSystemFixed })),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid rgba(212, 175, 55, 0.3)',
            borderTop: '3px solid #d4af37',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '1.2rem', color: '#d4af37' }}>
            Loading EuroWeb Ultra...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }
)

export default function Home() {
  return <Web8TabSystemFixed />
}
