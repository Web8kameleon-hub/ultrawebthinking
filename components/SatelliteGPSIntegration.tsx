'use client'

import { motion } from 'framer-motion'
import {
    Activity,
    AlertTriangle,
    Antenna,
    BarChart3,
    CheckCircle,
    Database,
    DollarSign,
    Globe,
    MapPin,
    Radio,
    Satellite,
    Shield,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface IntegrationStatus {
    satelliteProvider: {
        status: 'connected' | 'connecting' | 'error'
        provider: string
        latency: number
        cost: number
        coverage: string
    }
    gpsEngine: {
        status: 'active' | 'standby' | 'error'
        trackedFlights: number
        geofences: number
        alerts: number
        accuracy: number
    }
    edgeGateways: {
        online: number
        total: number
        dataFlow: number
        networkHealth: number
    }
    dataSync: {
        status: 'synced' | 'syncing' | 'error'
        lastSync: string
        pendingUpdates: number
        bandwidth: number
    }
}

export default function SatelliteGPSIntegration() {
    const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({
        satelliteProvider: {
            status: 'connected',
            provider: 'Iridium NEXT',
            latency: 850,
            cost: 0.24,
            coverage: 'Global'
        },
        gpsEngine: {
            status: 'active',
            trackedFlights: 147,
            geofences: 12,
            alerts: 3,
            accuracy: 97.8
        },
        edgeGateways: {
            online: 8,
            total: 10,
            dataFlow: 2.4,
            networkHealth: 94
        },
        dataSync: {
            status: 'synced',
            lastSync: new Date().toISOString(),
            pendingUpdates: 0,
            bandwidth: 5.2
        }
    })

    const [premiumMode, setPremiumMode] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setIntegrationStatus(prev => ({
                ...prev,
                gpsEngine: {
                    ...prev.gpsEngine,
                    trackedFlights: prev.gpsEngine.trackedFlights + Math.floor(Math.random() * 5) - 2,
                    alerts: Math.max(0, prev.gpsEngine.alerts + Math.floor(Math.random() * 3) - 1)
                },
                satelliteProvider: {
                    ...prev.satelliteProvider,
                    latency: 800 + Math.random() * 200,
                    cost: 0.20 + Math.random() * 0.10
                },
                dataSync: {
                    ...prev.dataSync,
                    lastSync: new Date().toISOString(),
                    bandwidth: 4 + Math.random() * 4
                }
            }))
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const togglePremiumMode = async () => {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setPremiumMode(!premiumMode)
        setIsLoading(false)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected':
            case 'active':
            case 'synced':
                return 'text-emerald-400'
            case 'connecting':
            case 'syncing':
                return 'text-yellow-400'
            case 'error':
                return 'text-red-400'
            default:
                return 'text-slate-400'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected':
            case 'active':
            case 'synced':
                return <CheckCircle className="w-4 h-4 text-emerald-400" />
            case 'connecting':
            case 'syncing':
                return <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
            case 'error':
                return <AlertTriangle className="w-4 h-4 text-red-400" />
            default:
                return <Activity className="w-4 h-4 text-slate-400" />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <Satellite className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Satellite + GPS Integration</h1>
                                <p className="text-purple-200">EuroWeb Ultra Aviation Platform</p>
                            </div>
                        </div>

                        {/* Premium Mode Toggle */}
                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-2 rounded-lg border ${premiumMode
                                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                    : 'border-slate-600 bg-slate-800 text-slate-400'
                                }`}>
                                {premiumMode ? 'Premium Mode' : 'Standard Mode'}
                            </div>
                            <button
                                onClick={togglePremiumMode}
                                disabled={isLoading}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Switching...' : 'Toggle Mode'}
                            </button>
                        </div>
                    </div>

                    {/* Alert Banner for Non-Premium */}
                    {!premiumMode && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6"
                        >
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-yellow-400" />
                                <div>
                                    <h3 className="font-semibold text-yellow-300">Premium Feature Required</h3>
                                    <p className="text-yellow-200 text-sm">
                                        Satellite Mode and GPS Tracking are available for Premium and Enterprise customers.
                                        Current mode: Standard (terrestrial ADS-B only).
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Integration Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Satellite Provider Status */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`bg-slate-800/50 backdrop-blur-xl border rounded-xl p-6 ${premiumMode ? 'border-slate-700' : 'border-slate-600 opacity-60'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Satellite className={`w-6 h-6 ${premiumMode ? 'text-purple-400' : 'text-slate-500'}`} />
                                <h3 className="font-semibold text-white">Satellite Provider</h3>
                            </div>
                            {getStatusIcon(premiumMode ? integrationStatus.satelliteProvider.status : 'error')}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-300">Provider:</span>
                                <span className="text-white">
                                    {premiumMode ? integrationStatus.satelliteProvider.provider : 'Disabled'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Latency:</span>
                                <span className="text-white">
                                    {premiumMode ? `${integrationStatus.satelliteProvider.latency.toFixed(0)}ms` : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Cost/MB:</span>
                                <span className="text-white">
                                    {premiumMode ? `$${integrationStatus.satelliteProvider.cost.toFixed(2)}` : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Coverage:</span>
                                <span className="text-white">
                                    {premiumMode ? integrationStatus.satelliteProvider.coverage : 'Regional'}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* GPS Engine Status */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`bg-slate-800/50 backdrop-blur-xl border rounded-xl p-6 ${premiumMode ? 'border-slate-700' : 'border-slate-600 opacity-60'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <MapPin className={`w-6 h-6 ${premiumMode ? 'text-blue-400' : 'text-slate-500'}`} />
                                <h3 className="font-semibold text-white">GPS Engine</h3>
                            </div>
                            {getStatusIcon(premiumMode ? integrationStatus.gpsEngine.status : 'error')}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-300">Tracked Flights:</span>
                                <span className="text-blue-400">
                                    {premiumMode ? integrationStatus.gpsEngine.trackedFlights : 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Geofences:</span>
                                <span className="text-white">
                                    {premiumMode ? integrationStatus.gpsEngine.geofences : 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Active Alerts:</span>
                                <span className={`${integrationStatus.gpsEngine.alerts > 0 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                                    {premiumMode ? integrationStatus.gpsEngine.alerts : 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Accuracy:</span>
                                <span className="text-emerald-400">
                                    {premiumMode ? `${integrationStatus.gpsEngine.accuracy.toFixed(1)}%` : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Edge Gateway Status */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Antenna className="w-6 h-6 text-emerald-400" />
                                <h3 className="font-semibold text-white">Edge Gateways</h3>
                            </div>
                            {getStatusIcon('active')}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-300">Online:</span>
                                <span className="text-emerald-400">
                                    {integrationStatus.edgeGateways.online}/{integrationStatus.edgeGateways.total}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Data Flow:</span>
                                <span className="text-white">{integrationStatus.edgeGateways.dataFlow.toFixed(1)} MB/s</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Network Health:</span>
                                <span className="text-emerald-400">{integrationStatus.edgeGateways.networkHealth}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Mode:</span>
                                <span className="text-white">LoRa + Mesh</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Data Sync Status */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Database className="w-6 h-6 text-yellow-400" />
                                <h3 className="font-semibold text-white">Data Sync</h3>
                            </div>
                            {getStatusIcon(integrationStatus.dataSync.status)}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-300">Last Sync:</span>
                                <span className="text-white">
                                    {new Date(integrationStatus.dataSync.lastSync).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Pending:</span>
                                <span className="text-white">{integrationStatus.dataSync.pendingUpdates}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Bandwidth:</span>
                                <span className="text-yellow-400">{integrationStatus.dataSync.bandwidth.toFixed(1)} Mbps</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Protocol:</span>
                                <span className="text-white">WebRTC + UTT</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Architecture Diagram */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8 mb-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Globe className="w-6 h-6 text-purple-400" />
                        Integration Architecture
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Data Sources */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-purple-300">Data Sources</h3>
                            <div className="space-y-3">
                                <div className={`p-4 rounded-lg border ${premiumMode
                                        ? 'border-purple-500/30 bg-purple-500/10'
                                        : 'border-slate-600 bg-slate-700/30 opacity-50'
                                    }`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Satellite className="w-5 h-5 text-purple-400" />
                                        <span className="font-medium text-white">Satellite ADS-B</span>
                                        {!premiumMode && <Shield className="w-4 h-4 text-yellow-400" />}
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        Global coverage via Iridium NEXT constellation
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg border ${premiumMode
                                        ? 'border-blue-500/30 bg-blue-500/10'
                                        : 'border-slate-600 bg-slate-700/30 opacity-50'
                                    }`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <MapPin className="w-5 h-5 text-blue-400" />
                                        <span className="font-medium text-white">GPS Tracking</span>
                                        {!premiumMode && <Shield className="w-4 h-4 text-yellow-400" />}
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        Real-time aircraft positioning and geofencing
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Antenna className="w-5 h-5 text-emerald-400" />
                                        <span className="font-medium text-white">Edge Gateways</span>
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        LoRa mesh network for local data collection
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Processing Layer */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-blue-300">Processing Layer</h3>
                            <div className="space-y-3">
                                <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Zap className="w-5 h-5 text-blue-400" />
                                        <span className="font-medium text-white">Data Fusion Engine</span>
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        Combines satellite, GPS, and terrestrial data
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Activity className="w-5 h-5 text-yellow-400" />
                                        <span className="font-medium text-white">Real-time Analytics</span>
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        Live flight tracking and performance monitoring
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <AlertTriangle className="w-5 h-5 text-red-400" />
                                        <span className="font-medium text-white">Alert System</span>
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        Automated proximity and safety alerts
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Output Layer */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-emerald-300">Output & API</h3>
                            <div className="space-y-3">
                                <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                                        <span className="font-medium text-white">Dashboard APIs</span>
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        RESTful APIs for web and mobile apps
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-500/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Radio className="w-5 h-5 text-purple-400" />
                                        <span className="font-medium text-white">WebSocket Streams</span>
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        Real-time data streaming to clients
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <DollarSign className="w-5 h-5 text-blue-400" />
                                        <span className="font-medium text-white">UTT Billing</span>
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        Usage-based monetization and tracking
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Premium Feature Benefits */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        Premium Satellite + GPS Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="text-center p-6 rounded-lg bg-slate-800/30">
                            <Globe className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">Global Coverage</h3>
                            <p className="text-slate-300 text-sm">
                                Track flights anywhere in the world using satellite networks. No coverage gaps over oceans or remote areas.
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-lg bg-slate-800/30">
                            <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">GPS Precision</h3>
                            <p className="text-slate-300 text-sm">
                                Sub-meter accuracy for aircraft positioning with real-time geofencing and proximity alerts.
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-lg bg-slate-800/30">
                            <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">Redundant Systems</h3>
                            <p className="text-slate-300 text-sm">
                                Multiple satellite providers with automatic failover ensure 99.9% uptime for critical operations.
                            </p>
                        </div>
                    </div>

                    {!premiumMode && (
                        <div className="text-center mt-8">
                            <button
                                onClick={togglePremiumMode}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                            >
                                Upgrade to Premium
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
