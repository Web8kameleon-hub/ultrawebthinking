/**
 * EuroWeb Web8 Platform - Tab System Component (Fixed)
 * Pure TypeScript Industrial Architecture - No Hooks
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AGIMedUltra } from './AGISheet/AGIMedUltra'
import { AGIOfficeUltra } from './AGISheet/AGIOfficeUltra'
import { AGIEcoUltra } from './AGISheet/AGIEcoUltra'
import { AGIElUltra } from './AGISheet/AGIElUltra'
import { AGICoreUltra } from './AGISheet/AGICoreUltra'
import GuardianMonitor from './GuardianMonitor'

// Interface definitions
interface Tab {
  id: string
  title: string
  url: string
  isActive: boolean
  isLoading: boolean
}

interface AGIMetrics {
  processingSpeed: string
  memoryUsage: string
  neuralConnections: number
  learningRate: number
  securityLevel: string
  latency: number
  throughput: string
  activeNodes: number
}

// Static initial data
const initialTabs: Tab[] = [
  {
    id: 'dashboard',
    title: '🧠 AGI Dashboard',
    url: 'euroweb://dashboard',
    isActive: true,
    isLoading: false
  },
  {
    id: 'agi-core',
    title: '🤖 AGI Core (Premium)',
    url: 'euroweb://agi-core-premium',
    isActive: false,
    isLoading: false
  },
  {
    id: 'agi-office',
    title: '💼 AGI×Office',
    url: 'euroweb://agi-office',
    isActive: false,
    isLoading: false
  },
  {
    id: 'agi-med',
    title: '🏥 AGI×Med',
    url: 'euroweb://agi-med',
    isActive: false,
    isLoading: false
  },
  {
    id: 'agi-el',
    title: '⚡ AGI×El',
    url: 'euroweb://agi-el',
    isActive: false,
    isLoading: false
  },
  {
    id: 'agi-eco',
    title: '🌱 AGI×Eco',
    url: 'euroweb://agi-eco',
    isActive: false,
    isLoading: false
  },
  {
    id: 'search',
    title: '🔍 AGI Search',
    url: 'euroweb://search',
    isActive: false,
    isLoading: false
  },
  {
    id: 'guardian',
    title: '🛡️ Guardian',
    url: 'euroweb://guardian',
    isActive: false,
    isLoading: false
  }
];

const staticAGIMetrics: AGIMetrics = {
  processingSpeed: '2.5 THz',
  memoryUsage: 'Optimal',
  neuralConnections: 3847,
  learningRate: 0.97,
  securityLevel: 'Quantum Protected',
  latency: 12,
  throughput: '1.2 GB/s',
  activeNodes: 28
};

/**
 * Web8 Tab System Component
 * Industrial architecture without React hooks
 */
const Web8TabSystem: React.FC = () => {
  const tabs = initialTabs
  const activeTab = tabs.find(tab => tab.isActive) || tabs[0]
  const agiMetrics = staticAGIMetrics
  const currentTime = new Date().toLocaleTimeString()

  // Search functionality
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const searchInput = form.querySelector('input[name="search"]') as HTMLInputElement
    const searchTerm = searchInput.value.trim()
    
    if (searchTerm) {
      // Switch to search tab and show results
      switchTab('search')
      
      // Update search results
      const searchResults = document.getElementById('search-results')
      if (searchResults) {
        searchResults.innerHTML = `
          <div style="margin-bottom: 24px;">
            <h3 style="color: #d4af37; margin-bottom: 16px;">Rezultatet e kërkimit për: "${searchTerm}"</h3>
            <div style="display: grid; gap: 16px;">
              <div style="background: rgba(45, 52, 70, 0.8); border: 1px solid #d4af37; border-radius: 8px; padding: 16px;">
                <h4 style="color: #22c55e; margin: 0 0 8px 0;">🏥 AGI×Med - Diagnostic Tools</h4>
                <p style="color: #cbd5e1; margin: 0; font-size: 14px;">Advanced AI diagnostic systems match your search criteria.</p>
              </div>
              <div style="background: rgba(45, 52, 70, 0.8); border: 1px solid #d4af37; border-radius: 8px; padding: 16px;">
                <h4 style="color: #3b82f6; margin: 0 0 8px 0;">🌱 AGI×Eco - Environmental Data</h4>
                <p style="color: #cbd5e1; margin: 0; font-size: 14px;">Climate monitoring and sustainability metrics related to your search.</p>
              </div>
              <div style="background: rgba(45, 52, 70, 0.8); border: 1px solid #d4af37; border-radius: 8px; padding: 16px;">
                <h4 style="color: #8b5cf6; margin: 0 0 8px 0;">⚡ AGI×El - Energy Systems</h4>
                <p style="color: #cbd5e1; margin: 0; font-size: 14px;">Smart energy grid data and optimization results.</p>
              </div>
              <div style="background: rgba(45, 52, 70, 0.8); border: 1px solid #d4af37; border-radius: 8px; padding: 16px;">
                <h4 style="color: #f59e0b; margin: 0 0 8px 0;">💼 AGI×Office - Documents</h4>
                <p style="color: #cbd5e1; margin: 0; font-size: 14px;">Office documents and productivity tools matching your query.</p>
              </div>
            </div>
          </div>
        `
      }
      
      // Clear search
      searchInput.value = ''
    }
  }

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value
    // Real-time search feedback could be added here
    console.log('Searching for:', searchTerm)
  }

  // Tab switching function
  const switchTab = (targetId: string) => {
    // Hide all content
    const allContent = document.querySelectorAll('[data-content-id]');
    allContent.forEach(content => {
      (content as HTMLElement).style.display = 'none';
    });
    
    // Show target content
    const targetContent = document.querySelector(`[data-content-id="${targetId}"]`);
    if (targetContent) {
      (targetContent as HTMLElement).style.display = 'block';
    }
    
    // Update tab styles
    const allTabs = document.querySelectorAll('[data-tab-id]');
    allTabs.forEach(tab => {
      const tabElement = tab as HTMLElement;
      tabElement.style.background = 'transparent';
      tabElement.style.border = '1px solid transparent';
      tabElement.style.color = '#cbd5e1';
    });
    
    const activeTabElement = document.querySelector(`[data-tab-id="${targetId}"]`) as HTMLElement;
    if (activeTabElement) {
      activeTabElement.style.background = 'rgba(212, 175, 55, 0.2)';
      activeTabElement.style.border = '1px solid #d4af37';
      activeTabElement.style.color = '#d4af37';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1d29 25%, #2d2a45 50%, #1e2a4a 75%, #243447 100%)',
      color: '#f8fafc',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navigation Bar */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'rgba(45, 52, 70, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Left side - Logo and navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 700,
            background: 'linear-gradient(45deg, #d4af37, #f7e08b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            EuroWeb
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="search"
                placeholder="🔍 Kërko në AGI Platform..."
                onChange={handleSearchInput}
                style={{
                  background: 'rgba(45, 52, 70, 0.8)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#f8fafc',
                  fontSize: '14px',
                  width: '280px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #d4af37'
                  e.target.style.boxShadow = '0 0 0 2px rgba(212, 175, 55, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(212, 175, 55, 0.3)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid #d4af37',
                color: '#d4af37',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Kërko
            </button>
          </form>
          
          <nav style={{ display: 'flex', gap: '16px' }}>
            <button style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid #d4af37',
              color: '#d4af37',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              🧠 AGI Core
            </button>
            <button style={{
              background: 'transparent',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#cbd5e1',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              📊 Analytics
            </button>
          </nav>
        </div>

        {/* Right side - Status and time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            background: 'rgba(34, 197, 94, 0.2)',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#22c55e',
              borderRadius: '50%'
            }} />
            AGI Active
          </div>
          <div style={{ fontSize: '14px', color: '#cbd5e1' }}>
            {currentTime}
          </div>
        </div>
      </motion.header>

      {/* Tab Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          background: 'rgba(30, 34, 52, 0.8)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          minHeight: '48px'
        }}
      >
        {tabs.map((tab) => {
          const isPremiumTab = tab.id === 'agi-core';
          return (
            <div
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => switchTab(tab.id)}
              style={{
                background: tab.isActive ? 'rgba(212, 175, 55, 0.2)' : 
                           isPremiumTab ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                border: tab.isActive ? '1px solid #d4af37' : 
                        isPremiumTab ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid transparent',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                color: tab.isActive ? '#d4af37' : 
                       isPremiumTab ? '#f7e08b' : '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                maxWidth: '200px',
                position: 'relative'
              }}
            >
              {isPremiumTab && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'linear-gradient(45deg, #d4af37, #f7e08b)',
                  borderRadius: '50%',
                  width: '12px',
                  height: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px'
                }}>
                  👑
                </div>
              )}
              {tab.isLoading && (
                <div style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid rgba(212, 175, 55, 0.3)',
                  borderTop: '2px solid #d4af37',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              )}
              <span style={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {tab.title}
              </span>
              <button style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                fontSize: '12px',
                cursor: 'pointer',
                opacity: 0.7,
                padding: '0',
                marginLeft: 'auto'
              }}>
                ×
              </button>
            </div>
          );
        })}
        
        <button style={{
          background: 'none',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '6px',
          color: '#cbd5e1',
          padding: '6px 12px',
          fontSize: '14px',
          cursor: 'pointer',
          marginLeft: '8px'
        }}>
          + New Tab
        </button>
      </motion.div>

      {/* Address Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          background: 'rgba(26, 29, 41, 0.9)',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: 'none',
              borderRadius: '4px',
              color: '#d4af37',
              padding: '6px 8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              ←
            </button>
            <button style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: 'none',
              borderRadius: '4px',
              color: '#d4af37',
              padding: '6px 8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              →
            </button>
            <button style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: 'none',
              borderRadius: '4px',
              color: '#d4af37',
              padding: '6px 8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              ↻
            </button>
          </div>

          <input
            type="text"
            value={activeTab.url}
            readOnly
            style={{
              flex: 1,
              background: 'rgba(45, 52, 70, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '6px',
              padding: '8px 12px',
              color: '#f8fafc',
              fontSize: '14px'
            }}
          />

          <button style={{
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid #22c55e',
            borderRadius: '6px',
            color: '#22c55e',
            padding: '8px 12px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            🛡️ Secure
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden'
        }}
      >
        {/* Content Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(15, 20, 25, 0.8)'
        }}>
          {/* Dashboard Content */}
          <div data-content-id="dashboard" style={{
            padding: '40px',
            textAlign: 'center',
            display: 'block'
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 800,
              marginBottom: '20px',
              background: 'linear-gradient(45deg, #d4af37, #f7e08b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              AGI Core Dashboard
            </h1>
            <p style={{ fontSize: '20px', color: '#cbd5e1', marginBottom: '40px' }}>
              Advanced General Intelligence System - Industrial Grade TypeScript Architecture
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {Object.entries(agiMetrics).map(([key, value]) => (
                <motion.div key={key} whileHover={{ scale: 1.05 }} style={{
                  background: 'rgba(45, 52, 70, 0.8)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#d4af37', marginBottom: '8px' }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '14px', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AGI Core Content - Premium Only */}
          <div data-content-id="agi-core" style={{
            display: 'none',
            height: '100%',
            overflow: 'auto',
            padding: '40px',
            textAlign: 'center',
            background: 'rgba(15, 20, 25, 0.9)'
          }}>
            <div style={{
              background: 'rgba(45, 52, 70, 0.8)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '16px',
              padding: '48px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔒</div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: 700,
                marginBottom: '16px',
                background: 'linear-gradient(45deg, #d4af37, #f7e08b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                AGI Core Premium
              </h1>
              <p style={{ 
                fontSize: '18px', 
                color: '#cbd5e1', 
                marginBottom: '32px',
                lineHeight: '1.6'
              }}>
                AGI Core është i disponueshëm vetëm për përdoruesit Premium. 
                Kjo është zona më e avancuar e sistemit tonë të inteligjencës artificiale.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '16px',
                marginBottom: '32px',
                textAlign: 'left'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#22c55e'
                }}>
                  <span>✓</span>
                  <span>Quantum Neural Networks</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#22c55e'
                }}>
                  <span>✓</span>
                  <span>Advanced Learning Algorithms</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#22c55e'
                }}>
                  <span>✓</span>
                  <span>Unlimited Processing Power</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#22c55e'
                }}>
                  <span>✓</span>
                  <span>Real-time Global Intelligence</span>
                </div>
              </div>
              <button style={{
                background: 'linear-gradient(45deg, #d4af37, #f7e08b)',
                border: 'none',
                borderRadius: '12px',
                color: '#000',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                marginRight: '16px'
              }}>
                🚀 Upgrade to Premium
              </button>
              <button style={{
                background: 'transparent',
                border: '2px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '12px',
                color: '#d4af37',
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                📋 Learn More
              </button>
            </div>
          </div>

          {/* AGI×Office Content */}
          <div data-content-id="agi-office" style={{
            display: 'none',
            height: '100%',
            overflow: 'auto'
          }}>
            <AGIOfficeUltra />
          </div>

          {/* AGI×Med Content */}
          <div data-content-id="agi-med" style={{
            display: 'none',
            height: '100%',
            overflow: 'auto'
          }}>
            <AGIMedUltra />
          </div>

          {/* AGI×El Content */}
          <div data-content-id="agi-el" style={{
            display: 'none',
            height: '100%',
            overflow: 'auto'
          }}>
            <AGIElUltra />
          </div>

          {/* AGI×Eco Content */}
          <div data-content-id="agi-eco" style={{
            display: 'none',
            height: '100%',
            overflow: 'auto'
          }}>
            <AGIEcoUltra />
          </div>

          {/* AGI Search Content */}
          <div data-content-id="search" style={{
            display: 'none',
            height: '100%',
            overflow: 'auto',
            padding: '40px'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 800,
                marginBottom: '12px',
                background: 'linear-gradient(45deg, #d4af37, #f7e08b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🔍 AGI Search Ultra
              </h1>
              <p style={{ 
                fontSize: '20px', 
                color: '#cbd5e1', 
                marginBottom: '32px' 
              }}>
                Kërko në të gjithë platformën AGI - Përdor search bar në krye të faqes
              </p>
            </div>

            {/* Search Interface */}
            <div style={{
              background: 'rgba(15, 20, 25, 0.9)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#d4af37',
                marginBottom: '16px'
              }}>
                Si të përdorësh AGI Search:
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid #22c55e',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <div style={{ color: '#22c55e', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    🏥 Medical Search
                  </div>
                  <div style={{ color: '#f8fafc', fontSize: '14px' }}>
                    Kërko për diagnostikime, trajtim mjekësor, dhe hulumtime
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <div style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    🌱 Environmental Search
                  </div>
                  <div style={{ color: '#f8fafc', fontSize: '14px' }}>
                    Kërko për klimë, mjedis, dhe qëndrueshmëri
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid #8b5cf6',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <div style={{ color: '#8b5cf6', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    ⚡ Energy Search
                  </div>
                  <div style={{ color: '#f8fafc', fontSize: '14px' }}>
                    Kërko për energji, rrjete të mençura, dhe optimizim
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid #f59e0b',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <div style={{ color: '#f59e0b', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    💼 Office Search
                  </div>
                  <div style={{ color: '#f8fafc', fontSize: '14px' }}>
                    Kërko për dokumente, tabela, dhe vegla zyre
                  </div>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div id="search-results" style={{
              background: 'rgba(15, 20, 25, 0.9)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <div style={{ textAlign: 'center', color: '#cbd5e1' }}>
                <p>Shkruaj diçka në search bar për të parë rezultatet...</p>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <p style={{ fontSize: '14px' }}>AGI Search do të kërkojë në të gjitha modulet e platformës</p>
              </div>
            </div>
          </div>
          {/* Guardian Content */}
          <div data-content-id="guardian" style={{
            display: 'none',
            height: '100%',
            overflow: 'auto'
          }}>
            <GuardianMonitor />
          </div>
        </div>
      </motion.main>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Web8TabSystem
