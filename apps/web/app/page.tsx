'use client'

import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with framer-motion
const Web8TabSystem = dynamic(
  () => import('../components/Web8TabSystem-fixed').then(mod => ({ default: mod.Web8TabSystemFixed })),
  { 
    ssr: false,
    loading: () => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        color: '#00ff88'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠 EuroWeb Ultra</h1>
          <p>Loading Neural Interface...</p>
        </div>
      </div>
    )
  }
)

export default function Page() {
  return <Web8TabSystem />
}
