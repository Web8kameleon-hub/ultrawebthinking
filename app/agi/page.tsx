/**
 * AGI System Page - Live Intelligence Interface
 * Real-time AGI responses, no static content
 * 
 * @author UltraWeb AGI Team
 * @version 8.1.0 Dynamic Intelligence
 */

'use client';

import nextDynamic from 'next/dynamic';

// Force dynamic rendering for live AGI
export const dynamic = 'force-dynamic'
export const revalidate = 0

const AGIMainController = nextDynamic(() => import('../../components/AGIMainController'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '3px solid #00ffff',
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <h2 style={{ 
          color: '#00ffff', 
          fontSize: '24px', 
          marginBottom: '10px',
          textShadow: '0 0 10px #00ffff'
        }}>
          🧠 AGI Core Loading
        </h2>
        <p style={{ color: '#ccc' }}>Neural networks po startojnë...</p>
      </div>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
});

export default function AGIPage() {
  return <AGIMainController />;
}
