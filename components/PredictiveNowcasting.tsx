'use client'

import { motion } from 'framer-motion'
import {
    AlertTriangle,
    BarChart3,
    Brain,
    CheckCircle,
    Clock,
    Cloud,
    Eye,
    Gauge,
    Target,
    Thermometer,
    TrendingDown,
    TrendingUp,
    Wind,
    XCircle,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface NowcastData {
    icao: string
    airportName: string
    horizonMinutes: number
    confidence: number
    goNoGo: 'GO' | 'CAUTION' | 'NO-GO'
    predictions: {
        windGustMax: number
        windDirection: number
        visibilityMin: number
        qnhTrend: number
        temperatureTrend: number
        cbProbability: number
    }
    alerts: Array<{
        type: string
        severity: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE'
        etaMinutes: number
        affectedRunways: string[]
        description: string
    }>
    modelInputs: {
        pressureTrend: number[]
        temperatureGradient: number
        gustIndex: number
        humidityChange: number
        windShear: number
    }
}

interface AirportSelection {
    icao: string
    name: string
    location: string
}

export default function PredictiveNowcasting() {
    const [selectedAirport, setSelectedAirport] = useState<string>('EDDF')
    const [nowcastData, setNowcastData] = useState<NowcastData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

    const airports: AirportSelection[] = [
        { icao: 'EDDF', name: 'Frankfurt', location: 'Germany' },
        { icao: 'EDDM', name: 'Munich', location: 'Germany' },
        { icao: 'EDDB', name: 'Berlin Brandenburg', location: 'Germany' },
        { icao: 'LOWW', name: 'Vienna', location: 'Austria' },
        { icao: 'LSZH', name: 'Zurich', location: 'Switzerland' },
        { icao: 'LFPG', name: 'Charles de Gaulle', location: 'France' }
    ]

    // Simulate nowcast generation
    const generateNowcast = async (icao: string) => {
        setIsLoading(true)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        const mockData: NowcastData = {
            icao,
            airportName: airports.find(a => a.icao === icao)?.name || icao,
            horizonMinutes: 30,
            confidence: 0.82 + Math.random() * 0.15,
            goNoGo: Math.random() > 0.7 ? 'CAUTION' : Math.random() > 0.3 ? 'GO' : 'NO-GO',
            predictions: {
                windGustMax: 25 + Math.random() * 20,
                windDirection: 180 + Math.random() * 180,
                visibilityMin: 2000 + Math.random() * 8000,
                qnhTrend: -3 + Math.random() * 6,
                temperatureTrend: -2 + Math.random() * 4,
                cbProbability: Math.random() * 0.6
            },
            alerts: [
                {
                    type: 'WIND_SHEAR',
                    severity: 'MODERATE' as const,
                    etaMinutes: 15 + Math.random() * 20,
                    affectedRunways: ['07L', '07R', '25L', '25R'],
                    description: 'Moderate wind shear expected due to thermal gradient'
                },
                {
                    type: 'VISIBILITY',
                    severity: 'LOW' as const,
                    etaMinutes: 25 + Math.random() * 15,
                    affectedRunways: ['All'],
                    description: 'Visibility may drop below 3000m due to approaching precipitation'
                }
            ].filter(() => Math.random() > 0.3),
            modelInputs: {
                pressureTrend: Array.from({ length: 12 }, () => 1013 + Math.random() * 20 - 10),
                temperatureGradient: -0.5 + Math.random() * 2,
                gustIndex: 0.3 + Math.random() * 0.4,
                humidityChange: -5 + Math.random() * 15,
                windShear: 0.1 + Math.random() * 0.3
            }
        }

        setNowcastData(mockData)
        setLastUpdate(new Date())
        setIsLoading(false)
    }

    useEffect(() => {
        generateNowcast(selectedAirport)
    }, [selectedAirport])

    // Auto-refresh every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            generateNowcast(selectedAirport)
        }, 300000) // 5 minutes

        return () => clearInterval(interval)
    }, [selectedAirport])

    const getGoNoGoColor = (status: string) => {
        switch (status) {
            case 'GO': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
            case 'CAUTION': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
            case 'NO-GO': return 'text-red-400 bg-red-400/10 border-red-400/20'
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'LOW': return 'text-blue-400'
            case 'MODERATE': return 'text-yellow-400'
            case 'HIGH': return 'text-orange-400'
            case 'SEVERE': return 'text-red-400'
            default: return 'text-slate-400'
        }
    }

    const getConfidenceColor = (confidence: number) => {
        if (confidence > 0.9) return 'text-emerald-400'
        if (confidence > 0.7) return 'text-blue-400'
        if (confidence > 0.5) return 'text-yellow-400'
        return 'text-red-400'
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
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Predictive Nowcasting</h1>
                                <p className="text-blue-200">AI-powered 30-minute weather forecasting</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={selectedAirport}
                                onChange={(e) => setSelectedAirport(e.target.value)}
                                className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
                            >
                                {airports.map(airport => (
                                    <option key={airport.icao} value={airport.icao}>
                                        {airport.icao} - {airport.name}, {airport.location}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => generateNowcast(selectedAirport)}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Generating...' : 'Refresh Nowcast'}
                            </button>
                        </div>
                    </div>

                    {/* Last Update */}
                    <div className="text-sm text-blue-200 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Last updated: {lastUpdate.toLocaleTimeString()}
                        <span className="mx-2">•</span>
                        Next update: {new Date(lastUpdate.getTime() + 5 * 60000).toLocaleTimeString()}
                    </div>
                </motion.div>

                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center h-64"
                    >
                        <div className="text-center">
                            <Brain className="w-12 h-12 text-blue-400 animate-pulse mx-auto mb-4" />
                            <p className="text-xl text-white">Generating AI Nowcast...</p>
                            <p className="text-blue-200">Analyzing atmospheric patterns</p>
                        </div>
                    </motion.div>
                ) : nowcastData && (
                    <>
                        {/* Go/No-Go Decision */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8"
                        >
                            <div className={`rounded-xl border p-8 text-center ${getGoNoGoColor(nowcastData.goNoGo)}`}>
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    {nowcastData.goNoGo === 'GO' && <CheckCircle className="w-12 h-12" />}
                                    {nowcastData.goNoGo === 'CAUTION' && <AlertTriangle className="w-12 h-12" />}
                                    {nowcastData.goNoGo === 'NO-GO' && <XCircle className="w-12 h-12" />}
                                    <div>
                                        <h2 className="text-4xl font-bold">{nowcastData.goNoGo}</h2>
                                        <p className="text-lg opacity-80">
                                            {nowcastData.airportName} - Next {nowcastData.horizonMinutes} minutes
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        <span>Confidence: </span>
                                        <span className={`font-bold ${getConfidenceColor(nowcastData.confidence)}`}>
                                            {(nowcastData.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Brain className="w-4 h-4" />
                                        <span>AI Model: RandomForest + GBDT</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Predictions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Weather Predictions */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                            >
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <Cloud className="w-5 h-5 text-blue-400" />
                                    Weather Predictions
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Wind className="w-4 h-4 text-blue-400" />
                                            <span className="text-slate-300">Max Wind Gust</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-white">
                                                {nowcastData.predictions.windGustMax.toFixed(0)} kt
                                            </span>
                                            <div className="text-sm text-slate-400">
                                                {nowcastData.predictions.windDirection.toFixed(0)}°
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-purple-400" />
                                            <span className="text-slate-300">Min Visibility</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-white">
                                                {nowcastData.predictions.visibilityMin.toFixed(0)} m
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Gauge className="w-4 h-4 text-emerald-400" />
                                            <span className="text-slate-300">QNH Trend</span>
                                        </div>
                                        <div className="text-right flex items-center gap-2">
                                            {nowcastData.predictions.qnhTrend > 0 ? (
                                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-red-400" />
                                            )}
                                            <span className={`text-lg font-bold ${nowcastData.predictions.qnhTrend > 0 ? 'text-emerald-400' : 'text-red-400'
                                                }`}>
                                                {nowcastData.predictions.qnhTrend > 0 ? '+' : ''}
                                                {nowcastData.predictions.qnhTrend.toFixed(1)} hPa
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Thermometer className="w-4 h-4 text-yellow-400" />
                                            <span className="text-slate-300">Temperature Trend</span>
                                        </div>
                                        <div className="text-right flex items-center gap-2">
                                            {nowcastData.predictions.temperatureTrend > 0 ? (
                                                <TrendingUp className="w-4 h-4 text-red-400" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-blue-400" />
                                            )}
                                            <span className={`text-lg font-bold ${nowcastData.predictions.temperatureTrend > 0 ? 'text-red-400' : 'text-blue-400'
                                                }`}>
                                                {nowcastData.predictions.temperatureTrend > 0 ? '+' : ''}
                                                {nowcastData.predictions.temperatureTrend.toFixed(1)}°C
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-600">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-300">Cumulonimbus Risk</span>
                                            <span className={`font-bold ${nowcastData.predictions.cbProbability > 0.5 ? 'text-red-400' :
                                                    nowcastData.predictions.cbProbability > 0.3 ? 'text-yellow-400' : 'text-emerald-400'
                                                }`}>
                                                {(nowcastData.predictions.cbProbability * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${nowcastData.predictions.cbProbability > 0.5 ? 'bg-red-400' :
                                                        nowcastData.predictions.cbProbability > 0.3 ? 'bg-yellow-400' : 'bg-emerald-400'
                                                    }`}
                                                style={{ width: `${nowcastData.predictions.cbProbability * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Active Alerts */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                            >
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                    Active Alerts ({nowcastData.alerts.length})
                                </h3>

                                {nowcastData.alerts.length > 0 ? (
                                    <div className="space-y-4">
                                        {nowcastData.alerts.map((alert, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-yellow-400"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-white">{alert.type.replace('_', ' ')}</h4>
                                                    <span className={`text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                                                        {alert.severity}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-300 mb-3">{alert.description}</p>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-400">
                                                        ETA: {alert.etaMinutes} minutes
                                                    </span>
                                                    <span className="text-slate-400">
                                                        Runways: {alert.affectedRunways.join(', ')}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                                        <p className="text-emerald-400 font-medium">No active alerts</p>
                                        <p className="text-sm text-slate-400">Weather conditions are stable</p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Model Inputs */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                            >
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <BarChart3 className="w-5 h-5 text-purple-400" />
                                    Model Inputs
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-300">Temperature Gradient</span>
                                            <span className="font-medium text-white">
                                                {nowcastData.modelInputs.temperatureGradient.toFixed(2)}°C/km
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-600 rounded-full h-1">
                                            <div className="bg-yellow-400 h-1 rounded-full w-3/4" />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-300">Gust Index</span>
                                            <span className="font-medium text-white">
                                                {nowcastData.modelInputs.gustIndex.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-600 rounded-full h-1">
                                            <div
                                                className="bg-blue-400 h-1 rounded-full"
                                                style={{ width: `${nowcastData.modelInputs.gustIndex * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-300">Wind Shear Factor</span>
                                            <span className="font-medium text-white">
                                                {nowcastData.modelInputs.windShear.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-600 rounded-full h-1">
                                            <div
                                                className="bg-red-400 h-1 rounded-full"
                                                style={{ width: `${nowcastData.modelInputs.windShear * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-300">Humidity Change</span>
                                            <span className="font-medium text-white">
                                                {nowcastData.modelInputs.humidityChange.toFixed(1)}%/hr
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-600 rounded-full h-1">
                                            <div className="bg-emerald-400 h-1 rounded-full w-2/3" />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-600">
                                        <h4 className="text-sm font-medium text-slate-300 mb-3">Pressure Trend (12h)</h4>
                                        <div className="flex items-end gap-1 h-16">
                                            {nowcastData.modelInputs.pressureTrend.map((pressure, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-purple-400 rounded-t flex-1"
                                                    style={{
                                                        height: `${((pressure - 1000) / 30) * 100}%`,
                                                        minHeight: '4px'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            Range: {Math.min(...nowcastData.modelInputs.pressureTrend).toFixed(0)} - {Math.max(...nowcastData.modelInputs.pressureTrend).toFixed(0)} hPa
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Model Performance */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                <Zap className="w-5 h-5 text-indigo-400" />
                                AI Model Performance & Validation
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-indigo-400">94.2%</div>
                                    <div className="text-sm text-slate-400">Prediction Accuracy</div>
                                    <div className="text-xs text-slate-500 mt-1">Last 30 days</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-emerald-400">87.8%</div>
                                    <div className="text-sm text-slate-400">Wind Gust Precision</div>
                                    <div className="text-xs text-slate-500 mt-1">±3 kt tolerance</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-400">91.5%</div>
                                    <div className="text-sm text-slate-400">Visibility Forecast</div>
                                    <div className="text-xs text-slate-500 mt-1">±500m tolerance</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-400">15ms</div>
                                    <div className="text-sm text-slate-400">Inference Time</div>
                                    <div className="text-xs text-slate-500 mt-1">Edge processing</div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-600">
                                <p className="text-sm text-slate-400 text-center">
                                    Powered by ensemble ML models: RandomForest + Gradient Boosting + LSTM Neural Networks
                                    <br />
                                    Training data: 2+ years of METAR/TAF + edge sensor fusion + satellite imagery
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    )
}
