// components/AviationToolsSummary.tsx
// Aviation Tools Summary - Quick Overview of All Features
// Formula Calculator, PDF Tools, Weather, Analytics

'use client'

import { motion } from 'framer-motion'
import { BarChart3, Calculator, CreditCard, Download, FileText, Globe, Plane, Zap } from 'lucide-react'
import { useState } from 'react'

interface ToolCard {
    id: string
    name: string
    icon: any
    description: string
    features: string[]
    color: string
    bgGradient: string
}

const aviationTools: ToolCard[] = [
    {
        id: 'weather',
        name: 'Weather Dashboard',
        icon: Plane,
        description: 'Real-time aviation weather data for flight planning',
        features: [
            'METAR & TAF data from 15+ European airports',
            'Real-time updates every 2 minutes',
            'Multi-airport monitoring',
            'Favorites and search functionality',
            'Weather condition icons and alerts'
        ],
        color: 'blue',
        bgGradient: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'calculator',
        name: 'Formula Calculator',
        icon: Calculator,
        description: 'Professional aviation calculations and formulas',
        features: [
            'Fuel consumption and planning',
            'Navigation and distance calculations',
            'Weather computations (wind components, density altitude)',
            'Weight & balance calculations',
            'Great circle distance and ground speed'
        ],
        color: 'emerald',
        bgGradient: 'from-emerald-500 to-teal-500'
    },
    {
        id: 'pdf',
        name: 'PDF Export Tools',
        icon: FileText,
        description: 'Generate professional aviation reports',
        features: [
            'Weather briefing reports',
            'Flight plan documentation',
            'Calculations summary',
            'Custom report builder',
            'Professional formatting with headers/footers'
        ],
        color: 'purple',
        bgGradient: 'from-purple-500 to-pink-500'
    },
    {
        id: 'analytics',
        name: 'Analytics Platform',
        icon: BarChart3,
        description: 'Performance insights and data visualization',
        features: [
            'Traffic monitoring and trends',
            'Weather condition distribution',
            'API performance metrics',
            'Top airports ranking',
            'Real-time KPI dashboard'
        ],
        color: 'indigo',
        bgGradient: 'from-indigo-500 to-purple-500'
    },
    {
        id: 'pricing',
        name: 'Monetization',
        icon: CreditCard,
        description: 'Enterprise pricing and business model',
        features: [
            'Starter, Professional, Enterprise plans',
            'Custom solutions for large organizations',
            'SLA agreements and dedicated support',
            'Global airport coverage',
            '24/7 priority support'
        ],
        color: 'yellow',
        bgGradient: 'from-yellow-500 to-orange-500'
    }
]

export default function AviationToolsSummary() {
    const [hoveredTool, setHoveredTool] = useState<string | null>(null)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                        <Zap className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    EuroWeb Ultra Aviation Platform
                </h1>
                <p className="text-xl text-slate-300 mb-2">
                    Complete Aviation Weather & Planning Solution
                </p>
                <p className="text-sm text-slate-400 max-w-2xl mx-auto">
                    Professional-grade platform combining real-time weather data, advanced calculations,
                    PDF report generation, analytics, and enterprise monetization features.
                </p>
            </motion.div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {aviationTools.map((tool, index) => {
                    const Icon = tool.icon
                    const isHovered = hoveredTool === tool.id

                    return (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredTool(tool.id)}
                            onMouseLeave={() => setHoveredTool(null)}
                            className={`relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 p-8 transition-all duration-300 hover:scale-105 ${isHovered ? 'border-slate-500 shadow-2xl' : ''
                                }`}
                        >
                            {/* Icon Header */}
                            <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${tool.bgGradient} flex items-center justify-center`}>
                                <Icon className="w-8 h-8 text-white" />
                            </div>

                            {/* Content */}
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold mb-3">{tool.name}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{tool.description}</p>
                            </div>

                            {/* Features List */}
                            <div className="space-y-3">
                                {tool.features.map((feature, featureIndex) => (
                                    <motion.div
                                        key={featureIndex}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: isHovered ? 1 : 0.7, x: 0 }}
                                        transition={{ delay: featureIndex * 0.05 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tool.bgGradient} mt-2 flex-shrink-0`} />
                                        <span className="text-sm text-slate-300">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Hover Effect */}
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent rounded-3xl pointer-events-none"
                                />
                            )}
                        </motion.div>
                    )
                })}
            </div>

            {/* Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 p-8 mb-8"
            >
                <h2 className="text-2xl font-bold text-center mb-8">Platform Capabilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
                        <div className="text-sm text-slate-400">European Airports</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-400 mb-2">20+</div>
                        <div className="text-sm text-slate-400">Aviation Formulas</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-2">4</div>
                        <div className="text-sm text-slate-400">PDF Templates</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
                        <div className="text-sm text-slate-400">Enterprise Support</div>
                    </div>
                </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
            >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">Ready for Enterprise Deployment</h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Complete aviation platform with real-time weather data, professional calculations,
                        PDF report generation, and enterprise-grade analytics.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Demo Report
                        </button>
                        <button className="px-8 py-3 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            View Live Demo
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
