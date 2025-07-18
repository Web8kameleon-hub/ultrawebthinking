import React from 'react';
import Head from 'next/head';

export default function Home() {
  // Static values instead of state
  const searchQuery = '';
  const activeTab = 'web';

  return (
    <>
      <Head>
        <title>UltraWebThinking - AI Browser</title>
        <meta name="description" content="Advanced AI-powered browser interface" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
        {/* Header with tabs */}
        <header className={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e5e7eb', 
          padding: '1rem' 
        }}>
          <div className={{ 
            maxWidth: '72rem', 
            margin: '0 auto', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem' 
          }}>
            <h1 className={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#2563eb' 
            }}>
              UltraWebThinking
            </h1>
            
            {/* Tab Navigation */}
            <nav className={{ display: 'flex', gap: '0.5rem', marginLeft: '2rem' }}>
              {['web', 'agi', 'search'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => console.log('Tab functionality disabled:', tab)}
                  className={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    textTransform: 'capitalize',
                    fontWeight: '500',
                    backgroundColor: activeTab === tab ? '#dbeafe' : 'transparent',
                    color: activeTab === tab ? '#1d4ed8' : '#6b7280',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Search Interface */}
        <div className={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem' }}>
          <div className={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            padding: '1.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
          }}>
            <h2 className={{ 
              fontSize: '1.875rem', 
              fontWeight: 'bold', 
              textAlign: 'center', 
              marginBottom: '2rem', 
              color: '#1f2937' 
            }}>
              AI-Powered Search & Navigation
            </h2>

            <div className={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={() => console.log('Search functionality disabled')}
                placeholder="Search the web with AI assistance..."
                className={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1.125rem'
                }}
              />
              <button 
                onClick={() => console.log('Search:', searchQuery)}
                className={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                Search
              </button>
            </div>

            {/* Status indicator */}
            <div className={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              justifyContent: 'center', 
              color: '#059669', 
              fontSize: '0.875rem' 
            }}>
              <div className={{ 
                width: '0.5rem', 
                height: '0.5rem', 
                borderRadius: '50%', 
                backgroundColor: '#10b981' 
              }} />
              AI Engine Ready
            </div>
          </div>

          {/* Feature Cards */}
          <div className={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem', 
            marginTop: '2rem' 
          }}>
            <div className={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
              textAlign: 'center' 
            }}>
              <h3 className={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem', 
                color: '#2563eb' 
              }}>
                Smart Search
              </h3>
              <p className={{ color: '#6b7280' }}>
                AI-powered search with contextual understanding
              </p>
            </div>

            <div className={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
              textAlign: 'center' 
            }}>
              <h3 className={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem', 
                color: '#059669' 
              }}>
                Real-time AGI
              </h3>
              <p className={{ color: '#6b7280' }}>
                Advanced general intelligence assistance
              </p>
            </div>

            <div className={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
              textAlign: 'center' 
            }}>
              <h3 className={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem', 
                color: '#7c3aed' 
              }}>
                Multi-Tab Support
              </h3>
              <p className={{ color: '#6b7280' }}>
                Seamless browsing experience with tab management
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
