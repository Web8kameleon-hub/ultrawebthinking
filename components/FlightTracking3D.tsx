'use client'

import { motion } from 'framer-motion'
import {
    Activity,
    Clock,
    Database,
    Eye,
    Globe,
    MapPin,
    Navigation,
    Plane,
    Radio,
    Satellite,
    Signal,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface FlightTrackingData {
    callsign: string
    icao24: string
    latitude: number
    longitude: number
    altitude: number
    heading: number
    speed: number
    verticalRate: number
    timestamp: string
    source: 'satellite' | 'terrestrial' | 'hybrid'
    confidence: number
    nearestAirport?: string
    distance?: number
}

interface SatelliteStatus {
    enabled: boolean
    mode: 'standard' | 'satellite' | 'hybrid'
    activeProviders: number
    averageLatency: number
    totalCost: number
    flightsTracked: number
    coverageArea: string
}

export default function FlightTracking3D() {
    const [satelliteStatus, setSatelliteStatus] = useState<SatelliteStatus>({
        enabled: false,
        mode: 'standard',
        activeProviders: 0,
        averageLatency: 0,
        totalCost: 0,
        flightsTracked: 0,
        coverageArea: '0 km²'
    })

    const [flights, setFlights] = useState<FlightTrackingData[]>([])
    const [selectedFlight, setSelectedFlight] = useState<FlightTrackingData | null>(null)
    const [trackingMode, setTrackingMode] = useState<'standard' | 'satellite' | 'hybrid'>('standard')
    const [isLoading, setIsLoading] = useState(false)

    // Simulate satellite mode toggle
    const toggleSatelliteMode = async (mode: 'standard' | 'satellite' | 'hybrid') => {
        setIsLoading(true)

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        setTrackingMode(mode)

        // Update satellite status based on mode
        const newStatus: SatelliteStatus = {
            enabled: mode !== 'standard',
            mode,
            activeProviders: mode === 'satellite' ? 4 : mode === 'hybrid' ? 6 : 2,
            averageLatency: mode === 'satellite' ? 800 : mode === 'hybrid' ? 400 : 150,
            totalCost: mode === 'satellite' ? 0.25 : mode === 'hybrid' ? 0.15 : 0.05,
            flightsTracked: mode === 'satellite' ? 150 : mode === 'hybrid' ? 89 : 35,
            coverageArea: mode === 'satellite' ? 'Global' : mode === 'hybrid' ? '2.5M km²' : '500k km²'
        }

        setSatelliteStatus(newStatus)
        generateFlightData(mode)
        setIsLoading(false)
    }

    // Generate mock flight data based on tracking mode
    const generateFlightData = (mode: 'standard' | 'satellite' | 'hybrid') => {
        const flightCount = mode === 'satellite' ? 150 : mode === 'hybrid' ? 89 : 35
        const newFlights: FlightTrackingData[] = []

        for (let i = 0; i < flightCount; i++) {
            const lat = 45 + Math.random() * 15  // Europe area
            const lon = -5 + Math.random() * 25  // Europe area

            newFlights.push({
                callsign: mode === 'satellite' ? `SAT${(1000 + i).toString()}` : `TER${(500 + i).toString()}`,
                icao24: Math.random().toString(16).substr(2, 6).toUpperCase(),
                latitude: lat,
                longitude: lon,
                altitude: 25000 + Math.random() * 15000,
                heading: Math.random() * 360,
                speed: 400 + Math.random() * 200,
                verticalRate: -500 + Math.random() * 1000,
                timestamp: new Date().toISOString(),
                source: mode === 'satellite' ? 'satellite' : mode === 'hybrid' ? 'hybrid' : 'terrestrial',
                confidence: mode === 'satellite' ? 0.95 : mode === 'hybrid' ? 0.90 : 0.85,
                nearestAirport: ['EDDF', 'EDDM', 'LOWW', 'LSZH', 'LFPG'][Math.floor(Math.random() * 5)],
                distance: Math.random() * 200
            })
        }

        setFlights(newFlights)
        if (newFlights.length > 0) {
            setSelectedFlight(newFlights[0])
        }
    }

    useEffect(() => {
        generateFlightData('standard')

        // Auto-refresh flights every 10 seconds
        const interval = setInterval(() => {
            generateFlightData(trackingMode)
        }, 10000)

        return () => clearInterval(interval)
    }, [trackingMode])

    const getModeColor = (mode: string) => {
        switch (mode) {
            case 'satellite': return 'from-purple-500 to-pink-500'
            case 'hybrid': return 'from-blue-500 to-purple-500'
            default: return 'from-green-500 to-blue-500'
        }
    }

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'satellite': return <Satellite className="w-4 h-4 text-purple-400" />
            case 'hybrid': return <Radio className="w-4 h-4 text-blue-400" />
            default: return <Globe className="w-4 h-4 text-green-400" />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${getModeColor(trackingMode)} rounded-xl flex items-center justify-center`}>
                                <Satellite className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Flight Tracking 3D</h1>
                                <p className="text-purple-200">Satellite + GPS Global Coverage</p>
                            </div>
                        </div>

                        {/* Mode Toggle */}
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-800/50 rounded-lg p-1 flex">
                                {['standard', 'hybrid', 'satellite'].map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => toggleSatelliteMode(mode as any)}
                                        disabled={isLoading}
                                        className={`px-4 py-2 rounded-md transition-all capitalize ${trackingMode === mode
                                                ? 'bg-purple-600 text-white'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                            }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-slate-300">Mode</span>
                            </div>
                            <div className="text-lg font-bold text-white capitalize">{trackingMode}</div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Plane className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-slate-300">Flights</span>
                            </div>
                            <div className="text-lg font-bold text-blue-400">{satelliteStatus.flightsTracked}</div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Signal className="w-4 h-4 text-purple-400" />
                                <span className="text-xs text-slate-300">Providers</span>
                            </div>
                            <div className="text-lg font-bold text-purple-400">{satelliteStatus.activeProviders}</div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-yellow-400" />
                                <span className="text-xs text-slate-300">Latency</span>
                            </div>
                            <div className="text-lg font-bold text-yellow-400">{satelliteStatus.averageLatency}ms</div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-slate-300">Coverage</span>
                            </div>
                            <div className="text-lg font-bold text-emerald-400">{satelliteStatus.coverageArea}</div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Database className="w-4 h-4 text-red-400" />
                                <span className="text-xs text-slate-300">Cost/MB</span>
                            </div>
                            <div className="text-lg font-bold text-red-400">${satelliteStatus.totalCost.toFixed(2)}</div>
                        </div>
                    </div>
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center py-12"
                    >
                        <div className="text-center">
                            <Satellite className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                            <p className="text-xl text-white">Switching to {trackingMode} mode...</p>
                            <p className="text-purple-200">Connecting to satellite network</p>
                        </div>
                    </motion.div>
                )}

                {/* Main Content */}
                {!isLoading && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Flight List */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <Eye className="w-5 h-5 text-purple-400" />
                                Real-time Flight Tracking ({flights.length})
                            </h2>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {flights.slice(0, 20).map((flight, index) => (
                                    <motion.div
                                        key={flight.icao24}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => setSelectedFlight(flight)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedFlight?.icao24 === flight.icao24
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                {getSourceIcon(flight.source)}
                                                <div>
                                                    <h3 className="font-medium text-white">{flight.callsign}</h3>
                                                    <p className="text-sm text-slate-400">{flight.icao24}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-white">
                                                    {flight.altitude.toFixed(0)} ft
                                                </div>
                                                <div className="text-xs text-slate-400">{flight.speed.toFixed(0)} kts</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-slate-400">Position:</span>
                                                <div className="font-medium text-white">
                                                    {flight.latitude.toFixed(3)}, {flight.longitude.toFixed(3)}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">Nearest:</span>
                                                <div className="font-medium text-blue-400">{flight.nearestAirport}</div>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">Confidence:</span>
                                                <div className={`font-medium ${flight.confidence > 0.9 ? 'text-emerald-400' : 'text-yellow-400'
                                                    }`}>
                                                    {(flight.confidence * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Flight Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <Navigation className="w-5 h-5 text-blue-400" />
                                Flight Details
                            </h2>

                            {selectedFlight ? (
                                <div className="space-y-6">
                                    {/* Flight Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-3">{selectedFlight.callsign}</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Aircraft ID:</span>
                                                <span className="font-medium text-white">{selectedFlight.icao24}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Data Source:</span>
                                                <div className="flex items-center gap-2">
                                                    {getSourceIcon(selectedFlight.source)}
                                                    <span className="font-medium text-white capitalize">{selectedFlight.source}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Last Update:</span>
                                                <span className="font-medium text-white">
                                                    {new Date(selectedFlight.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Position Data */}
                                    <div>
                                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-purple-400" />
                                            Position & Navigation
                                        </h4>
                                        <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-slate-300">Latitude:</span>
                                                <span className="text-white">{selectedFlight.latitude.toFixed(6)}°</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-300">Longitude:</span>
                                                <span className="text-white">{selectedFlight.longitude.toFixed(6)}°</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-300">Altitude:</span>
                                                <span className="text-white">{selectedFlight.altitude.toFixed(0)} ft</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-300">Heading:</span>
                                                <span className="text-white">{selectedFlight.heading.toFixed(1)}°</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Performance Data */}
                                    <div>
                                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-yellow-400" />
                                            Performance
                                        </h4>
                                        <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-slate-300">Ground Speed:</span>
                                                <span className="text-white">{selectedFlight.speed.toFixed(0)} kts</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-300">Vertical Rate:</span>
                                                <span className={`${selectedFlight.verticalRate > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {selectedFlight.verticalRate > 0 ? '+' : ''}{selectedFlight.verticalRate.toFixed(0)} ft/min
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-300">Data Confidence:</span>
                                                <span className={`${selectedFlight.confidence > 0.9 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                                    {(selectedFlight.confidence * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Proximity Info */}
                                    <div>
                                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-emerald-400" />
                                            Proximity
                                        </h4>
                                        <div className="bg-slate-700/30 rounded-lg p-4">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-slate-300">Nearest Airport:</span>
                                                <span className="text-blue-400 font-medium">{selectedFlight.nearestAirport}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-300">Distance:</span>
                                                <span className="text-white">{selectedFlight.distance?.toFixed(1)} km</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-4 border-t border-slate-600">
                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                            Track Flight
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Plane className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                                    <p className="text-slate-400">Select a flight to view details</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* Mode Benefits */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Tracking Mode Comparison</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                            <Globe className="w-8 h-8 text-green-400 mx-auto mb-3" />
                            <h3 className="font-bold text-green-400 mb-2">Standard Mode</h3>
                            <ul className="text-sm text-slate-300 space-y-1">
                                <li>• ADS-B terrestrial coverage</li>
                                <li>• ~35 flights tracked</li>
                                <li>• Regional coverage only</li>
                                <li>• $0.05/MB cost</li>
                                <li>• 150ms latency</li>
                            </ul>
                        </div>

                        <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <Radio className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                            <h3 className="font-bold text-blue-400 mb-2">Hybrid Mode</h3>
                            <ul className="text-sm text-slate-300 space-y-1">
                                <li>• Terrestrial + Satellite</li>
                                <li>• ~89 flights tracked</li>
                                <li>• Extended coverage</li>
                                <li>• $0.15/MB cost</li>
                                <li>• 400ms latency</li>
                            </ul>
                        </div>

                        <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <Satellite className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                            <h3 className="font-bold text-purple-400 mb-2">Satellite Mode</h3>
                            <ul className="text-sm text-slate-300 space-y-1">
                                <li>• Global satellite coverage</li>
                                <li>• ~150 flights tracked</li>
                                <li>• Worldwide coverage</li>
                                <li>• $0.25/MB cost</li>
                                <li>• 800ms latency</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
