/**
 * EuroWeb Platform Control Center
 * Main navigation hub for all platform systems
 * 
 * @author Ledjan Ahmati
 * @version 8.1.0-CONTROL-CENTER
 * @contact dealsjona@gmail.com
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface SystemRoute {
  name: string
  description: string
  route: string
  icon: string
  gradient: string
  status: 'Online' | 'Beta' | 'Development'
}

export default function ControlCenter() {
  const systemRoutes: SystemRoute[] = [
    {
      name: "AGI Core Engine",
      description: "Advanced General Intelligence Processing Core",
      route: "/agi-core",
      icon: "🧠",
      gradient: "from-purple-600 to-blue-600",
      status: "Online"
    },
    {
      name: "Space Communication",
      description: "Ionospheric Monitoring • Satellite Network • Earth Wave Analysis",
      route: "/space-comm",
      icon: "🌌",
      gradient: "from-indigo-600 via-purple-600 to-blue-600",
      status: "Online"
    },
    {
      name: "Space Systems",
      description: "Satellite Networks • Deep Space Communication",
      route: "/space",
      icon: "🚀",
      gradient: "from-indigo-600 via-purple-600 to-blue-600",
      status: "Online"
    },
    {
      name: "Security Command",
      description: "Guardian Engine • DDoS Protection • Intrusion Response",
      route: "/security",
      icon: "🛡️",
      gradient: "from-red-600 to-orange-600",
      status: "Online"
    },
    {
      name: "Mesh Network Control",
      description: "LoRa IoT Network • Node Management • Signal Analysis",
      route: "/mesh",
      icon: "🌐",
      gradient: "from-green-600 to-emerald-600",
      status: "Online"
    },
    {
      name: "LoRa Mesh Network",
      description: "Interactive mesh network topology and control",
      route: "/lora-mesh",
      icon: "📡",
      gradient: "from-violet-600 to-purple-600",
      status: "Online"
    },
    {
      name: "Network Monitor",
      description: "Real-time Network Analysis & Performance Monitoring",
      route: "/network-monitor",
      icon: "📊",
      gradient: "from-green-600 to-teal-600",
      status: "Beta"
    },
    {
      name: "Development Sandbox",
      description: "Industrial Development Environment & Testing Playground",
      route: "/dev-sandbox",
      icon: "🛠️",
      gradient: "from-orange-600 to-red-600",
      status: "Development"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return '#22c55e'
      case 'Beta': return '#f59e0b'
      case 'Development': return '#6366f1'
      default: return '#64748b'
    }
  }

  return (
    <div style={{
      padding: '20px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e293b 75%, #0f172a 100%)',
      color: '#f8fafc'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: 800,
          background: 'linear-gradient(45deg, #60a5fa, #a78bfa, #34d399, #fbbf24)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '15px'
        }}>
          🌐 EuroWeb Platform Control Center
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#94a3b8',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          Industrial-grade AGI platform with advanced communication, security, and mesh networking capabilities
        </p>
      </div>

      {/* System Status Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#22c55e', marginBottom: '5px' }}>
            {systemRoutes.filter(s => s.status === 'Online').length}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Systems Online</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🧪</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b', marginBottom: '5px' }}>
            {systemRoutes.filter(s => s.status === 'Beta').length}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Beta Systems</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚙️</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#6366f1', marginBottom: '5px' }}>
            {systemRoutes.filter(s => s.status === 'Development').length}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>In Development</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚀</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#a855f7', marginBottom: '5px' }}>
            {systemRoutes.length}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Total Systems</div>
        </motion.div>
      </div>

      {/* System Routes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {systemRoutes.map((system, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
          >
            <Link href={system.route} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: `linear-gradient(135deg, ${system.gradient.replace('from-', '').replace('to-', '').replace('-600', '').split(' ').map(c => `var(--${c}-600)`).join(', ')})`,
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>{system.icon}</div>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  color: 'white', 
                  margin: '0 0 5px 0' 
                }}>
                  {system.name}
                </h3>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'white'
                }}>
                  {system.status}
                </div>
              </div>
              
              <div style={{ padding: '20px' }}>
                <p style={{ 
                  color: '#94a3b8', 
                  fontSize: '14px', 
                  lineHeight: '1.5',
                  margin: '0 0 15px 0'
                }}>
                  {system.description}
                </p>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: `${getStatusColor(system.status)}20`,
                    border: `1px solid ${getStatusColor(system.status)}40`,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: getStatusColor(system.status)
                  }}>
                    {system.status}
                  </div>
                  
                  <div style={{
                    fontSize: '14px',
                    color: '#60a5fa',
                    fontWeight: 600
                  }}>
                    Access System →
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '60px',
        textAlign: 'center',
        paddingTop: '40px',
        borderTop: '1px solid rgba(99, 102, 241, 0.2)'
      }}>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          EuroWeb Platform v8.1.0 | Created by <strong style={{ color: '#a855f7' }}>Ledjan Ahmati</strong>
        </p>
        <p style={{ color: '#64748b', fontSize: '12px', marginTop: '10px' }}>
          Industrial-grade AGI • Real-time neural processing • Advanced security systems
        </p>
      </div>
    </div>
  )
}
