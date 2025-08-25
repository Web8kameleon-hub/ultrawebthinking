/**
 * Navigation Test Page
 * Test page to check routing and components
 * 
 * @author Ledjan Ahmati
 * @version 1.0.0
 */

'use client'

import Link from 'next/link'

export default function NavigationTest() {
    return (
        <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            minHeight: '100vh',
            color: '#e2e8f0',
            padding: '40px'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center'
            }}>
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: 700,
                    marginBottom: '20px',
                    background: 'linear-gradient(45deg, #60a5fa, #a78bfa)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                }}>
                    🚀 EuroWeb Ultra Platform
                </h1>

                <p style={{
                    fontSize: '18px',
                    marginBottom: '40px',
                    color: '#94a3b8'
                }}>
                    Platform Navigation - Test All Components
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginTop: '40px'
                }}>

                    {/* Ultra Dashboard */}
                    <Link href="/ultra-dashboard" style={{
                        display: 'block',
                        padding: '30px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid #3b82f6',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: '#e2e8f0',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎛️</div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#60a5fa' }}>Ultra Dashboard</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>
                            Main system integration dashboard
                        </p>
                    </Link>

                    {/* AGI Office Suite */}
                    <Link href="/agi-office-suite" style={{
                        display: 'block',
                        padding: '30px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid #10b981',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: '#e2e8f0',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#34d399' }}>AGI Office Suite</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>
                            Universal office tools - Students to NATO
                        </p>
                    </Link>

                    {/* Aviation Weather */}
                    <Link href="/aviation-weather" style={{
                        display: 'block',
                        padding: '30px',
                        background: 'rgba(124, 58, 237, 0.1)',
                        border: '1px solid #7c3aed',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: '#e2e8f0',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>✈️</div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#a78bfa' }}>Aviation Weather</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>
                            SAT + METAR/TAF + NWP forecasts
                        </p>
                    </Link>

                    {/* Location Demo */}
                    <Link href="/location-demo" style={{
                        display: 'block',
                        padding: '30px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid #f59e0b',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: '#e2e8f0',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>📍</div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#fbbf24' }}>Location Demo</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>
                            Configurable station locations
                        </p>
                    </Link>

                    {/* Web8TabSystem Ultra */}
                    <Link href="/web8-tabs" style={{
                        display: 'block',
                        padding: '30px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: '#e2e8f0',
                        transition: 'all 0.3s ease',
                        gridColumn: '1 / -1'
                    }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚀</div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#ef4444', fontSize: '20px' }}>
                            Web8TabSystem Ultra - NEW!
                        </h3>
                        <p style={{ margin: 0, fontSize: '16px', color: '#94a3b8' }}>
                            🎯 Advanced Tab-Based UI/UX System - Unifies ALL modules in one powerful interface!
                        </p>
                        <div style={{
                            marginTop: '12px',
                            padding: '8px 16px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#fca5a5'
                        }}>
                            ⚡ Real-time metrics • 📊 Professional dashboards • 🛠️ All engines integrated
                        </div>
                    </Link>

                </div>

                <div style={{
                    marginTop: '60px',
                    padding: '20px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '12px',
                    border: '1px solid #334155'
                }}>
                    <h3 style={{ color: '#60a5fa', marginBottom: '15px' }}>Platform Status</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Server</div>
                            <div style={{ fontSize: '16px', color: '#10b981' }}>🟢 Online</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Components</div>
                            <div style={{ fontSize: '16px', color: '#10b981' }}>✅ Active</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Routes</div>
                            <div style={{ fontSize: '16px', color: '#3b82f6' }}>📡 Ready</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Version</div>
                            <div style={{ fontSize: '16px', color: '#a78bfa' }}>v8.4.0</div>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: '30px',
                    fontSize: '14px',
                    color: '#6b7280'
                }}>
                    EuroWeb Ultra Platform | Created by Ledjan Ahmati | {new Date().toLocaleString()}
                </div>

            </div>
        </div>
    )
}
