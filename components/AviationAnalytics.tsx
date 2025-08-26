// components/AviationAnalytics.tsx
// Aviation Analytics Dashboard - Premium Features
// Charts, Statistics, Multi-Airport Comparisons, Historical Data

'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Clock, Eye, MapPin, Plane, Star, TrendingUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface AnalyticsData {
    hourlyTraffic: Array<{ hour: string; flights: number; weather_requests: number }>
    topAirports: Array<{ icao: string; name: string; requests: number; percentage: number }>
    weatherConditions: Array<{ condition: string; count: number; color: string }>
    performanceMetrics: {
        totalRequests: number
        averageResponseTime: number
        uptime: number
        errorRate: number
    }
}

const mockAnalytics: AnalyticsData = {
    hourlyTraffic: [
        { hour: '00:00', flights: 45, weather_requests: 123 },
        { hour: '03:00', flights: 23, weather_requests: 89 },
        { hour: '06:00', flights: 67, weather_requests: 234 },
        { hour: '09:00', flights: 145, weather_requests: 456 },
        { hour: '12:00', flights: 189, weather_requests: 567 },
        { hour: '15:00', flights: 156, weather_requests: 445 },
        { hour: '18:00', flights: 198, weather_requests: 623 },
        { hour: '21:00', flights: 134, weather_requests: 345 }
    ],
    topAirports: [
        { icao: 'LATI', name: 'Tirana International', requests: 1234, percentage: 23.5 },
        { icao: 'EDDF', name: 'Frankfurt', requests: 987, percentage: 18.7 },
        { icao: 'LOWW', name: 'Vienna', requests: 765, percentage: 14.5 },
        { icao: 'LIRF', name: 'Rome Fiumicino', requests: 543, percentage: 10.3 },
        { icao: 'LGAV', name: 'Athens', requests: 432, percentage: 8.2 }
    ],
    weatherConditions: [
        { condition: 'Clear', count: 45, color: '#10B981' },
        { condition: 'Partly Cloudy', count: 32, color: '#F59E0B' },
        { condition: 'Overcast', count: 18, color: '#6B7280' },
        { condition: 'Rain', count: 12, color: '#3B82F6' },
        { condition: 'Fog', count: 8, color: '#8B5CF6' }
    ],
    performanceMetrics: {
        totalRequests: 15640,
        averageResponseTime: 245,
        uptime: 99.8,
        errorRate: 0.2
    }
}

export default function AviationAnalytics() {
    const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics)
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h')
    const [loading, setLoading] = useState(false)

    const refreshAnalytics = async () => {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setAnalytics(mockAnalytics)
        setLoading(false)
    }

    useEffect(() => {
        refreshAnalytics()
    }, [timeRange])

    const getStatusColor = (value: number, type: 'uptime' | 'error' | 'response') => {
        if (type === 'uptime') {
            if (value >= 99.5) return 'text-green-400'
            if (value >= 98) return 'text-yellow-400'
            return 'text-red-400'
        }
        if (type === 'error') {
            if (value <= 0.5) return 'text-green-400'
            if (value <= 2) return 'text-yellow-400'
            return 'text-red-400'
        }
        if (type === 'response') {
            if (value <= 200) return 'text-green-400'
            if (value <= 500) return 'text-yellow-400'
            return 'text-red-400'
        }
        return 'text-gray-400'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                Aviation Analytics
                            </h1>
                            <p className="text-purple-200">Real-time insights and performance metrics</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
                            {['24h', '7d', '30d'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range as any)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${timeRange === range
                                            ? 'bg-purple-600 text-white'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={refreshAnalytics}
                            disabled={loading}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Refresh'
                            )}
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-2xl font-bold text-blue-400">
                                {analytics.performanceMetrics.totalRequests.toLocaleString()}
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-slate-400">Total Requests</h3>
                        <p className="text-xs text-green-400 mt-1">↗ +12.5% from last period</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-green-400" />
                            </div>
                            <span className={`text-2xl font-bold ${getStatusColor(analytics.performanceMetrics.averageResponseTime, 'response')}`}>
                                {analytics.performanceMetrics.averageResponseTime}ms
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-slate-400">Avg Response Time</h3>
                        <p className="text-xs text-green-400 mt-1">↗ -15ms from last period</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className={`text-2xl font-bold ${getStatusColor(analytics.performanceMetrics.uptime, 'uptime')}`}>
                                {analytics.performanceMetrics.uptime}%
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-slate-400">System Uptime</h3>
                        <p className="text-xs text-green-400 mt-1">↗ +0.2% from last period</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                            </div>
                            <span className={`text-2xl font-bold ${getStatusColor(analytics.performanceMetrics.errorRate, 'error')}`}>
                                {analytics.performanceMetrics.errorRate}%
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-slate-400">Error Rate</h3>
                        <p className="text-xs text-red-400 mt-1">↗ +0.1% from last period</p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Traffic Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
                >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Plane className="w-5 h-5 text-blue-400" />
                        Hourly Traffic & Weather Requests
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.hourlyTraffic}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="hour" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#F9FAFB'
                                }}
                            />
                            <Bar dataKey="flights" fill="#3B82F6" name="Flights" />
                            <Bar dataKey="weather_requests" fill="#8B5CF6" name="Weather Requests" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Weather Conditions Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
                >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-green-400" />
                        Weather Conditions Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={analytics.weatherConditions}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="count"
                                label={({ condition, percentage }) => `${condition} (${((percentage || 0) * 100).toFixed(1)}%)`}
                            >
                                {analytics.weatherConditions.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#F9FAFB'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Top Airports Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
            >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-yellow-400" />
                    Top Airports by Request Volume
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left py-3 px-4 text-slate-400">Rank</th>
                                <th className="text-left py-3 px-4 text-slate-400">Airport</th>
                                <th className="text-left py-3 px-4 text-slate-400">ICAO</th>
                                <th className="text-left py-3 px-4 text-slate-400">Requests</th>
                                <th className="text-left py-3 px-4 text-slate-400">Percentage</th>
                                <th className="text-left py-3 px-4 text-slate-400">Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.topAirports.map((airport, index) => (
                                <tr key={airport.icao} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {index < 3 && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                                            <span className="font-bold">{index + 1}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 font-medium">{airport.name}</td>
                                    <td className="py-3 px-4">
                                        <span className="font-mono bg-slate-700 px-2 py-1 rounded text-blue-300">
                                            {airport.icao}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 font-bold">{airport.requests.toLocaleString()}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-slate-700 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                                    style={{ width: `${airport.percentage * 4}%` }}
                                                />
                                            </div>
                                            <span className="text-sm">{airport.percentage}%</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-green-400 text-sm">↗ +{Math.floor(Math.random() * 20 + 5)}%</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}
