'use client'

import {  } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  (() => {
    console.error('EuroWeb Platform Error:', error)
  }, [error])

  return (
    <div className={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1d29 0%, #2d2a45 30%, #1e2a4a 70%, #243447 100%)',
      color: '#f8fafc',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div className={{ maxWidth: '600px' }}>
        <div className={{
          fontSize: '64px',
          marginBottom: '20px'
        }}>
          ⚠️
        </div>
        
        <h1 className={{
          fontSize: '32px',
          color: '#ef4444',
          margin: '0 0 20px 0',
          fontWeight: 700,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)'
        }}>
          AGI System Error
        </h1>
        
        <h2 className={{
          fontSize: '24px',
          color: '#f8fafc',
          margin: '0 0 15px 0',
          fontWeight: 600
        }}>
          🧠 Neural Network Disruption
        </h2>
        
        <p className={{
          fontSize: '16px',
          color: '#cbd5e1',
          margin: '0 0 25px 0',
          lineHeight: '1.6'
        }}>
          Një gabim i papritur ndodhi në sistemin e EuroWeb Platform. 
          AGI Core po përpiqet të rikthejë stabilitetin e shtresave të inteligjencës.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <div className={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '25px',
            textAlign: 'left'
          }}>
            <h3 className={{ color: '#ef4444', fontSize: '14px', marginBottom: '10px' }}>
              Debug Info:
            </h3>
            <pre className={{
              fontSize: '12px',
              color: '#fca5a5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {error.message}
            </pre>
          </div>
        )}
        
        <div className={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            className={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #d4af37, #b8982d)',
              color: '#1a1d29',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            🔄 Restart AGI Core
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#d4af37',
              border: '2px solid #d4af37',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            🏠 Return Home
          </button>
        </div>
        
        <div className={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(45, 52, 70, 0.6)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '12px'
        }}>
          <h3 className={{ color: '#d4af37', marginBottom: '15px', fontSize: '16px' }}>
            🛠️ Sistema e Diagnozës
          </h3>
          <div className={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '10px', 
            fontSize: '14px',
            color: '#cbd5e1'
          }}>
            <div>🧠 AGI Core: Checking...</div>
            <div>📋 AGISheet: Standby</div>
            <div>🌐 Mesh Network: Active</div>
            <div>🔒 Security: Protected</div>
          </div>
        </div>
      </div>
    </div>
  )
}
