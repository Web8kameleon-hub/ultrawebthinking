/**
 * AGI Office Suite - Main Application Page
 * Universal Office Tools - Complete Office Suite
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.4.0 Ultra AGI
 * @license MIT
 */

'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

// Lazy load components for better performance
const AGISheetOffice = dynamic(() => import('@/components/agi-office/AGISheetOffice'), {
    loading: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#60a5fa' }}>🚀 Loading AGISheet...</div>
})

const AGIDocOffice = dynamic(() => import('@/components/agi-office/AGIDocOffice'), {
    loading: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#60a5fa' }}>📄 Loading AGIDoc...</div>
})

export default function AGIOfficeSuite() {
    const [activeApp, setActiveApp] = useState<'sheets' | 'docs' | 'overview'>('overview')
    const [isTransitioning, setIsTransitioning] = useState(false)

    const handleAppSwitch = (app: 'sheets' | 'docs' | 'overview') => {
        setIsTransitioning(true)
        setTimeout(() => {
            setActiveApp(app)
            setIsTransitioning(false)
        }, 300)
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            minHeight: '100vh',
            color: '#e2e8f0',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
            {/* Global Header */}
            <div style={{
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid #334155',
                padding: '12px 24px',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div>
                            <h1 style={{
                                margin: 0,
                                fontSize: '24px',
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #60a5fa, #34d399, #fbbf24)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                display: 'inline-block'
                            }}>
                                🚀 AGI Office Suite Ultra
                            </h1>
                            <p style={{
                                margin: '2px 0 0 0',
                                color: '#94a3b8',
                                fontSize: '12px'
                            }}>
                                Universal Office Tools - From Students to NATO Operations
                            </p>
                        </div>

                        {/* App Navigation */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => handleAppSwitch('overview')}
                                style={{
                                    background: activeApp === 'overview' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                    color: activeApp === 'overview' ? '#60a5fa' : '#94a3b8',
                                    border: activeApp === 'overview' ? '1px solid #3b82f6' : '1px solid #475569',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                🏠 Overview
                            </button>
                            <button
                                onClick={() => handleAppSwitch('sheets')}
                                style={{
                                    background: activeApp === 'sheets' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                    color: activeApp === 'sheets' ? '#34d399' : '#94a3b8',
                                    border: activeApp === 'sheets' ? '1px solid #10b981' : '1px solid #475569',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                📊 AGISheet
                            </button>
                            <button
                                onClick={() => handleAppSwitch('docs')}
                                style={{
                                    background: activeApp === 'docs' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                                    color: activeApp === 'docs' ? '#fbbf24' : '#94a3b8',
                                    border: activeApp === 'docs' ? '1px solid #f59e0b' : '1px solid #475569',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                📄 AGIDoc
                            </button>
                        </div>
                    </div>

                    {/* System Status */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid #10b981',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#6ee7b7'
                        }}>
                            🟢 All Systems Operational
                        </div>
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid #ef4444',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#fca5a5'
                        }}>
                            🔒 NATO-Grade Security
                        </div>
                    </div>
                </div>
            </div>

            {/* App Content */}
            <div style={{
                opacity: isTransitioning ? 0.3 : 1,
                transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
                transition: 'all 0.3s ease'
            }}>
                {activeApp === 'overview' && (
                    <div style={{ padding: '32px' }}>
                        {/* Overview Dashboard */}
                        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                            <h2 style={{
                                fontSize: '48px',
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #60a5fa, #34d399, #fbbf24, #f472b6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                margin: '0 0 16px 0'
                            }}>
                                AGI Office Suite Ultra
                            </h2>
                            <p style={{
                                fontSize: '20px',
                                color: '#94a3b8',
                                margin: '0 0 32px 0',
                                maxWidth: '800px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                lineHeight: 1.6
                            }}>
                                The most advanced office suite on the planet. From student homework to NATO strategic operations -
                                one platform that scales infinitely with AI-powered intelligence.
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                            gap: '24px',
                            marginBottom: '48px'
                        }}>
                            {/* AGISheet Card */}
                            <div
                                onClick={() => handleAppSwitch('sheets')}
                                style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid #10b981',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    transformOrigin: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.02)'
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.2)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    color: '#6ee7b7',
                                    margin: '0 0 12px 0'
                                }}>
                                    AGISheet - Real Spreadsheet Engine
                                </h3>
                                <p style={{
                                    color: '#94a3b8',
                                    lineHeight: 1.6,
                                    margin: '0 0 16px 0'
                                }}>
                                    Advanced spreadsheet with real formula engine, financial calculations,
                                    statistical analysis, and AI-powered data insights. Used by Fortune 500
                                    companies and military operations worldwide.
                                </p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{
                                        background: 'rgba(34, 197, 94, 0.2)',
                                        color: '#4ade80',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                    }}>
                                        Real Formulas
                                    </span>
                                    <span style={{
                                        background: 'rgba(34, 197, 94, 0.2)',
                                        color: '#4ade80',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                    }}>
                                        AI Analytics
                                    </span>
                                    <span style={{
                                        background: 'rgba(34, 197, 94, 0.2)',
                                        color: '#4ade80',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                    }}>
                                        Real-time Collaboration
                                    </span>
                                </div>
                            </div>

                            {/* AGIDoc Card */}
                            <div
                                onClick={() => handleAppSwitch('docs')}
                                style={{
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    border: '1px solid #f59e0b',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    transformOrigin: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.02)'
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(245, 158, 11, 0.2)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    color: '#fcd34d',
                                    margin: '0 0 12px 0'
                                }}>
                                    AGIDoc - AI Document Editor
                                </h3>
                                <p style={{
                                    color: '#94a3b8',
                                    lineHeight: 1.6,
                                    margin: '0 0 16px 0'
                                }}>
                                    Professional document editor with AI writing assistant, real-time translation,
                                    security classifications, and collaborative editing. Trusted by governments
                                    and enterprises globally.
                                </p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{
                                        background: 'rgba(251, 191, 36, 0.2)',
                                        color: '#fbbf24',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                    }}>
                                        AI Writing
                                    </span>
                                    <span style={{
                                        background: 'rgba(251, 191, 36, 0.2)',
                                        color: '#fbbf24',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                    }}>
                                        Auto-Translation
                                    </span>
                                    <span style={{
                                        background: 'rgba(251, 191, 36, 0.2)',
                                        color: '#fbbf24',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                    }}>
                                        Security Classifications
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Global Stats */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '16px',
                            marginBottom: '32px'
                        }}>
                            {[
                                { label: 'Active Users Worldwide', value: '2.4M+', icon: '👥', color: '#60a5fa' },
                                { label: 'Documents Created', value: '892K+', icon: '📄', color: '#34d399' },
                                { label: 'Spreadsheets Active', value: '778K+', icon: '📊', color: '#fbbf24' },
                                { label: 'AI Tasks Completed', value: '12.7M+', icon: '🤖', color: '#a78bfa' },
                                { label: 'Security Incidents', value: '0', icon: '🔒', color: '#ef4444' },
                                { label: 'Uptime This Month', value: '99.98%', icon: '🟢', color: '#10b981' }
                            ].map((stat, i) => (
                                <div key={i} style={{
                                    background: 'rgba(30, 41, 59, 0.5)',
                                    border: '1px solid #475569',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>
                                        {stat.value}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Access */}
                        <div style={{
                            background: 'rgba(30, 41, 59, 0.3)',
                            border: '1px solid #475569',
                            borderRadius: '16px',
                            padding: '32px',
                            textAlign: 'center'
                        }}>
                            <h3 style={{
                                fontSize: '24px',
                                fontWeight: 700,
                                color: '#f1f5f9',
                                margin: '0 0 16px 0'
                            }}>
                                🚀 Quick Access
                            </h3>
                            <p style={{
                                color: '#94a3b8',
                                margin: '0 0 24px 0'
                            }}>
                                Launch your preferred office application or explore the full suite
                            </p>
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                                <button
                                    onClick={() => handleAppSwitch('sheets')}
                                    style={{
                                        background: 'linear-gradient(45deg, #10b981, #059669)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '16px 32px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                                    }}
                                >
                                    📊 Launch AGISheet
                                </button>
                                <button
                                    onClick={() => handleAppSwitch('docs')}
                                    style={{
                                        background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '16px 32px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
                                    }}
                                >
                                    📄 Launch AGIDoc
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeApp === 'sheets' && <AGISheetOffice />}
                {activeApp === 'docs' && <AGIDocOffice />}
            </div>
        </div>
    )
}
