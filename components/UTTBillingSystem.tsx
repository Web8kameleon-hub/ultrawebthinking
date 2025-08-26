'use client'

import { motion } from 'framer-motion'
import {
    Activity,
    AlertCircle,
    ArrowDown,
    ArrowUp,
    BarChart3,
    Calendar,
    CheckCircle,
    CreditCard,
    DollarSign,
    Download,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface UTTMetrics {
    balance: number
    monthlySpend: number
    requestsThisMonth: number
    bytesOut: string
    activeAirports: number
    tier: string
    requestsRemaining: number
    projectedCost: number
}

interface UsageData {
    endpoint: string
    requests: number
    cost: number
    percentage: number
}

interface BillingHistory {
    date: string
    amount: number
    description: string
    status: 'paid' | 'pending' | 'failed'
}

export default function UTTBillingSystem() {
    const [metrics, setMetrics] = useState<UTTMetrics>({
        balance: 245.67,
        monthlySpend: 87.34,
        requestsThisMonth: 125670,
        bytesOut: '2.4 TB',
        activeAirports: 15,
        tier: 'Enterprise',
        requestsRemaining: 374330,
        projectedCost: 92.15
    })

    const [usageData, setUsageData] = useState<UsageData[]>([
        { endpoint: '/api/aviation/metar', requests: 89234, cost: 45.67, percentage: 52.3 },
        { endpoint: '/api/aviation/nowcast', requests: 23456, cost: 28.90, percentage: 33.1 },
        { endpoint: '/api/aviation/taf', requests: 8967, cost: 8.45, percentage: 9.7 },
        { endpoint: '/api/edge/ingest', requests: 3456, cost: 3.12, percentage: 3.6 },
        { endpoint: '/api/alerts/webhook', requests: 557, cost: 1.20, percentage: 1.4 }
    ])

    const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([
        { date: '2025-08-01', amount: 87.34, description: 'Monthly API Usage', status: 'paid' },
        { date: '2025-07-01', amount: 92.15, description: 'Monthly API Usage', status: 'paid' },
        { date: '2025-06-01', amount: 78.92, description: 'Monthly API Usage', status: 'paid' },
        { date: '2025-05-15', amount: 150.00, description: 'Enterprise Plan Upgrade', status: 'paid' },
        { date: '2025-05-01', amount: 45.67, description: 'Monthly API Usage', status: 'paid' }
    ])

    const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d')

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                ...prev,
                requestsThisMonth: prev.requestsThisMonth + Math.floor(Math.random() * 10),
                requestsRemaining: prev.requestsRemaining - Math.floor(Math.random() * 10),
                monthlySpend: prev.monthlySpend + Math.random() * 0.1
            }))
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Starter': return 'text-blue-400'
            case 'Professional': return 'text-purple-400'
            case 'Enterprise': return 'text-yellow-400'
            default: return 'text-slate-400'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <CheckCircle className="w-4 h-4 text-emerald-500" />
            case 'pending': return <Activity className="w-4 h-4 text-yellow-500" />
            case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />
            default: return <Activity className="w-4 h-4 text-slate-400" />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-6">
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
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">UTT Billing Dashboard</h1>
                                <p className="text-purple-200">Usage-based monetization & analytics</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
                                className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
                            >
                                <option value="7d">Last 7 days</option>
                                <option value="30d">Last 30 days</option>
                                <option value="90d">Last 90 days</option>
                            </select>
                            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                <Download className="w-4 h-4 inline mr-2" />
                                Export Report
                            </button>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-emerald-400" />
                                    <span className="text-sm font-medium text-slate-300">Account Balance</span>
                                </div>
                                <ArrowUp className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="text-2xl font-bold text-emerald-400">${metrics.balance.toFixed(2)}</div>
                            <div className="text-sm text-slate-400">Available credit</div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-5 h-5 text-purple-400" />
                                    <span className="text-sm font-medium text-slate-300">Monthly Spend</span>
                                </div>
                                <TrendingUp className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="text-2xl font-bold text-purple-400">${metrics.monthlySpend.toFixed(2)}</div>
                            <div className="text-sm text-slate-400">This billing cycle</div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Zap className="w-5 h-5 text-blue-400" />
                                    <span className="text-sm font-medium text-slate-300">API Requests</span>
                                </div>
                                <ArrowUp className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="text-2xl font-bold text-blue-400">
                                {metrics.requestsThisMonth.toLocaleString()}
                            </div>
                            <div className="text-sm text-slate-400">This month</div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-yellow-400" />
                                    <span className="text-sm font-medium text-slate-300">Plan Tier</span>
                                </div>
                            </div>
                            <div className={`text-2xl font-bold ${getTierColor(metrics.tier)}`}>
                                {metrics.tier}
                            </div>
                            <div className="text-sm text-slate-400">{metrics.activeAirports} airports active</div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Usage Analytics and Cost Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* API Usage Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-purple-400" />
                            API Endpoint Usage
                        </h2>

                        <div className="space-y-4">
                            {usageData.map((item, index) => (
                                <motion.div
                                    key={item.endpoint}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-slate-700/30 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-medium text-white">{item.endpoint}</h3>
                                            <p className="text-sm text-slate-400">
                                                {item.requests.toLocaleString()} requests
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-purple-400">
                                                ${item.cost.toFixed(2)}
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                {item.percentage}% of total
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-600 rounded-full h-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                                            className="bg-purple-400 h-2 rounded-full"
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-600">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-300">Total API Cost:</span>
                                <span className="text-xl font-bold text-purple-400">
                                    ${usageData.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Usage Projections */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            Usage Projections
                        </h2>

                        <div className="space-y-6">
                            {/* Current Usage */}
                            <div className="bg-slate-700/30 rounded-lg p-4">
                                <h3 className="font-semibold text-white mb-3">Current Month Progress</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-slate-300">Requests Used</span>
                                            <span className="text-sm font-medium text-white">
                                                {metrics.requestsThisMonth.toLocaleString()} / 500,000
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-600 rounded-full h-2">
                                            <div
                                                className="bg-blue-400 h-2 rounded-full transition-all"
                                                style={{ width: `${(metrics.requestsThisMonth / 500000) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-slate-300">Data Transfer</span>
                                            <span className="text-sm font-medium text-white">
                                                {metrics.bytesOut} / Unlimited
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-600 rounded-full h-2">
                                            <div className="bg-emerald-400 h-2 rounded-full w-1/3" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Projections */}
                            <div className="bg-slate-700/30 rounded-lg p-4">
                                <h3 className="font-semibold text-white mb-3">End-of-Month Projection</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-300">Projected Requests:</span>
                                        <span className="font-medium text-blue-400">
                                            {(metrics.requestsThisMonth * 1.2).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-300">Projected Cost:</span>
                                        <span className="font-medium text-yellow-400">
                                            ${metrics.projectedCost.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-300">Cost vs Last Month:</span>
                                        <span className="font-medium text-emerald-400 flex items-center gap-1">
                                            <ArrowDown className="w-4 h-4" />
                                            -5.2%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Optimization Tips */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-400 mb-2">💡 Optimization Tips</h3>
                                <ul className="text-sm text-blue-200 space-y-1">
                                    <li>• Cache METAR data for 5-10 minutes to reduce costs</li>
                                    <li>• Bundle multiple airport requests in single API calls</li>
                                    <li>• Use webhook alerts instead of polling for events</li>
                                    <li>• Consider upgrading to Enterprise for better rates</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Billing History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-emerald-400" />
                            Billing History
                        </h2>
                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                            Download Invoices
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-600">
                                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Date</th>
                                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Description</th>
                                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Amount</th>
                                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billingHistory.map((item, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="border-b border-slate-700/50 hover:bg-slate-700/20"
                                    >
                                        <td className="py-4 px-4 text-white">
                                            {new Date(item.date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4 text-slate-300">{item.description}</td>
                                        <td className="py-4 px-4 text-white font-medium">
                                            ${item.amount.toFixed(2)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(item.status)}
                                                <span className={`capitalize ${item.status === 'paid' ? 'text-emerald-400' :
                                                        item.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button className="text-blue-400 hover:text-blue-300 text-sm">
                                                Download Invoice
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
