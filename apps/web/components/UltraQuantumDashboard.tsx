/**
 * EuroWeb Ultra - Quantum Metrics Dashboard
 * Real-time quantum metrics visualization
 * 
 * @author Ledjan Ahmati
 * @version Ultra 2.0.0 Dashboard
 * @license MIT
 */

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { getCurrentQuantumMetrics, getQuantumDisplay, getSystemHealth } from '../lib/metrics/live-metrics-collector'

interface QuantumDisplayData {
    quantum_nodes: string
    neural_connections: string
    learning_rate: string
    model_accuracy: string
    status_color: string
    quantum_state: string
}

interface MetricCardProps {
    title: string
    value: string
    unit?: string
    color: string
    icon: string
    trend?: 'up' | 'down' | 'stable'
    description?: string
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    unit = '',
    color,
    icon,
    trend = 'stable',
    description
}) => {
    const trendIcon = {
        up: '↗️',
        down: '↘️',
        stable: '→'
    }

    return (
        <div className="metric-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="metric-header">
                <span className="metric-icon">{icon}</span>
                <span className="metric-title">{title}</span>
                <span className="metric-trend">{trendIcon[trend]}</span>
            </div>
            <div className="metric-value" style={{ color }}>
                {value}
                {unit && <span className="metric-unit">{unit}</span>}
            </div>
            {description && (
                <div className="metric-description">{description}</div>
            )}
        </div>
    )
}

interface QuantumVisualizerProps {
    quantumState: string
    nodes: number
    connections: number
}

const QuantumVisualizer: React.FC<QuantumVisualizerProps> = ({
    quantumState,
    nodes,
    connections
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | undefined>(undefined)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) {return}

        const ctx = canvas.getContext('2d')
        if (!ctx) {return}

        // Set canvas size
        canvas.width = 400
        canvas.height = 300

        let frame = 0

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Background
            ctx.fillStyle = '#000011'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Quantum state visualization
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2

            // Draw quantum field
            ctx.save()
            ctx.translate(centerX, centerY)

            // Main quantum ring
            const time = frame * 0.02
            const radius = 80 + Math.sin(time) * 10

            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)

            switch (quantumState) {
                case 'entangled':
                    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.8)')
                    gradient.addColorStop(1, 'rgba(0, 255, 136, 0.1)')
                    break
                case 'coherent':
                    gradient.addColorStop(0, 'rgba(0, 170, 255, 0.8)')
                    gradient.addColorStop(1, 'rgba(0, 170, 255, 0.1)')
                    break
                case 'superposition':
                    gradient.addColorStop(0, 'rgba(255, 170, 0, 0.8)')
                    gradient.addColorStop(1, 'rgba(255, 170, 0, 0.1)')
                    break
                case 'collapsed':
                    gradient.addColorStop(0, 'rgba(255, 51, 51, 0.8)')
                    gradient.addColorStop(1, 'rgba(255, 51, 51, 0.1)')
                    break
                default:
                    gradient.addColorStop(0, 'rgba(136, 136, 136, 0.8)')
                    gradient.addColorStop(1, 'rgba(136, 136, 136, 0.1)')
            }

            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(0, 0, radius, 0, Math.PI * 2)
            ctx.fill()

            // Draw quantum nodes
            const nodeCount = Math.min(nodes, 20) // Limit visual nodes
            for (let i = 0; i < nodeCount; i++) {
                const angle = (i / nodeCount) * Math.PI * 2 + time
                const nodeRadius = 60 + Math.sin(time + i) * 20
                const x = Math.cos(angle) * nodeRadius
                const y = Math.sin(angle) * nodeRadius

                ctx.fillStyle = quantumState === 'entangled' ? '#00ff88' : '#88ccff'
                ctx.beginPath()
                ctx.arc(x, y, 3 + Math.sin(time * 2 + i) * 1, 0, Math.PI * 2)
                ctx.fill()

                // Node connections
                if (i > 0) {
                    const prevAngle = ((i - 1) / nodeCount) * Math.PI * 2 + time
                    const prevX = Math.cos(prevAngle) * (60 + Math.sin(time + i - 1) * 20)
                    const prevY = Math.sin(prevAngle) * (60 + Math.sin(time + i - 1) * 20)

                    ctx.strokeStyle = 'rgba(136, 204, 255, 0.3)'
                    ctx.lineWidth = 1
                    ctx.beginPath()
                    ctx.moveTo(prevX, prevY)
                    ctx.lineTo(x, y)
                    ctx.stroke()
                }
            }

            // Central core
            ctx.fillStyle = quantumState === 'entangled' ? '#00ff88' : '#ffffff'
            ctx.beginPath()
            ctx.arc(0, 0, 5 + Math.sin(time * 3) * 2, 0, Math.PI * 2)
            ctx.fill()

            ctx.restore()

            // Stats overlay
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
            ctx.font = '12px monospace'
            ctx.fillText(`State: ${quantumState}`, 10, 20)
            ctx.fillText(`Nodes: ${nodes}`, 10, 35)
            ctx.fillText(`Connections: ${connections.toLocaleString()}`, 10, 50)

            frame++
            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [quantumState, nodes, connections])

    return (
        <div className="quantum-visualizer">
            <canvas
                ref={canvasRef}
                style={{
                    background: 'linear-gradient(45deg, #000011, #001122)',
                    borderRadius: '8px',
                    border: '1px solid #333'
                }}
            />
        </div>
    )
}

const UltraQuantumDashboard: React.FC = () => {
    const [displayData, setDisplayData] = useState<QuantumDisplayData>({
        quantum_nodes: '0.000',
        neural_connections: '0.0M',
        learning_rate: '0.0%',
        model_accuracy: '0.0%',
        status_color: '#666666',
        quantum_state: 'offline'
    })

    const [isLive, setIsLive] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

    useEffect(() => {
        // Update every 2 seconds
        const interval = setInterval(() => {
            try {
                const newDisplayData = getQuantumDisplay()
                const quantumMetrics = getCurrentQuantumMetrics()
                const systemHealth = getSystemHealth()

                setDisplayData(newDisplayData)
                setIsLive(quantumMetrics !== null)
                setLastUpdate(new Date())

                // Log to console for debugging
                if (quantumMetrics && systemHealth) {
                    console.log('⚛️ Quantum Metrics Update:', {
                        nodes: quantumMetrics.nodes,
                        learning: quantumMetrics.learning,
                        health: systemHealth.overall,
                        state: systemHealth.quantum_state
                    })
                }
            } catch (err) {
                console.error('❌ Error updating dashboard:', err)
                setIsLive(false)
            }
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    const quantumMetrics = getCurrentQuantumMetrics()
    const systemHealth = getSystemHealth()

    return (
        <div className="ultra-quantum-dashboard">
            <style jsx>{`
        .ultra-quantum-dashboard {
          background: linear-gradient(135deg, #0a0a1a, #1a1a2e);
          color: white;
          padding: 24px;
          border-radius: 12px;
          font-family: 'Monaco', 'Consolas', monospace;
          min-height: 600px;
          border: 1px solid #333;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #333;
        }

        .dashboard-title {
          font-size: 24px;
          font-weight: bold;
          background: linear-gradient(45deg, #00ff88, #0088ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          padding: 16px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 14px;
          color: #ccc;
        }

        .metric-icon {
          font-size: 18px;
        }

        .metric-title {
          flex: 1;
          font-weight: 500;
        }

        .metric-trend {
          font-size: 12px;
        }

        .metric-value {
          font-size: 28px;
          font-weight: bold;
          font-family: 'Monaco', monospace;
          line-height: 1;
        }

        .metric-unit {
          font-size: 18px;
          opacity: 0.7;
          margin-left: 4px;
        }

        .metric-description {
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }

        .visualization-section {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 24px;
          margin-top: 24px;
        }

        .system-status {
          background: rgba(255, 255, 255, 0.03);
          padding: 20px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          font-size: 14px;
        }

        .quantum-visualizer {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .last-update {
          font-size: 12px;
          color: #666;
          text-align: center;
          margin-top: 16px;
        }

        @media (max-width: 768px) {
          .visualization-section {
            grid-template-columns: 1fr;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

            <div className="dashboard-header">
                <h1 className="dashboard-title">⚛️ Quantum Metrics Dashboard</h1>
                <div className="status-indicator">
                    <div
                        className="status-dot"
                        style={{ backgroundColor: isLive ? displayData.status_color : '#666' }}
                    />
                    <span>{isLive ? 'LIVE' : 'OFFLINE'}</span>
                </div>
            </div>

            <div className="metrics-grid">
                <MetricCard
                    title="Quantum Nodes"
                    value={displayData.quantum_nodes}
                    color={displayData.status_color}
                    icon="⚛️"
                    trend="up"
                    description="Active quantum processing nodes"
                />

                <MetricCard
                    title="Neural Connections"
                    value={displayData.neural_connections}
                    color="#00aaff"
                    icon="🧠"
                    trend="up"
                    description="Neural network synaptic connections"
                />

                <MetricCard
                    title="Learning Rate"
                    value={displayData.learning_rate}
                    color="#ff6b35"
                    icon="📈"
                    trend="stable"
                    description="Real-time learning adaptation rate"
                />

                <MetricCard
                    title="Model Accuracy"
                    value={displayData.model_accuracy}
                    color="#00ff88"
                    icon="🎯"
                    trend="up"
                    description="AI decision-making accuracy"
                />
            </div>

            <div className="visualization-section">
                <div className="system-status">
                    <h3 style={{ marginBottom: '16px', color: '#fff' }}>🔮 System Status</h3>

                    {systemHealth && (
                        <div className="status-grid">
                            <div className="status-item">
                                <span>Overall Health:</span>
                                <span style={{ color: displayData.status_color, fontWeight: 'bold' }}>
                                    {systemHealth.overall.toUpperCase()}
                                </span>
                            </div>

                            <div className="status-item">
                                <span>Quantum State:</span>
                                <span style={{ color: '#00aaff', fontWeight: 'bold' }}>
                                    {displayData.quantum_state.toUpperCase()}
                                </span>
                            </div>

                            <div className="status-item">
                                <span>AGI System:</span>
                                <span style={{
                                    color: systemHealth.subsystems.agi === 'healthy' ? '#00ff88' :
                                        systemHealth.subsystems.agi === 'warning' ? '#ffaa00' : '#ff3333'
                                }}>
                                    {systemHealth.subsystems.agi.toUpperCase()}
                                </span>
                            </div>

                            <div className="status-item">
                                <span>Mesh Network:</span>
                                <span style={{
                                    color: systemHealth.subsystems.mesh === 'healthy' ? '#00ff88' :
                                        systemHealth.subsystems.mesh === 'warning' ? '#ffaa00' : '#ff3333'
                                }}>
                                    {systemHealth.subsystems.mesh.toUpperCase()}
                                </span>
                            </div>

                            <div className="status-item">
                                <span>Security:</span>
                                <span style={{
                                    color: systemHealth.subsystems.security === 'healthy' ? '#00ff88' :
                                        systemHealth.subsystems.security === 'warning' ? '#ffaa00' : '#ff3333'
                                }}>
                                    {systemHealth.subsystems.security.toUpperCase()}
                                </span>
                            </div>

                            <div className="status-item">
                                <span>Uptime:</span>
                                <span style={{ color: '#00aaff' }}>
                                    {Math.floor(systemHealth.uptime / 3600)}h {Math.floor((systemHealth.uptime % 3600) / 60)}m
                                </span>
                            </div>
                        </div>
                    )}

                    {quantumMetrics && (
                        <div style={{ marginTop: '20px' }}>
                            <h4 style={{ color: '#ccc', marginBottom: '12px' }}>📊 Live Metrics</h4>
                            <div style={{ fontSize: '12px', color: '#999', lineHeight: '1.6' }}>
                                <div>🔗 Total Connections: {quantumMetrics.connections.total.toLocaleString()}</div>
                                <div>🛡️ Secure Connections: {quantumMetrics.connections.secure.toLocaleString()}</div>
                                <div>⚡ Throughput: {quantumMetrics.performance.throughput.toFixed(1)} ops/sec</div>
                                <div>⏱️ Latency: {quantumMetrics.performance.latency.toFixed(1)}ms</div>
                                <div>🔒 Threats Blocked: {quantumMetrics.security.threats_blocked.toLocaleString()}</div>
                                <div>📋 Compliance: {quantumMetrics.security.compliance_score.toFixed(1)}%</div>
                            </div>
                        </div>
                    )}
                </div>

                <QuantumVisualizer
                    quantumState={displayData.quantum_state}
                    nodes={quantumMetrics?.nodes.active ?? 0}
                    connections={quantumMetrics?.connections.total ?? 0}
                />
            </div>

            <div className="last-update">
                Last Update: {lastUpdate.toLocaleTimeString()} |
                Status: {isLive ? '🟢 Real-time' : '🔴 Offline'} |
                Version: 2.0.0-ultra-quantum
            </div>
        </div>
    )
}

export default UltraQuantumDashboard
