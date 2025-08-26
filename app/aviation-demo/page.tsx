// app/aviation-demo/page.tsx
// Aviation Platform Demo - All Components in One Page
// Showcasing AviationIndustrialModern, Analytics, and Pricing

'use client'

import AviationAnalytics from '@/components/AviationAnalytics'
import AviationIndustrialModern from '@/components/AviationIndustrialModern'
import AviationPricing from '@/components/AviationPricing'
import MeshNetworkWeek2 from '@/components/aviation/MeshNetworkWeek2'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, CreditCard, Network, Plane } from 'lucide-react'
import { useState } from 'react'

type ActiveTab = 'weather' | 'analytics' | 'pricing' | 'mesh'

export default function AviationDemoPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('weather')

    const tabs = [
        {
            id: 'weather' as ActiveTab,
            name: 'Weather Dashboard',
            icon: Plane,
            description: 'Real-time aviation weather data'
        },
        {
            id: 'analytics' as ActiveTab,
            name: 'Analytics',
            icon: BarChart3,
            description: 'Performance metrics and insights'
        },
        {
            id: 'pricing' as ActiveTab,
            name: 'Pricing Plans',
            icon: CreditCard,
            description: 'Enterprise monetization strategy'
        },
        {
            id: 'mesh' as ActiveTab,
            name: 'Mesh Network Week 2',
            icon: Network,
            description: 'DTN + Wi-Fi Direct + 3D Topology'
        }
    ]

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'weather':
                return <AviationIndustrialModern />
            case 'analytics':
                return <AviationAnalytics />
            case 'pricing':
                return <AviationPricing />
            case 'mesh':
                return <MeshNetworkWeek2 />
            default:
                return <AviationIndustrialModern />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Navigation Header */}
            <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <Plane className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Aviation Platform Demo</h1>
                                <p className="text-sm text-blue-200">Industrial-grade weather API with monetization</p>
                            </div>
                        </div>
                        <div className="text-sm text-blue-200">
                            EuroWeb Ultra Aviation Module
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-md transition-all ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-medium">{tab.name}</div>
                                        <div className="text-xs opacity-80">{tab.description}</div>
                                    </div>
                                    {activeTab === tab.id && (
                                        <ArrowRight className="w-4 h-4 ml-auto" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
            >
                {renderActiveComponent()}
            </motion.div>

            {/* Footer Info */}
            <div className="bg-slate-900/50 border-t border-slate-700 p-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-blue-400 mb-2">Weather Dashboard</h3>
                            <p className="text-sm text-slate-400">
                                Real-time METAR & TAF data from European airports with multi-airport support,
                                favorites, and auto-refresh capabilities.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-purple-400 mb-2">Analytics Platform</h3>
                            <p className="text-sm text-slate-400">
                                Comprehensive analytics with traffic monitoring, weather distribution charts,
                                and performance metrics for enterprise insights.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">Monetization Strategy</h3>
                            <p className="text-sm text-slate-400">
                                Professional pricing plans from Starter to Enterprise with custom solutions,
                                SLA agreements, and dedicated support.
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-slate-500">
                        EuroWeb Ultra - Aviation Weather Platform | Built with Next.js 14, TypeScript, and Framer Motion
                    </div>
                </div>
            </div>
        </div>
    )
}
