/**
 * EuroWeb - 404 Not Found Page
 * Pure Server Component
 */

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1e293b, #334155)',
      color: 'white',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ 
          fontSize: '6rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          color: '#60a5fa'
        }}>
          404
        </h1>
        
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          color: '#f1f5f9'
        }}>
          Page Not Found
        </h2>
        
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '2rem',
          color: '#cbd5e1'
        }}>
          The page you are looking for does not exist or has been moved.
        </p>
        
        <a 
          href="/" 
          style={{
            display: 'inline-block',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
