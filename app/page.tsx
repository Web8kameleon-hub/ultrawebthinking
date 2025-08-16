/**
 * EuroWeb Ultra - Web8 Search Platform Homepage
 * Central Search Interface with Neural AI
 * DYNAMIC PAGE - Real-time AGI Intelligence
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.1.0 Dynamic AGI
 */

'use client'

import nextDynamic from 'next/dynamic'

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic'

const Web8TabSystem = nextDynamic(
  () => import('../frontend/src/components/Web8TabSystem'),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: 'white' }}>
            � Web8 Tab System Loading...
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>
            Initializing Web8 Command Center...
          </p>
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `
          }} />
        </div>
      </div>
    )
  }
)

export default function Home() {
  return <Web8TabSystem />
}
