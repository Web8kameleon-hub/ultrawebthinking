// app/mirror-demo/page.tsx
// Mirror Defense Industrial - Live Demo
// Advanced Protection System for EuroWeb Ultra

'use client'

import { motion } from 'framer-motion'
import { Activity, AlertTriangle, CheckCircle, Eye, Shield, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DefenseLog {
    id: string
    timestamp: string
    type: 'INIT' | 'SCAN' | 'BLOCK' | 'ALERT' | 'SUCCESS'
    message: string
    details?: string
}

interface SecurityStats {
    threatsBlocked: number
    attacksDetected: number
    uptime: string
    protectionLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMUM'
}

export default function MirrorDefenseDemo() {
    const [logs, setLogs] = useState<DefenseLog[]>([])
    const [stats, setStats] = useState<SecurityStats>({
        threatsBlocked: 247,
        attacksDetected: 12,
        uptime: '99.97%',
        protectionLevel: 'MAXIMUM'
    })
    const [isProtectionActive, setIsProtectionActive] = useState(false)
    const [scanningProgress, setScanningProgress] = useState(0)

    const addLog = (type: DefenseLog['type'], message: string, details?: string) => {
        const newLog: DefenseLog = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toLocaleTimeString(),
            type,
            message,
            details
        }
        setLogs(prev => [newLog, ...prev.slice(0, 9)])
    }

    const runProtection = async () => {
        if (isProtectionActive) return

        setIsProtectionActive(true)
        setScanningProgress(0)

        addLog('INIT', 'Starting Mirror Defense protection sequence...')

        const steps = [
            { progress: 15, msg: 'Initializing security modules...' },
            { progress: 30, msg: 'Scanning for vulnerabilities...' },
            { progress: 45, msg: 'Deploying decoy assets...' },
            { progress: 60, msg: 'Activating CSP headers...' },
            { progress: 75, msg: 'Generating SRI hashes...' },
            { progress: 90, msg: 'Obfuscating critical code...' },
            { progress: 100, msg: 'Protection sequence complete!' }
        ]

        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 800))
            setScanningProgress(step.progress)
            addLog('SCAN', step.msg)
        }

        await new Promise(resolve => setTimeout(resolve, 500))
        addLog('SUCCESS', 'Mirror Defense monitoring system online')
        addLog('ALERT', 'All security layers activated - System protected')

        setStats(prev => ({
            ...prev,
            threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 5) + 1,
            attacksDetected: prev.attacksDetected + Math.floor(Math.random() * 3)
        }))
    }

    const simulateAttack = () => {
        const attacks = [
            'SQL injection attempt blocked',
            'XSS payload detected and neutralized',
            'Directory traversal attempt denied',
            'Malicious bot activity detected',
            'Suspicious API calls blocked'
        ]

        const attack = attacks[Math.floor(Math.random() * attacks.length)]
        addLog('BLOCK', attack, 'Mirror Defense countermeasures activated')

        setStats(prev => ({
            ...prev,
            threatsBlocked: prev.threatsBlocked + 1
        }))
    }

    useEffect(() => {
        addLog('INIT', 'Mirror Defense Demo initialized', 'Ready for protection sequence')

        // Simulate occasional activity
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                simulateAttack()
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const getLogIcon = (type: DefenseLog['type']) => {
        switch (type) {
            case 'INIT': return <Zap className="w-4 h-4 text-blue-400" />
            case 'SCAN': return <Eye className="w-4 h-4 text-yellow-400" />
            case 'BLOCK': return <Shield className="w-4 h-4 text-red-400" />
            case 'ALERT': return <AlertTriangle className="w-4 h-4 text-orange-400" />
            case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-emerald-400" />
            default: return <Activity className="w-4 h-4 text-gray-400" />
        }
    }

    const getProtectionColor = () => {
        switch (stats.protectionLevel) {
            case 'MAXIMUM': return 'text-emerald-400'
            case 'HIGH': return 'text-blue-400'
            case 'MEDIUM': return 'text-yellow-400'
            case 'LOW': return 'text-red-400'
            default: return 'text-gray-400'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Shield className="w-12 h-12 text-blue-400" />
                        <div>
                            <h1 className="text-4xl font-bold">Mirror Defense Industrial</h1>
                            <p className="text-blue-200">Advanced Protection System - Live Demo</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
                >
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                        <div className="text-2xl font-bold text-red-400 mb-2">{stats.threatsBlocked}</div>
                        <div className="text-sm text-slate-400">Threats Blocked</div>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                        <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.attacksDetected}</div>
                        <div className="text-sm text-slate-400">Attacks Detected</div>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                        <div className="text-2xl font-bold text-emerald-400 mb-2">{stats.uptime}</div>
                        <div className="text-sm text-slate-400">System Uptime</div>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                        <div className={`text-2xl font-bold mb-2 ${getProtectionColor()}`}>{stats.protectionLevel}</div>
                        <div className="text-sm text-slate-400">Protection Level</div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Control Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                    >
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-400" />
                            Defense Control Panel
                        </h2>

                        {/* Progress Bar */}
                        {isProtectionActive && (
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Protection Sequence</span>
                                    <span>{scanningProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${scanningProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={runProtection}
                                disabled={isProtectionActive}
                                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                            >
                                <Shield className="w-5 h-5" />
                                {isProtectionActive ? 'Protection Running...' : 'Run Full Mirror Defense'}
                            </button>

                            <button
                                onClick={simulateAttack}
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                            >
                                <AlertTriangle className="w-5 h-5" />
                                Simulate Attack
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                            <div className="text-sm text-slate-400 mb-2">Security Features Active:</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    <span>Content Security Policy (CSP)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    <span>Subresource Integrity (SRI)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    <span>Decoy Assets Deployed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    <span>Code Obfuscation Active</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Activity Logs */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                    >
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-400" />
                            Defense Activity Log
                        </h2>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {logs.length === 0 ? (
                                <div className="text-center text-slate-400 py-8">
                                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No activity yet. Run protection to see logs.</p>
                                </div>
                            ) : (
                                logs.map((log) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg"
                                    >
                                        {getLogIcon(log.type)}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium">{log.message}</span>
                                                <span className="text-xs text-slate-500">{log.timestamp}</span>
                                            </div>
                                            {log.details && (
                                                <div className="text-xs text-slate-400">{log.details}</div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-8 text-slate-400"
                >
                    <p className="text-sm">
                        🛡️ Mirror Defense Industrial - Built for EuroWeb Ultra Aviation Platform
                    </p>
                    <p className="text-xs mt-1">
                        Advanced multi-layer security system with real-time threat detection
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
