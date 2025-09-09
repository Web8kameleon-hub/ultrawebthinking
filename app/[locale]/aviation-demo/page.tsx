// app/[locale]/aviation-demo/page.tsx
// Aviation Platform Demo - All Components in One Page
// Showcasing AviationIndustrialModern, Analytics, and Pricing

'use client'

import RadioPropagationDashboard from '@/components/aviation/RadioPropagationDashboard'
import AviationAnalytics from '@/components/AviationAnalytics'
import AviationFormulaCalculator from '@/components/AviationFormulaCalculator'
import AviationIndustrialModern from '@/components/AviationIndustrialModern'
import AviationPDFTools from '@/components/AviationPDFTools'
import AviationPlatformOverview from '@/components/AviationPlatformOverview'
import AviationPricing from '@/components/AviationPricing'
import EdgeGatewayManager from '@/components/EdgeGatewayManager'
import FlightTracking3D from '@/components/FlightTracking3D'
import MeshRadioDemo from '@/components/MeshRadioDemo'
import PredictiveNowcasting from '@/components/PredictiveNowcasting'
import SatelliteGPSIntegration from '@/components/SatelliteGPSIntegration'
import UTTBillingSystem from '@/components/UTTBillingSystem'
import { motion } from 'framer-motion'
import { Antenna, BarChart3, Brain, Calculator, CreditCard, DollarSign, FileText, Plane, Radio, Satellite, Settings, Zap } from 'lucide-react'
import { useState } from 'react'

type ActiveTab = 'overview' | 'weather' | 'analytics' | 'pricing' | 'calculator' | 'pdf' | 'tracking' | 'integration' | 'mesh' | 'propagation' | 'edge' | 'nowcast' | 'billing'

export default function AviationDemoPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('overview')

    const tabs = [
        {
            id: 'overview' as ActiveTab,
            name: 'Platform Overview',
            icon: Zap,
            description: 'Complete tools summary'
        },
        {
            id: 'weather' as ActiveTab,
            name: 'Weather Dashboard',
            icon: Plane,
            description: 'Real-time aviation weather data'
        },
        {
            id: 'nowcast' as ActiveTab,
            name: 'AI Nowcasting',
            icon: Brain,
            description: 'Predictive 30-min forecasts'
        },
        {
            id: 'edge' as ActiveTab,
            name: 'Edge Fleet',
            icon: Antenna,
            description: 'LoRa gateway management'
        },
        {
            id: 'analytics' as ActiveTab,
            name: 'Analytics',
            icon: BarChart3,
            description: 'Performance metrics and insights'
        },
        {
            id: 'billing' as ActiveTab,
            name: 'UTT Billing',
            icon: DollarSign,
            description: 'Usage-based monetization'
        },
        {
            id: 'calculator' as ActiveTab,
            name: 'Formula Calculator',
            icon: Calculator,
            description: 'Aviation calculations & formulas'
        },
        {
            id: 'pdf' as ActiveTab,
            name: 'PDF Tools',
            icon: FileText,
            description: 'Report generation & export'
        },
        {
            id: 'tracking' as ActiveTab,
            name: 'Flight Tracking 3D',
            icon: Satellite,
            description: 'Satellite + GPS global tracking'
        },
        {
            id: 'integration' as ActiveTab,
            name: 'Integration Dashboard',
            icon: Settings,
            description: 'Satellite + GPS integration status'
        },
        {
            id: 'mesh' as ActiveTab,
            name: 'LoRa Mesh Radio',
            icon: Radio,
            description: 'EU868 offline radio demo'
        },
        {
            id: 'propagation' as ActiveTab,
            name: 'Radio Propagation',
            icon: Antenna,
            description: 'Ionospheric intelligence & optimization'
        },
        {
            id: 'pricing' as ActiveTab,
            name: 'Pricing Plans',
            icon: CreditCard,
            description: 'Enterprise monetization strategy'
        }
    ]

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'overview':
                return <AviationPlatformOverview />
            case 'weather':
                return <AviationIndustrialModern />
            case 'nowcast':
                return <PredictiveNowcasting />
            case 'edge':
                return <EdgeGatewayManager />
            case 'analytics':
                return <AviationAnalytics />
            case 'billing':
                return <UTTBillingSystem />
            case 'calculator':
                return <AviationFormulaCalculator />
            case 'pdf':
                return <AviationPDFTools />
            case 'tracking':
                return <FlightTracking3D />
            case 'integration':
                return <SatelliteGPSIntegration />
            case 'mesh':
                return <MeshRadioDemo />
            case 'propagation':
                return <RadioPropagationDashboard />
            case 'pricing':
                return <AviationPricing />
            default:
                return <AviationPlatformOverview />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Navigation Header */}
            <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <Plane className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">EuroWeb Ultra Aviation</h1>
                                <p className="text-xs text-blue-200">Edge-to-Cloud • LoRa + Mesh + GPS + UTT + AI</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium text-white">
                                {tabs.find(t => t.id === activeTab)?.name}
                            </div>
                            <div className="text-xs text-blue-200">
                                {tabs.find(t => t.id === activeTab)?.description}
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation - Two Row Layout */}
                    <div className="bg-slate-800/50 rounded-lg p-2">
                        {/* First Row - Primary Tools */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tabs.slice(0, 5).map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all min-w-0 flex-1 sm:flex-none ${activeTab === tab.id
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        <div className="text-center min-w-0">
                                            <div className="text-xs font-medium truncate">{tab.name}</div>
                                            <div className="text-xs opacity-70 hidden md:block truncate">{tab.description}</div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Second Row - Secondary Tools */}
                        <div className="flex flex-wrap gap-2">
                            {tabs.slice(5).map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all min-w-0 flex-1 sm:flex-none ${activeTab === tab.id
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        <div className="text-center min-w-0">
                                            <div className="text-xs font-medium truncate">{tab.name}</div>
                                            <div className="text-xs opacity-70 hidden md:block truncate">{tab.description}</div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="mt-3 flex items-center justify-center gap-6 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span>Live System</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>12 Tools Active</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>Edge + Cloud Architecture</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>AI Nowcasting Ready</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>UTT Billing Active</span>
                        </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-6 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-blue-400 mb-2">Weather Dashboard</h3>
                            <p className="text-sm text-slate-400">
                                Real-time METAR & TAF data with multi-airport support and auto-refresh.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-indigo-400 mb-2">AI Nowcasting</h3>
                            <p className="text-sm text-slate-400">
                                30-minute predictive forecasts using ML models for GO/NO-GO decisions.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-purple-400 mb-2">Edge Fleet</h3>
                            <p className="text-sm text-slate-400">
                                LoRa gateway management with real-time telemetry and OTA updates.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">Analytics Platform</h3>
                            <p className="text-sm text-slate-400">
                                Performance metrics, traffic monitoring, and enterprise insights.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">UTT Billing</h3>
                            <p className="text-sm text-slate-400">
                                Usage-based monetization with real-time billing and cost optimization.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">Formula Calculator</h3>
                            <p className="text-sm text-slate-400">
                                Aviation calculations including fuel planning and navigation formulas.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-pink-400 mb-2">PDF Export</h3>
                            <p className="text-sm text-slate-400">
                                Professional reports with weather briefings and flight plans.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-orange-400 mb-2">Enterprise Plans</h3>
                            <p className="text-sm text-slate-400">
                                Tiered pricing with SLA agreements and dedicated support.
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-slate-500">
                        EuroWeb Ultra Aviation - Edge-to-Cloud Architecture | LoRa + Mesh + GPS + UTT + AI Nowcasting
                    </div>
                </div>
            </div>
        </div>
    )
}
