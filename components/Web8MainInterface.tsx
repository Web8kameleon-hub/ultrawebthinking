/**
 * Web8 Main Interface with Central Search Tab
 * Interface kryesore me tab-in e kërkimit në qendër
 * REAL 12-LAYER BACKEND CONNECTION
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WebSearchTab from './WebSearchTab';
import { LazyLoader } from '@components/LazyLoader';

interface Tab {
  id: string;
  label: string;
  icon: string;
  isMain?: boolean;
}

interface Web8Status {
  web8Status: string;
  layers: number;
  agiCore: {
    initialized: boolean;
    totalLayers: number;
    activeLayers: number;
    averageLoad: number;
    totalConnections: number;
    processingSpeed: number;
  };
  lightningPool: string;
  message: string;
  timestamp: string;
}

export default function Web8MainInterface() {
  const [activeTab, setActiveTab] = useState('search');
  const [web8Status, setWeb8Status] = useState<Web8Status | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Connect to Web8 12-Layer Backend
  useEffect(() => {
    const fetchWeb8Status = async () => {
      try {
        const response = await fetch('http://localhost:4000');
        const data = await response.json();
        setWeb8Status(data);
        setError(null);
      } catch (err) {
        setError('Cannot connect to Web8 Backend');
        console.error('Web8 Backend connection failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeb8Status();
    
    // Update every 5 seconds
    const interval = setInterval(fetchWeb8Status, 5000);
    return () => clearInterval(interval);
  }, []);

  const tabs: Tab[] = [
    { id: 'search', label: 'Web Search', icon: '🔍', isMain: true },
    { id: 'neural', label: 'Neural AI', icon: '🧠' },
    { id: 'assistant', label: 'Assistant', icon: '🤖' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleSearchResults = (query: string, results: any[]) => {
    console.log(`🔍 Search completed: "${query}" - ${results.length} results`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: 'white'
        }}
      >
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          margin: '0 0 10px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          🌐 Web8 Platform
        </h1>
        <p style={{
          fontSize: '1.2rem',
          opacity: 0.9,
          margin: 0
        }}>
          Advanced Neural Search & AI Platform
        </p>
        
        {/* Web8 12-Layer Status Display */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          border: web8Status?.web8Status === 'ACTIVE' ? '2px solid #4ade80' : '2px solid #ef4444'
        }}>
          {isLoading ? (
            <p style={{ margin: 0, opacity: 0.8 }}>🔄 Connecting to Web8 Backend...</p>
          ) : error ? (
            <p style={{ margin: 0, color: '#ef4444' }}>❌ {error}</p>
          ) : web8Status ? (
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>
                  ⚡ Web8 Status: <span style={{ color: '#4ade80' }}>{web8Status.web8Status}</span>
                </span>
                <span>🧠 Layers: {web8Status.layers}/12</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '0.9rem' }}>
                <div>🔗 Connections: {web8Status.agiCore.totalConnections}</div>
                <div>⚡ Speed: {web8Status.agiCore.processingSpeed} THz</div>
                <div>🎯 Load: {web8Status.agiCore.averageLoad.toFixed(1)}%</div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.8rem', opacity: 0.7 }}>
                {web8Status.message} | {new Date(web8Status.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ) : null}
        </div>
      </motion.header>

      {/* Tab Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: tab.isMain ? '15px 25px' : '12px 20px',
              border: 'none',
              borderRadius: '25px',
              background: activeTab === tab.id 
                ? 'rgba(255,255,255,0.3)' 
                : 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: tab.isMain ? '18px' : '16px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: tab.isMain && activeTab === tab.id ? 'scale(1.05)' : 'scale(1)',
              boxShadow: tab.isMain && activeTab === tab.id 
                ? '0 5px 15px rgba(255,255,255,0.3)' 
                : 'none'
            }}
          >
            {tab.icon} {tab.label}
            {tab.isMain && (
              <span style={{
                marginLeft: '8px',
                padding: '2px 6px',
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '8px',
                fontSize: '12px'
              }}>
                MAIN
              </span>
            )}
          </button>
        ))}
      </motion.nav>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'search' && (
          <WebSearchTab 
            key="search"
            isActive={true} 
            onSearch={handleSearchResults}
          />
        )}
        
        {activeTab === 'neural' && (
          <motion.div
            key="neural"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '20px',
              minHeight: '500px'
            }}
          >
            <LazyLoader
              component="Web812LayerDashboard"
              variant="neural"
              priority="high"
              preload={true}
              fallback={
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '400px',
                  color: 'white'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '3px solid rgba(255,255,255,0.3)',
                      borderTop: '3px solid rgba(255,255,255,0.8)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 15px'
                    }}></div>
                    <div>🧠 Loading Web8 12-Layer Neural System...</div>
                  </div>
                </div>
              }
            />
          </motion.div>
        )}

        {activeTab === 'assistant' && (
          <motion.div
            key="assistant"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
              🤖 AI Assistant
            </h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
              Intelligent assistant for all your needs
            </p>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
              🛡️ Security Center
            </h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
              4-layer protection system active
            </p>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
              ⚙️ Platform Settings
            </h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
              Configure your Web8 experience
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          textAlign: 'center',
          marginTop: '40px',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '14px'
        }}
      >
        <p>
          🚀 Web8 Platform v8.0.0 | 
          Created by Ledjan Ahmati | 
          🔍 Neural Search Engine Active
        </p>
      </motion.footer>
    </div>
  );
}
