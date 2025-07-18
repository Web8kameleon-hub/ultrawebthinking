export default function Loading() {
  return (
    <div className={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1d29 0%, #2d2a45 30%)',
      color: '#f8fafc'
    }}>
      <div className={{ textAlign: 'center' }}>
        <div className={{
          width: '60px',
          height: '60px',
          border: '3px solid #d4af37',
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <h2 className={{ color: '#d4af37' }}>🚀 EuroWeb Platform</h2>
        <p>AGI Core po inicializohet...</p>
      </div>
    </div>
  )
}
