// components/AviationRevenueDashboard.tsx
// Aviation Revenue Analytics & Business Intelligence

'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface RevenueMetrics {
    totalRevenue: number
    monthlyGrowth: number
    activeSubscribers: {
        free: number
        pro: number
        business: number
    }
    apiCalls: {
        today: number
        thisMonth: number
        avgResponseTime: number
    }
    conversionRate: number
    churnRate: number
}

const mockMetrics: RevenueMetrics = {
    totalRevenue: 12450,
    monthlyGrowth: 23.5,
    activeSubscribers: {
        free: 1247,
        pro: 89,
        business: 12
    },
    apiCalls: {
        today: 15678,
        thisMonth: 456789,
        avgResponseTime: 287
    },
    conversionRate: 7.1,
    churnRate: 2.3
}

const targetMarkets = [
    { name: 'Flight Training Schools', potential: 150, region: 'DE/AL/GR', revenue: '€2,850/month' },
    { name: 'Private Aviation', potential: 300, region: 'Europe', revenue: '€5,700/month' },
    { name: 'Weather Services', potential: 50, region: 'Balkans', revenue: '€4,950/month' },
    { name: 'Aviation Apps/Developers', potential: 500, region: 'Global', revenue: '€9,500/month' }
]

export default function AviationRevenueDashboard() {
    const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month')

    const totalMRR = (mockMetrics.activeSubscribers.pro * 19) + (mockMetrics.activeSubscribers.business * 99)
    const potentialMRR = targetMarkets.reduce((sum, market) => sum + parseInt(market.revenue.replace(/[€,/month]/g, '')), 0)

    return (
        <div className="p-6 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mb-4">
                        💰 Aviation Revenue Dashboard
                    </h1>
                    <p className="text-xl text-gray-300">
                        Real-time business analytics for Web8 Aviation Gateway
                    </p>
                </motion.div>

                {/* Time Filter */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-800/50 rounded-lg p-1 flex gap-1">
                        {(['day', 'week', 'month', 'year'] as const).map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedTimeframe(period)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedTimeframe === period
                                        ? 'bg-green-600 text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`}
                            >
                                {period.charAt(0).toUpperCase() + period.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-600"
                    >
                        <div className="text-green-400 text-2xl mb-2">💶</div>
                        <div className="text-3xl font-bold text-white">€{totalMRR.toLocaleString()}</div>
                        <div className="text-sm text-gray-300">Monthly Recurring Revenue</div>
                        <div className="text-green-400 text-sm mt-1">+{mockMetrics.monthlyGrowth}% this month</div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-600"
                    >
                        <div className="text-blue-400 text-2xl mb-2">👥</div>
                        <div className="text-3xl font-bold text-white">{Object.values(mockMetrics.activeSubscribers).reduce((a, b) => a + b)}</div>
                        <div className="text-sm text-gray-300">Total Active Users</div>
                        <div className="text-blue-400 text-sm mt-1">{mockMetrics.conversionRate}% conversion rate</div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-600"
                    >
                        <div className="text-purple-400 text-2xl mb-2">🚀</div>
                        <div className="text-3xl font-bold text-white">{mockMetrics.apiCalls.thisMonth.toLocaleString()}</div>
                        <div className="text-sm text-gray-300">API Calls This Month</div>
                        <div className="text-purple-400 text-sm mt-1">{mockMetrics.apiCalls.avgResponseTime}ms avg response</div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-600"
                    >
                        <div className="text-yellow-400 text-2xl mb-2">🎯</div>
                        <div className="text-3xl font-bold text-white">€{potentialMRR.toLocaleString()}</div>
                        <div className="text-sm text-gray-300">Potential MRR (Target Markets)</div>
                        <div className="text-yellow-400 text-sm mt-1">5x current revenue</div>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Subscription Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-600"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">📊 Subscription Breakdown</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                                <div>
                                    <div className="text-white font-medium">Free Plan</div>
                                    <div className="text-gray-400 text-sm">30 requests/day</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-400">{mockMetrics.activeSubscribers.free}</div>
                                    <div className="text-sm text-gray-500">€0 MRR</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-blue-900/30 rounded-lg">
                                <div>
                                    <div className="text-white font-medium">Professional</div>
                                    <div className="text-blue-400 text-sm">50k requests/month • €19/month</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-400">{mockMetrics.activeSubscribers.pro}</div>
                                    <div className="text-sm text-blue-400">€{(mockMetrics.activeSubscribers.pro * 19).toLocaleString()} MRR</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-green-900/30 rounded-lg">
                                <div>
                                    <div className="text-white font-medium">Business</div>
                                    <div className="text-green-400 text-sm">500k requests/month • €99/month</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-400">{mockMetrics.activeSubscribers.business}</div>
                                    <div className="text-sm text-green-400">€{(mockMetrics.activeSubscribers.business * 99).toLocaleString()} MRR</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Target Markets */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-600"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">🎯 Target Markets</h3>

                        <div className="space-y-4">
                            {targetMarkets.map((market, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.01 }}
                                    className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-white font-medium">{market.name}</div>
                                        <div className="text-green-400 font-bold">{market.revenue}</div>
                                    </div>
                                    <div className="text-gray-400 text-sm mb-1">
                                        {market.potential} potential customers • {market.region}
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full"
                                            style={{ width: `${Math.min((market.potential / 500) * 100, 100)}%` }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Business Strategy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-600"
                >
                    <h3 className="text-2xl font-bold text-white mb-6">🚀 Growth Strategy</h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <h4 className="text-lg font-bold text-green-400">Phase 1: Market Entry</h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• Target 20 flight schools in DE/AL/GR</li>
                                <li>• Free trial → Professional conversion</li>
                                <li>• Partner with aviation training centers</li>
                                <li>• Estimated: €2,000-4,000 MRR</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-lg font-bold text-blue-400">Phase 2: Scale & Features</h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• Add NOTAM & real-time alerts</li>
                                <li>• Custom integrations for business</li>
                                <li>• White-label solutions</li>
                                <li>• Estimated: €8,000-15,000 MRR</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-lg font-bold text-purple-400">Phase 3: Enterprise</h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• Partner with airlines & airports</li>
                                <li>• Custom enterprise solutions</li>
                                <li>• Multi-region data centers</li>
                                <li>• Estimated: €25,000+ MRR</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 text-center text-gray-400 text-sm"
                >
                    <div className="bg-gray-800/30 rounded-lg p-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <div className="text-white font-bold">98.7%</div>
                                <div>Uptime SLA</div>
                            </div>
                            <div>
                                <div className="text-white font-bold">287ms</div>
                                <div>Avg Response</div>
                            </div>
                            <div>
                                <div className="text-white font-bold">24/7</div>
                                <div>Monitoring</div>
                            </div>
                            <div>
                                <div className="text-white font-bold">EU GDPR</div>
                                <div>Compliant</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
