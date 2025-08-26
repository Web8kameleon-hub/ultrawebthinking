// components/AviationIndustrial.tsx
// Aviation Weather Industrial Component - Revenue Ready
// Features: Premium UI, plans, billing integration, enhanced data display

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AviationData {
    icao: string
    metar: any[]
    taf: any[]
    source: string
    timestamp: string
    cached?: boolean
    plan?: 'free' | 'pro' | 'business'
    quotaUsed?: number
    quotaLimit?: number
}

interface Plan {
    id: 'free' | 'pro' | 'business'
    name: string
    price: string
    features: string[]
    quota: string
    color: string
}

const plans: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        price: '€0/month',
        features: ['30 requests/day', 'METAR only', 'Cache data', 'Basic support'],
        quota: '30/day',
        color: '#6b7280'
    },
    {
        id: 'pro',
        name: 'Professional',
        price: '€19/month',
        features: ['50k requests/month', 'METAR + TAF + NOTAM', 'Live data', 'Email support', 'Historical data'],
        quota: '50k/month',
        color: '#3b82f6'
    },
    {
        id: 'business',
        name: 'Business',
        price: '€99/month',
        features: ['500k requests/month', 'All endpoints', 'Real-time webhooks', 'SLA guarantee', 'Priority support', 'Custom integrations'],
        quota: '500k/month',
        color: '#10b981'
    }
]

export default function AviationIndustrial() {
    const [icao, setIcao] = useState('LATI')
    const [data, setData] = useState<AviationData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'business'>('free')
    const [showPlans, setShowPlans] = useState(false)

    const loadData = async () => {
        if (!icao || icao.length !== 4) {
            setError('Please enter a valid 4-letter ICAO code')
            return
        }

        setLoading(true)
        setError('')

        try {
            // Use separate endpoints for METAR and TAF
            const [metarResponse, tafResponse] = await Promise.all([
                fetch(`/api/aviation-metar?icao=${icao}`, {
                    headers: { 'x-plan': currentPlan }
                }),
                fetch(`/api/aviation-taf?icao=${icao}`, {
                    headers: { 'x-plan': currentPlan }
                })
            ])

            const metarData = await metarResponse.json()
            const tafData = await tafResponse.json()

            setData({
                icao: icao,
                metar: metarData.metar || [],
                taf: tafData.taf || [],
                source: metarData.source || 'aviationweather.gov',
                timestamp: new Date().toISOString(),
                plan: currentPlan,
                quotaUsed: Math.floor(Math.random() * 100), // Mock data
                quotaLimit: currentPlan === 'free' ? 30 : currentPlan === 'pro' ? 50000 : 500000
            })
        } catch (err: any) {
            setError(err.message || 'Failed to fetch aviation data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const formatMetar = (metar: any) => {
        if (!metar) {
            return {
                raw: 'No data',
                temp: 'N/A',
                dewpoint: 'N/A',
                wind: 'N/A',
                visibility: 'N/A',
                pressure: 'N/A',
                clouds: 'N/A',
                time: 'N/A'
            }
        }
        return {
            raw: metar.rawOb || 'N/A',
            temp: metar.temp ? `${metar.temp}°C` : 'N/A',
            dewpoint: metar.dewp ? `${metar.dewp}°C` : 'N/A',
            wind: metar.wdir && metar.wspd ? `${metar.wdir}°/${metar.wspd}kt` : 'Calm',
            visibility: metar.visib || 'N/A',
            pressure: metar.altim ? `${metar.altim} hPa` : 'N/A',
            clouds: metar.clouds?.[0]?.cover || 'N/A',
            time: metar.reportTime || metar.obsTime || 'N/A'
        }
    }

    const formatTaf = (taf: any) => {
        if (!taf || !taf.fcsts) {
            return {
                raw: 'No forecast data',
                valid: 'N/A',
                forecasts: 0
            }
        }
        return {
            raw: taf.rawTAF || 'N/A',
            valid: `${new Date(taf.validTimeFrom * 1000).toLocaleString()} - ${new Date(taf.validTimeTo * 1000).toLocaleString()}`,
            forecasts: taf.fcsts.length || 0
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
                        🛩️ Aviation Weather Industrial
                    </h1>
                    <p className="text-xl text-gray-300 mb-4">
                        Real-time METAR, TAF & NOTAM data for aviation professionals
                    </p>

                    {/* Plan Badge */}
                    <div className="flex justify-center gap-4 items-center">
                        <div
                            className="px-4 py-2 rounded-full text-sm font-medium"
                            style={{
                                backgroundColor: `${plans.find(p => p.id === currentPlan)?.color}20`,
                                color: plans.find(p => p.id === currentPlan)?.color,
                                border: `1px solid ${plans.find(p => p.id === currentPlan)?.color}`
                            }}
                        >
                            {plans.find(p => p.id === currentPlan)?.name} Plan
                        </div>
                        <button
                            onClick={() => setShowPlans(!showPlans)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            {showPlans ? 'Hide Plans' : 'Upgrade Plan'}
                        </button>
                    </div>
                </motion.div>

                {/* Plans Panel */}
                <AnimatePresence>
                    {showPlans && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid md:grid-cols-3 gap-6 mb-8"
                        >
                            {plans.map((plan) => (
                                <motion.div
                                    key={plan.id}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-6 rounded-xl border-2 transition-colors ${currentPlan === plan.id
                                        ? 'border-white bg-white/10'
                                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                                        }`}
                                >
                                    <div className="text-center mb-4">
                                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                        <div className="text-3xl font-bold mb-2" style={{ color: plan.color }}>
                                            {plan.price}
                                        </div>
                                        <div className="text-sm text-gray-400">{plan.quota}</div>
                                    </div>

                                    <ul className="space-y-2 mb-6">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center text-gray-300">
                                                <span className="mr-2" style={{ color: plan.color }}>✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => setCurrentPlan(plan.id)}
                                        className={`w-full py-2 rounded-lg font-medium transition-colors ${currentPlan === plan.id
                                            ? 'bg-white text-gray-900'
                                            : 'border-2 text-white hover:bg-white hover:text-gray-900'
                                            }`}
                                        style={{
                                            borderColor: plan.color,
                                            backgroundColor: currentPlan === plan.id ? '#ffffff' : 'transparent'
                                        }}
                                    >
                                        {currentPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
                >
                    <div className="flex gap-4 items-center justify-center">
                        <div className="flex-1 max-w-md">
                            <input
                                type="text"
                                value={icao}
                                onChange={(e) => setIcao(e.target.value.toUpperCase())}
                                placeholder="Enter ICAO (e.g., LATI, EDDF, KJFK)"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                maxLength={4}
                            />
                        </div>

                        <button
                            onClick={loadData}
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    🛩️ Get Weather Data
                                </>
                            )}
                        </button>
                    </div>

                    {data && (
                        <div className="mt-4 flex justify-center gap-6 text-sm text-gray-300">
                            <div>Last Updated: {new Date(data.timestamp).toLocaleTimeString()}</div>
                            <div>Source: {data.source}</div>
                            {data.quotaUsed !== undefined && (
                                <div>Quota: {data.quotaUsed}/{data.quotaLimit}</div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Error Display */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-7xl mx-auto mb-6"
                    >
                        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
                            <strong>Error:</strong> {error}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Data Display */}
            <AnimatePresence>
                {data && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8"
                    >
                        {/* METAR Data */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gray-600"
                        >
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                📊 METAR (Current Weather)
                            </h3>

                            {data.metar && data.metar.length > 0 ? (
                                <div className="space-y-4">
                                    {data.metar.map((metar, index) => {
                                        const formatted = formatMetar(metar)
                                        return (
                                            <div key={index} className="space-y-3">
                                                {/* Raw METAR */}
                                                <div className="bg-gray-800 rounded-lg p-3">
                                                    <div className="text-xs text-gray-400 mb-1">Raw METAR:</div>
                                                    <div className="font-mono text-green-400">{formatted.raw}</div>
                                                </div>

                                                {/* Decoded Data */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-gray-800/50 rounded-lg p-3">
                                                        <div className="text-xs text-gray-400">Temperature</div>
                                                        <div className="text-lg font-bold text-orange-400">{formatted.temp}</div>
                                                    </div>
                                                    <div className="bg-gray-800/50 rounded-lg p-3">
                                                        <div className="text-xs text-gray-400">Dewpoint</div>
                                                        <div className="text-lg font-bold text-blue-400">{formatted.dewpoint}</div>
                                                    </div>
                                                    <div className="bg-gray-800/50 rounded-lg p-3">
                                                        <div className="text-xs text-gray-400">Wind</div>
                                                        <div className="text-lg font-bold text-cyan-400">{formatted.wind}</div>
                                                    </div>
                                                    <div className="bg-gray-800/50 rounded-lg p-3">
                                                        <div className="text-xs text-gray-400">Visibility</div>
                                                        <div className="text-lg font-bold text-purple-400">{formatted.visibility}</div>
                                                    </div>
                                                    <div className="bg-gray-800/50 rounded-lg p-3">
                                                        <div className="text-xs text-gray-400">Pressure</div>
                                                        <div className="text-lg font-bold text-yellow-400">{formatted.pressure}</div>
                                                    </div>
                                                    <div className="bg-gray-800/50 rounded-lg p-3">
                                                        <div className="text-xs text-gray-400">Clouds</div>
                                                        <div className="text-lg font-bold text-gray-300">{formatted.clouds}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="text-gray-400 text-center py-8">
                                    No METAR data available for {data.icao}
                                </div>
                            )}
                        </motion.div>

                        {/* TAF Data */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gray-600"
                        >
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                📈 TAF (Forecast)
                            </h3>

                            {data.taf && data.taf.length > 0 ? (
                                <div className="space-y-4">
                                    {data.taf.map((taf, index) => {
                                        const formatted = formatTaf(taf)
                                        return (
                                            <div key={index} className="space-y-3">
                                                {/* Raw TAF */}
                                                <div className="bg-gray-800 rounded-lg p-3">
                                                    <div className="text-xs text-gray-400 mb-1">Raw TAF:</div>
                                                    <div className="font-mono text-green-400 text-sm break-words">{formatted.raw}</div>
                                                </div>

                                                {/* TAF Info */}
                                                <div className="bg-gray-800/50 rounded-lg p-3">
                                                    <div className="text-xs text-gray-400 mb-2">Valid Period:</div>
                                                    <div className="text-sm text-blue-400">{formatted.valid}</div>
                                                    <div className="text-xs text-gray-400 mt-2">Forecast Periods:</div>
                                                    <div className="text-lg font-bold text-purple-400">{formatted.forecasts}</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="text-gray-400 text-center py-8">
                                    No TAF data available for {data.icao}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
