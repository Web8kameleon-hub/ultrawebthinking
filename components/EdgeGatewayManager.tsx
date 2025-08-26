'use client'

import { motion } from 'framer-motion'
import {
    Activity,
    AlertTriangle,
    Antenna,
    Battery,
    CheckCircle,
    Clock,
    MapPin,
    Radio,
    RefreshCw,
    Settings,
    Shield,
    Signal,
    Wifi,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface Gateway {
    id: string
    name: string
    status: 'online' | 'offline' | 'warning'
    location: { lat: number; lon: number; address: string }
    firmware: string
    lastSeen: string
    battery: number
    rssi: number
    snr: number
    packetLoss: number
    dataRate: number
    geofence: { radius: number; active: boolean }
}

interface EdgeMetrics {
    totalGateways: number
    onlineGateways: number
    dataIngested: string
    coverage: string
    uptime: string
}

export default function EdgeGatewayManager() {
    const [gateways, setGateways] = useState<Gateway[]>([])
    const [metrics, setMetrics] = useState<EdgeMetrics>({
        totalGateways: 0,
        onlineGateways: 0,
        dataIngested: '0',
        coverage: '0',
        uptime: '99.9%'
    })
    const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null)

    // Simulate real-time data
    useEffect(() => {
        const mockGateways: Gateway[] = [
            {
                id: 'GW001',
                name: 'Frankfurt Airport Edge',
                status: 'online',
                location: { lat: 50.0379, lon: 8.5622, address: 'Frankfurt am Main, Germany' },
                firmware: 'v2.1.3',
                lastSeen: '2 seconds ago',
                battery: 87,
                rssi: -72,
                snr: 8.5,
                packetLoss: 0.2,
                dataRate: 125.4,
                geofence: { radius: 5000, active: true }
            },
            {
                id: 'GW002',
                name: 'Munich Airport Edge',
                status: 'online',
                location: { lat: 48.3537, lon: 11.7751, address: 'München, Germany' },
                firmware: 'v2.1.3',
                lastSeen: '1 minute ago',
                battery: 92,
                rssi: -68,
                snr: 9.2,
                packetLoss: 0.1,
                dataRate: 98.7,
                geofence: { radius: 3000, active: true }
            },
            {
                id: 'GW003',
                name: 'Berlin Airport Edge',
                status: 'warning',
                location: { lat: 52.3667, lon: 13.5033, address: 'Berlin Brandenburg, Germany' },
                firmware: 'v2.1.1',
                lastSeen: '15 minutes ago',
                battery: 23,
                rssi: -85,
                snr: 3.1,
                packetLoss: 2.8,
                dataRate: 45.2,
                geofence: { radius: 4000, active: false }
            },
            {
                id: 'GW004',
                name: 'Vienna Airport Edge',
                status: 'offline',
                location: { lat: 48.1103, lon: 16.5697, address: 'Schwechat, Austria' },
                firmware: 'v2.0.8',
                lastSeen: '2 hours ago',
                battery: 0,
                rssi: 0,
                snr: 0,
                packetLoss: 100,
                dataRate: 0,
                geofence: { radius: 2500, active: false }
            }
        ]

        setGateways(mockGateways)
        setMetrics({
            totalGateways: mockGateways.length,
            onlineGateways: mockGateways.filter(g => g.status === 'online').length,
            dataIngested: '2.4 TB',
            coverage: '850 km²',
            uptime: '99.2%'
        })
        setSelectedGateway(mockGateways[0])

        // Simulate real-time updates
        const interval = setInterval(() => {
            setGateways(prev => prev.map(gateway => ({
                ...gateway,
                dataRate: gateway.status === 'online' ?
                    gateway.dataRate + (Math.random() - 0.5) * 10 : 0,
                rssi: gateway.status === 'online' ?
                    gateway.rssi + (Math.random() - 0.5) * 5 : 0
            })))
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'online': return <CheckCircle className="w-4 h-4 text-emerald-500" />
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
            case 'offline': return <AlertTriangle className="w-4 h-4 text-red-500" />
            default: return <Clock className="w-4 h-4 text-slate-400" />
        }
    }

    const getSignalStrength = (rssi: number) => {
        if (rssi > -60) return { strength: 'Excellent', color: 'text-emerald-500', bars: 4 }
        if (rssi > -70) return { strength: 'Good', color: 'text-blue-500', bars: 3 }
        if (rssi > -80) return { strength: 'Fair', color: 'text-yellow-500', bars: 2 }
        return { strength: 'Poor', color: 'text-red-500', bars: 1 }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <Antenna className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Edge Gateway Fleet</h1>
                            <p className="text-indigo-200">LoRa + Mesh Network Management</p>
                        </div>
                    </div>

                    {/* Metrics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Radio className="w-5 h-5 text-indigo-400" />
                                <span className="text-sm font-medium text-slate-300">Total Gateways</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{metrics.totalGateways}</div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm font-medium text-slate-300">Online</span>
                            </div>
                            <div className="text-2xl font-bold text-emerald-400">{metrics.onlineGateways}</div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Activity className="w-5 h-5 text-blue-400" />
                                <span className="text-sm font-medium text-slate-300">Data Ingested</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-400">{metrics.dataIngested}</div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <MapPin className="w-5 h-5 text-purple-400" />
                                <span className="text-sm font-medium text-slate-300">Coverage</span>
                            </div>
                            <div className="text-2xl font-bold text-purple-400">{metrics.coverage}</div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm font-medium text-slate-300">Uptime</span>
                            </div>
                            <div className="text-2xl font-bold text-emerald-400">{metrics.uptime}</div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Gateway List and Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Gateway List */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <Radio className="w-5 h-5 text-indigo-400" />
                            Gateway Fleet Status
                        </h2>

                        <div className="space-y-4">
                            {gateways.map((gateway) => (
                                <motion.div
                                    key={gateway.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setSelectedGateway(gateway)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedGateway?.id === gateway.id
                                            ? 'border-indigo-500 bg-indigo-500/10'
                                            : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(gateway.status)}
                                            <div>
                                                <h3 className="font-medium text-white">{gateway.name}</h3>
                                                <p className="text-sm text-slate-400">{gateway.id}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-white">
                                                {gateway.dataRate.toFixed(1)} KB/s
                                            </div>
                                            <div className="text-xs text-slate-400">{gateway.lastSeen}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-400">Battery:</span>
                                            <div className={`font-medium ${gateway.battery > 50 ? 'text-emerald-400' :
                                                    gateway.battery > 20 ? 'text-yellow-400' : 'text-red-400'
                                                }`}>
                                                {gateway.battery}%
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">RSSI:</span>
                                            <div className={`font-medium ${getSignalStrength(gateway.rssi).color}`}>
                                                {gateway.rssi} dBm
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">SNR:</span>
                                            <div className="font-medium text-blue-400">{gateway.snr} dB</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Gateway Details */}
                    {selectedGateway && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <Settings className="w-5 h-5 text-indigo-400" />
                                    Gateway Details
                                </h2>
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                    Configure
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">{selectedGateway.name}</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-400">Gateway ID:</span>
                                            <div className="font-medium text-white">{selectedGateway.id}</div>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Firmware:</span>
                                            <div className="font-medium text-white">{selectedGateway.firmware}</div>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Status:</span>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(selectedGateway.status)}
                                                <span className="font-medium text-white capitalize">
                                                    {selectedGateway.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Last Seen:</span>
                                            <div className="font-medium text-white">{selectedGateway.lastSeen}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-purple-400" />
                                        Location & Geofence
                                    </h4>
                                    <div className="bg-slate-700/30 rounded-lg p-4">
                                        <div className="text-sm text-slate-300 mb-2">
                                            {selectedGateway.location.address}
                                        </div>
                                        <div className="text-xs text-slate-400 mb-3">
                                            {selectedGateway.location.lat.toFixed(4)}°N, {selectedGateway.location.lon.toFixed(4)}°E
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-300">
                                                Geofence: {selectedGateway.geofence.radius}m radius
                                            </span>
                                            <span className={`text-sm font-medium ${selectedGateway.geofence.active ? 'text-emerald-400' : 'text-red-400'
                                                }`}>
                                                {selectedGateway.geofence.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Metrics */}
                                <div>
                                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-blue-400" />
                                        Performance Metrics
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-700/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Battery className="w-4 h-4 text-emerald-400" />
                                                <span className="text-sm text-slate-300">Battery Level</span>
                                            </div>
                                            <div className="text-2xl font-bold text-emerald-400">
                                                {selectedGateway.battery}%
                                            </div>
                                            <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-emerald-400 h-2 rounded-full transition-all"
                                                    style={{ width: `${selectedGateway.battery}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-slate-700/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Signal className="w-4 h-4 text-blue-400" />
                                                <span className="text-sm text-slate-300">Signal Quality</span>
                                            </div>
                                            <div className="text-lg font-bold text-blue-400">
                                                {getSignalStrength(selectedGateway.rssi).strength}
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                RSSI: {selectedGateway.rssi} dBm | SNR: {selectedGateway.snr} dB
                                            </div>
                                        </div>

                                        <div className="bg-slate-700/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap className="w-4 h-4 text-yellow-400" />
                                                <span className="text-sm text-slate-300">Data Rate</span>
                                            </div>
                                            <div className="text-lg font-bold text-yellow-400">
                                                {selectedGateway.dataRate.toFixed(1)} KB/s
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                Real-time throughput
                                            </div>
                                        </div>

                                        <div className="bg-slate-700/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Wifi className="w-4 h-4 text-red-400" />
                                                <span className="text-sm text-slate-300">Packet Loss</span>
                                            </div>
                                            <div className="text-lg font-bold text-red-400">
                                                {selectedGateway.packetLoss}%
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                Last 24 hours
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div>
                                    <h4 className="font-semibold text-white mb-3">Quick Actions</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                            <RefreshCw className="w-4 h-4 inline mr-2" />
                                            Restart Gateway
                                        </button>
                                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                                            <Settings className="w-4 h-4 inline mr-2" />
                                            Update Config
                                        </button>
                                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                                            <Zap className="w-4 h-4 inline mr-2" />
                                            OTA Update
                                        </button>
                                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                                            <AlertTriangle className="w-4 h-4 inline mr-2" />
                                            Force Reboot
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
