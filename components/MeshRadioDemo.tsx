'use client'

import { motion } from 'framer-motion'
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Gauge,
    Pause,
    Play,
    Radio,
    RotateCcw,
    Send,
    Settings,
    Shield,
    Signal,
    Zap
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// Import the mesh radio
import {
    AlertPayload,
    createMeshRadio,
    MeshRadio,
    MetarPayload,
    SensorPayload
} from '@/lib/edge/mesh-radio'

interface RadioStats {
    nodeId: string
    dutyCycle: number
    sequenceCounter: number
    isTransmitting: boolean
    currentChannel: number
}

interface TransmissionLog {
    id: string
    timestamp: string
    type: string
    icao: string
    size: number
    priority: string
    success: boolean
    dutyCycle: number
}

export default function MeshRadioDemo() {
    const [radio, setRadio] = useState<MeshRadio | null>(null)
    const [radioStats, setRadioStats] = useState<RadioStats | null>(null)
    const [transmissionLog, setTransmissionLog] = useState<TransmissionLog[]>([])
    const [isInitialized, setIsInitialized] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [selectedMessageType, setSelectedMessageType] = useState<'metar' | 'alert' | 'sensor'>('metar')
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    // Initialize radio
    const initializeRadio = async () => {
        try {
            const newRadio = createMeshRadio(0x12345678) // Fixed node ID for demo
            await newRadio.initialize()
            setRadio(newRadio)
            setIsInitialized(true)
            updateStats(newRadio)
        } catch (error) {
            console.error('Failed to initialize radio:', error)
        }
    }

    // Update radio statistics
    const updateStats = (radioInstance: MeshRadio) => {
        const stats = radioInstance.getStats()
        setRadioStats(stats)
    }

    // Start automatic transmissions
    const startAutoTransmissions = () => {
        if (!radio || isActive) return

        setIsActive(true)
        intervalRef.current = setInterval(async () => {
            await sendRandomMessage()
        }, 3000) // Every 3 seconds
    }

    // Stop automatic transmissions
    const stopAutoTransmissions = () => {
        setIsActive(false)
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    // Send a random message
    const sendRandomMessage = async () => {
        if (!radio) return

        const messageTypes = ['metar', 'alert', 'sensor'] as const
        const type = messageTypes[Math.floor(Math.random() * messageTypes.length)]

        await sendMessage(type)
    }

    // Send specific message type
    const sendMessage = async (type: 'metar' | 'alert' | 'sensor') => {
        if (!radio) return

        const icaoCodes = ['EDDF', 'LOWW', 'LSZH', 'LFPG', 'EGLL']
        const icao = icaoCodes[Math.floor(Math.random() * icaoCodes.length)]

        let packet: Uint8Array
        let messageSize = 0
        let priority = 'NORMAL'

        try {
            switch (type) {
                case 'metar':
                    const metarData: MetarPayload = {
                        wind_speed: 10 + Math.random() * 20,
                        wind_gust: Math.random() > 0.7 ? 25 + Math.random() * 15 : undefined,
                        wind_dir: Math.floor(Math.random() * 360),
                        qnh: 1000 + Math.random() * 50,
                        visibility: 5000 + Math.random() * 5000,
                        temperature: -5 + Math.random() * 30,
                        dewpoint: -10 + Math.random() * 25,
                        raw_metar: `${icao} 261020Z 27015G23KT 9999 SCT030 15/09 Q1013`
                    }
                    packet = await radio.createMetarMessage(metarData, icao)
                    priority = 'NORMAL'
                    break

                case 'alert':
                    const alertData: AlertPayload = {
                        alert_type: 'WIND_SPEED',
                        severity: Math.random() > 0.8 ? 'CRITICAL' : 'HIGH',
                        value: 35 + Math.random() * 15,
                        threshold: 35,
                        description: 'Wind speed exceeds operational limits',
                        expires_at: Math.floor(Date.now() / 1000) + 3600
                    }
                    packet = await radio.createAlertMessage(alertData, icao)
                    priority = alertData.severity
                    break

                case 'sensor':
                    const sensorData: SensorPayload = {
                        sensor_id: `SENS_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                        readings: {
                            temperature: 15 + Math.random() * 10,
                            humidity: 40 + Math.random() * 40,
                            pressure: 1000 + Math.random() * 50,
                            wind_speed: Math.random() * 30
                        },
                        battery: 20 + Math.random() * 80,
                        signal_strength: -60 - Math.random() * 40,
                        location: {
                            lat: 45.0 + Math.random() * 10,
                            lon: 10.0 + Math.random() * 10,
                            alt: 100 + Math.random() * 500
                        }
                    }
                    packet = await radio.createSensorMessage(sensorData, icao)
                    priority = 'LOW'
                    break
            }

            messageSize = packet.length
            const success = await radio.transmit(packet)

            // Update stats
            updateStats(radio)

            // Log transmission
            const logEntry: TransmissionLog = {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toLocaleTimeString(),
                type: type.toUpperCase(),
                icao,
                size: messageSize,
                priority,
                success,
                dutyCycle: radio.getStats().dutyCycle * 100
            }

            setTransmissionLog(prev => [logEntry, ...prev].slice(0, 20)) // Keep last 20 entries

        } catch (error) {
            console.error('Transmission failed:', error)
        }
    }

    // Reset radio
    const resetRadio = async () => {
        stopAutoTransmissions()
        setTransmissionLog([])
        await initializeRadio()
    }

    useEffect(() => {
        initializeRadio()

        return () => {
            stopAutoTransmissions()
        }
    }, [])

    const getDutyCycleColor = (dutyCycle: number) => {
        if (dutyCycle < 0.5) return 'text-emerald-400'
        if (dutyCycle < 0.8) return 'text-yellow-400'
        return 'text-red-400'
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'text-red-400'
            case 'HIGH': return 'text-orange-400'
            case 'NORMAL': return 'text-blue-400'
            case 'LOW': return 'text-slate-400'
            default: return 'text-slate-400'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <Radio className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">LoRa Mesh Radio</h1>
                                <p className="text-blue-200">EU868 Industrial Demo</p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={resetRadio}
                                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </button>

                            {isActive ? (
                                <button
                                    onClick={stopAutoTransmissions}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <Pause className="w-4 h-4" />
                                    Stop Auto
                                </button>
                            ) : (
                                <button
                                    onClick={startAutoTransmissions}
                                    disabled={!isInitialized}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Play className="w-4 h-4" />
                                    Start Auto
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Status Banner */}
                    <div className={`p-4 rounded-lg border ${isInitialized
                            ? 'border-emerald-500/30 bg-emerald-500/10'
                            : 'border-yellow-500/30 bg-yellow-500/10'
                        }`}>
                        <div className="flex items-center gap-3">
                            {isInitialized ? (
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                            ) : (
                                <Activity className="w-5 h-5 text-yellow-400 animate-pulse" />
                            )}
                            <div>
                                <h3 className={`font-semibold ${isInitialized ? 'text-emerald-300' : 'text-yellow-300'}`}>
                                    {isInitialized ? 'LoRa Radio Initialized' : 'Initializing Radio...'}
                                </h3>
                                <p className={`text-sm ${isInitialized ? 'text-emerald-200' : 'text-yellow-200'}`}>
                                    {isInitialized
                                        ? `Node ID: ${radioStats?.nodeId}, EU868 Band, Ed25519 Signing Ready`
                                        : 'Setting up LoRa SX1302 driver and cryptographic keys...'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Dashboard */}
                {isInitialized && radioStats && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Radio Status */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <Gauge className="w-5 h-5 text-blue-400" />
                                Radio Status
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300">Node ID:</span>
                                    <span className="font-mono text-white">{radioStats.nodeId}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300">Duty Cycle:</span>
                                    <span className={`font-bold ${getDutyCycleColor(radioStats.dutyCycle)}`}>
                                        {(radioStats.dutyCycle * 100).toFixed(2)}%
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300">Sequence:</span>
                                    <span className="text-white">{radioStats.sequenceCounter}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300">Channel:</span>
                                    <span className="text-white">{radioStats.currentChannel + 1}/8</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300">Status:</span>
                                    <div className="flex items-center gap-2">
                                        {radioStats.isTransmitting ? (
                                            <>
                                                <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
                                                <span className="text-yellow-400">Transmitting</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                <span className="text-emerald-400">Ready</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300">Auto Mode:</span>
                                    <div className="flex items-center gap-2">
                                        {isActive ? (
                                            <>
                                                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                                                <span className="text-emerald-400">Active</span>
                                            </>
                                        ) : (
                                            <>
                                                <Pause className="w-4 h-4 text-slate-400" />
                                                <span className="text-slate-400">Stopped</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Manual Transmission */}
                            <div className="mt-6 pt-6 border-t border-slate-600">
                                <h3 className="text-lg font-semibold text-white mb-4">Manual Transmission</h3>

                                <div className="space-y-3">
                                    <select
                                        value={selectedMessageType}
                                        onChange={(e) => setSelectedMessageType(e.target.value as any)}
                                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    >
                                        <option value="metar">METAR (Weather)</option>
                                        <option value="alert">ALERT (Emergency)</option>
                                        <option value="sensor">SENSOR (Telemetry)</option>
                                    </select>

                                    <button
                                        onClick={() => sendMessage(selectedMessageType)}
                                        disabled={!isInitialized || radioStats.isTransmitting}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send {selectedMessageType.toUpperCase()}
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Transmission Log */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <Activity className="w-5 h-5 text-emerald-400" />
                                Transmission Log ({transmissionLog.length})
                            </h2>

                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {transmissionLog.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Radio className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                                        <p className="text-slate-400">No transmissions yet</p>
                                        <p className="text-slate-500 text-sm">Start auto mode or send manual messages</p>
                                    </div>
                                ) : (
                                    transmissionLog.map((log, index) => (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`p-3 rounded-lg border ${log.success
                                                    ? 'border-emerald-500/30 bg-emerald-500/5'
                                                    : 'border-red-500/30 bg-red-500/5'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    {log.success ? (
                                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                    ) : (
                                                        <AlertTriangle className="w-4 h-4 text-red-400" />
                                                    )}
                                                    <span className="font-medium text-white">{log.type}</span>
                                                    <span className="text-sm text-slate-400">{log.icao}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <span className={`${getPriorityColor(log.priority)}`}>{log.priority}</span>
                                                    <span className="text-slate-400">{log.timestamp}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="text-slate-400">Size:</span>
                                                    <span className="text-white ml-2">{log.size}B</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Duty Cycle:</span>
                                                    <span className={`ml-2 ${getDutyCycleColor(log.dutyCycle / 100)}`}>
                                                        {log.dutyCycle.toFixed(2)}%
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Status:</span>
                                                    <span className={`ml-2 ${log.success ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {log.success ? 'SUCCESS' : 'FAILED'}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Technical Specifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                >
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <Settings className="w-5 h-5 text-purple-400" />
                        LoRa Configuration (EU868)
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 rounded-lg bg-slate-700/30">
                            <Signal className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <h3 className="font-semibold text-white mb-1">Frequency</h3>
                            <p className="text-sm text-slate-300">868.1 MHz</p>
                            <p className="text-xs text-slate-400">EU ISM Band</p>
                        </div>

                        <div className="text-center p-4 rounded-lg bg-slate-700/30">
                            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                            <h3 className="font-semibold text-white mb-1">TX Power</h3>
                            <p className="text-sm text-slate-300">14 dBm</p>
                            <p className="text-xs text-slate-400">Max without license</p>
                        </div>

                        <div className="text-center p-4 rounded-lg bg-slate-700/30">
                            <Activity className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                            <h3 className="font-semibold text-white mb-1">Data Rate</h3>
                            <p className="text-sm text-slate-300">SF7, 125kHz</p>
                            <p className="text-xs text-slate-400">Fast mode</p>
                        </div>

                        <div className="text-center p-4 rounded-lg bg-slate-700/30">
                            <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <h3 className="font-semibold text-white mb-1">Security</h3>
                            <p className="text-sm text-slate-300">Ed25519</p>
                            <p className="text-xs text-slate-400">Digital signatures</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
