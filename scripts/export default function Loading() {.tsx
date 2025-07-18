export default function Loading() {
  const loadingStyles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1d29 0%, #2d2a45 30%, #1e2a4a 70%, #243447 100%)',
      color: '#f8fafc',
      fontFamily: 'Playfair Display, serif'
    },
    content: {
      textAlign: 'center' as const
    },
    spinner: {
      width: '80px',
      height: '80px',
      border: '4px solid rgba(212, 175, 55, 0.3)',
      borderTop: '4px solid #d4af37',
      borderRadius: '50%',
      animation: 'euroweb-spin 1s linear infinite',
      margin: '0 auto 30px'
    },
    title: {
      color: '#d4af37',
      fontSize: '28px',
      margin: '0 0 15px 0',
      fontWeight: 700,
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)'
    },
    subtitle: {
      color: '#cbd5e1',
      fontSize: '18px',
      margin: '0 0 10px 0',
      fontStyle: 'italic'
    },
    dots: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '20px'
    },
    dot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#d4af37',
      borderRadius: '50%',
      animation: 'euroweb-pulse 1.5s ease-in-out infinite'
    },
    info: {
      color: '#64748b',
      fontSize: '14px',
      marginTop: '25px',
      fontFamily: 'Inter, sans-serif'
    }
  }

  return (
    <>
      <div className={loadingStyles.container}>
        <div className={loadingStyles.content}>
          <div className={loadingStyles.spinner} />
          
          <h2 className={loadingStyles.title}>
            🚀 EuroWeb Platform
          </h2>
          
          <p className={loadingStyles.subtitle}>
            AGI Core po inicializohet...
          </p>
          
          <div className={loadingStyles.dots}>
            <div className={{...loadingStyles.dot, animationDelay: '0s'}} />
            <div className={{...loadingStyles.dot, animationDelay: '0.2s'}} />
            <div className={{...loadingStyles.dot, animationDelay: '0.4s'}} />
          </div>
          
          <p className={loadingStyles.info}>
            📋 AGISheet Kameleon • 🧠 Neural Networks • 🌐 Mesh Topology
          </p>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes euroweb-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes euroweb-pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  )
}
