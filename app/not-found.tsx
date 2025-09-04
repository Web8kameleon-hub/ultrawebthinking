// app/not-found.tsx

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '16px', color: '#ef4444' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#374151' }}>
        Faqja nuk u gjet
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Faqja që kërkoni nuk ekziston ose është zhvendosur.
      </p>
      <a
        href="/"
        style={{
          background: '#3b82f6',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '500'
        }}
      >
        Kthehu në fillim
      </a>
    </div>
  );
}

