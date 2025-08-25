/**
 * EuroWeb Ultra Platform - Localized Main Page
 * Pure TypeScript Implementation - i18n Support
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version Ultra 2.0.0 i18n
 * @license MIT
 */

import dynamic from 'next/dynamic'

// Import Web8TabSystem with no SSR to prevent hydration errors
const Web8TabSystemClient = dynamic(() => import('../../components/Web8TabSystem'), {
  ssr: false,
  loading: () => (
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
          Loading AI Platform...
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
})

type Props = {
  params: { locale: string };
};

/**
 * Localized main page component for EuroWeb Ultra Platform
 * Uses client-side rendering to prevent hydration errors
 */
export default function LocalizedHomePage({ params: { locale } }: Props) {
  return (
    <main suppressHydrationWarning={true}>
      <Web8TabSystemClient />
    </main>
  )
}
