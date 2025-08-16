/**
 * EuroWeb - Simple Static Component
 * Pure CSS (no CVA, no Tailwind)
 */

export function SimpleDemo() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1e293b, #334155)',
      color: 'white',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    } as any}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' } as any}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          color: '#60a5fa'
        } as any}>
          EuroWeb Platform
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '3rem',
          color: '#cbd5e1'
        } as any}>
          Pure TypeScript + Vanilla CSS + Next.js 14
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        } as any}>
          <div style={{
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          } as any}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' } as any}>
              TypeScript
            </h3>
            <p style={{ color: '#94a3b8' } as any}>
              100% TypeScript implementation with strict mode
            </p>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          } as any}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' } as any}>
              Vanilla CSS
            </h3>
            <p style={{ color: '#94a3b8' } as any}>
              Pure CSS modules without any runtime overhead
            </p>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          } as any}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' } as any}>
              Industrial Grade
            </h3>
            <p style={{ color: '#94a3b8' } as any}>
              Enterprise-ready platform for modern web applications
            </p>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(71, 85, 105, 0.3)'
        } as any}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' } as any}>
            Status
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' } as any}>
            <div>
              <span style={{ color: '#10b981' } as any}>✅</span> TypeScript Compilation
            </div>
            <div>
              <span style={{ color: '#10b981' } as any}>✅</span> ESLint Setup
            </div>
            <div>
              <span style={{ color: '#10b981' } as any}>✅</span> Next.js Build
            </div>
            <div>
              <span style={{ color: '#10b981' } as any}>✅</span> Pure Architecture
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
