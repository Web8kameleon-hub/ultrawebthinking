/**
 * Web8TabSystem - Modern Advanced Tab-Based UI/UX System
 * EuroWeb Ultra Platform - Revolutionary Tab Management
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 10.0.0 Euro Web8
 * @license MIT
 * @modernized August 24, 2025
 */

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { memo, ReactNode, Suspense, useCallback, useEffect, useMemo, useState } from 'react'

// Modern dynamic imports with improved error handling
import dynamic from 'next/dynamic'

// Enhanced loading component with better UX
const ModernTabLoader = memo(({ name, progress = 0 }: { name: string; progress?: number }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl">
        <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse" />
            <div
                className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
                style={{ animationDuration: '1s' }}
            />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Loading {name}</h3>
        <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(progress, 20)}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>
        <p className="text-slate-400 mt-3 text-sm">Initializing advanced components...</p>
    </div>
))

// Error fallback component
const ErrorFallback = memo(({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-xl border border-red-500/30">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-red-400 mb-2">Component Error</h3>
        <p className="text-red-300 mb-4 text-center max-w-md">{error.message}</p>
        <button
            onClick={resetErrorBoundary}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
            Try Again
        </button>
    </div>
))

// Simple ErrorBoundary component
class SimpleErrorBoundary extends React.Component<
    { children: ReactNode; fallback?: (error: Error, resetErrorBoundary: () => void) => ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: any) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, () => this.setState({ hasError: false, error: null }))
            }
            return <ErrorFallback error={this.state.error} resetErrorBoundary={() => this.setState({ hasError: false, error: null })} />
        }

        return this.props.children
    }
}

// Modern lazy loading with enhanced performance
const createAsyncComponent = (importFn: () => Promise<any>, name: string) =>
    dynamic(importFn, {
        loading: () => <ModernTabLoader name={name} />,
        ssr: false, // Client-side only for better performance
    })

// Lazy load all components with modern patterns
const AGIExcelEngine = createAsyncComponent(
    () => import('@/agi-office/AGIExcelEngine'),
    'AGI Excel Engine'
)

const AviationWeatherDashboard = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">✈️</div>
                    <h1 className="text-3xl font-bold text-white mb-4">Aviation Weather Dashboard</h1>
                    <p className="text-slate-400 mb-8">SAT + METAR/TAF + NWP → Airport Forecasts</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-blue-400 mb-4">Aviation Weather</h3>
                        <p className="text-slate-300">Advanced aviation weather forecasting and monitoring system.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'Aviation Weather'
)

// Create fallback components for missing modules
const AGIMedicalEngineUltra = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">🏥</div>
                    <h1 className="text-3xl font-bold text-white mb-4">AGI Medical Engine Ultra</h1>
                    <p className="text-slate-400 mb-8">Advanced Healthcare Intelligence & Medical Analytics</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-blue-400 mb-4">Coming Soon</h3>
                        <p className="text-slate-300">Medical AI engine is being developed and will be available soon.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'AGI Medical Engine'
)

const LoRaPhysicalDashboard = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">🛰️</div>
                    <h1 className="text-3xl font-bold text-white mb-4">LoRa Physical Dashboard</h1>
                    <p className="text-slate-400 mb-8">IoT Integration for UTT-ALB Physical Token Management</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-green-400 mb-4">System Status</h3>
                        <p className="text-slate-300">LoRa network is operational and ready for physical token verification.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'LoRa Physical'
)

const StationLocationConfig = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">📍</div>
                    <h1 className="text-3xl font-bold text-white mb-4">Station Location Config</h1>
                    <p className="text-slate-400 mb-8">Configurable station locations and mesh networking</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-purple-400 mb-4">Location Services</h3>
                        <p className="text-slate-300">Configure and manage station locations for optimal network coverage.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'Location Config'
)

// Enhanced AGI Modules with modern loading
const AGIBioNature = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">🧬</div>
                    <h1 className="text-3xl font-bold text-white mb-4">AGI BioNature</h1>
                    <p className="text-slate-400 mb-8">Biological Intelligence & Nature Analysis System</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-emerald-400 mb-4">Bio Intelligence</h3>
                        <p className="text-slate-300">Advanced biological analysis and nature intelligence systems.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'AGI BioNature'
)

// LoRa Connect Engine Ultra - Advanced LoRaWAN Management
const LoRaConnectEngineUltra = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">📡</div>
                    <h1 className="text-3xl font-bold text-white mb-4">LoRa Connect Engine Ultra</h1>
                    <p className="text-slate-400 mb-8">Long Range Communication Intelligence & LoRaWAN Management</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-green-400 mb-4">LoRa Systems</h3>
                        <p className="text-slate-300">Advanced LoRaWAN network management and communication systems.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'LoRa Connect Engine Ultra'
)

// AGI Core Engine Ultra - Master Intelligence System
const AGICoreEngineUltra = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">🧠</div>
                    <h1 className="text-3xl font-bold text-white mb-4">AGI Core Engine Ultra</h1>
                    <p className="text-slate-400 mb-8">Master Intelligence System - Central AGI Processing Core</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-purple-400 mb-4">Core Intelligence</h3>
                        <p className="text-slate-300">Central artificial general intelligence processing and coordination.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'AGI Core Engine Ultra'
)

// AGI Eco Engine Ultra - Advanced Ecological Intelligence
const AGIEcoEngineUltra = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">🌍</div>
                    <h1 className="text-3xl font-bold text-white mb-4">AGI Eco Engine Ultra</h1>
                    <p className="text-slate-400 mb-8">Advanced Ecological Intelligence & Environmental AI Systems</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-emerald-400 mb-4">Eco Intelligence</h3>
                        <p className="text-slate-300">Environmental AI and ecological monitoring systems.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'AGI Eco Engine Ultra'
)

// AGI Electrical Engine Ultra - Smart Electrical Systems
const AGIElectricalEngineUltra = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">⚡</div>
                    <h1 className="text-3xl font-bold text-white mb-4">AGI Electrical Engine Ultra</h1>
                    <p className="text-slate-400 mb-8">Smart Electrical Systems & Power Grid Intelligence</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-yellow-400 mb-4">Electrical Systems</h3>
                        <p className="text-slate-300">Intelligent electrical systems and power grid management.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'AGI Electrical Engine Ultra'
)

// EuroMesh Network Engine Ultra - Advanced Mesh Networking
const EuroMeshNetworkEngineUltra = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">🌐</div>
                    <h1 className="text-3xl font-bold text-white mb-4">EuroMesh Network Engine Ultra</h1>
                    <p className="text-slate-400 mb-8">Advanced Mesh Networking & Distributed Intelligence</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-cyan-400 mb-4">Mesh Networks</h3>
                        <p className="text-slate-300">Advanced European mesh networking and distributed systems.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'EuroMesh Network Engine Ultra'
)

const AGIEco = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">🌱</div>
                    <h1 className="text-3xl font-bold text-white mb-4">AGI Eco</h1>
                    <p className="text-slate-400 mb-8">Ecological Intelligence & Environmental Monitoring</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-green-400 mb-4">Eco Monitoring</h3>
                        <p className="text-slate-300">Environmental intelligence and ecological monitoring systems.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'AGI Eco'
)

// Modern office components
const AGISpreadsheetEngine = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">📋</div>
                    <h1 className="text-3xl font-bold text-white mb-4">AGI Spreadsheet Engine</h1>
                    <p className="text-slate-400 mb-8">Core Universal Spreadsheet Engine with AGI Integration</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-blue-400 mb-4">Excel-like System</h3>
                        <p className="text-slate-300">Universal spreadsheet engine with AI enhancement and automation.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'AGI Spreadsheet Engine'
)

// Communication & Network modules
const OpenMindChat = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">🧠</div>
                    <h1 className="text-3xl font-bold text-white mb-4">OpenMind Chat</h1>
                    <p className="text-slate-400 mb-8">Advanced AI Chat & Reasoning System</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-cyan-400 mb-4">AI Communication</h3>
                        <p className="text-slate-300">Advanced artificial intelligence chat and reasoning platform.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'OpenMind Chat'
)

const UniversalTranslator = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">🌍</div>
                    <h1 className="text-3xl font-bold text-white mb-4">Universal Translator</h1>
                    <p className="text-slate-400 mb-8">Real-time Universal Language Translation</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-indigo-400 mb-4">Language Translation</h3>
                        <p className="text-slate-300">Real-time translation for all major world languages.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'Universal Translator'
)

const EuroMeshDashboard = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">🕸️</div>
                    <h1 className="text-3xl font-bold text-white mb-4">EuroMesh Network</h1>
                    <p className="text-slate-400 mb-8">European Mesh Network Infrastructure - Advanced</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-pink-400 mb-4">Mesh Networking</h3>
                        <p className="text-slate-300">Advanced European mesh network infrastructure and management.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'EuroMesh Dashboard'
)

const UTTDashboard = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">🪙</div>
                    <h1 className="text-3xl font-bold text-white mb-4">UTT Dashboard</h1>
                    <p className="text-slate-400 mb-8">Universal Token Transfer Dashboard</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-yellow-400 mb-4">Token Management</h3>
                        <p className="text-slate-300">Universal token transfer and blockchain management system.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'UTT Dashboard'
)

const UltraQuantumDashboard = createAsyncComponent(
    () => Promise.resolve({
        default: () => (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">⚡</div>
                    <h1 className="text-3xl font-bold text-white mb-4">Ultra Quantum Dashboard</h1>
                    <p className="text-slate-400 mb-8">Quantum Computing Dashboard</p>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-purple-400 mb-4">Quantum Computing</h3>
                        <p className="text-slate-300">Advanced quantum computing interface and control systems.</p>
                    </div>
                </div>
            </div>
        )
    }),
    'Ultra Quantum Dashboard'
)

// Modern TypeScript interfaces with enhanced type safety
interface SystemMetrics {
    readonly totalTabs: number
    readonly activeSessions: number
    readonly memoryUsage: number
    readonly cpuUsage: number
    readonly networkLatency: number
    readonly lastUpdated: Date
}

interface TabData {
    readonly id: string
    readonly title: string
    readonly icon: string
    readonly component: ReactNode
    readonly category: 'system' | 'office' | 'medical' | 'aviation' | 'iot' | 'ai' | 'mesh' | 'bio' | 'eco' | 'translation' | 'blockchain'
    readonly priority: 'high' | 'medium' | 'low'
    readonly description: string
    readonly status: 'active' | 'inactive' | 'loading' | 'error'
    readonly notifications: number
    readonly lastAccessed: Date
    readonly memoryUsage?: number
    readonly loadTime?: number
}

interface TabSystemState {
    readonly tabs: readonly TabData[]
    readonly openTabs: readonly string[]
    readonly activeTab: string | null
    readonly systemMetrics: SystemMetrics
    readonly searchQuery: string
    readonly selectedCategory: string
    readonly isSearchMode: boolean
}

// Modern system overview component
const ModernSystemOverview = memo(() => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-8">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
        >
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    EuroWeb Platform
                </h1>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                    Professional Web Development Platform v9.1.0
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                {[
                    { icon: '👥', label: 'Total Users', value: '16.885', change: '+39 new today', color: 'from-blue-500 to-cyan-500' },
                    { icon: '🛠️', label: 'Active Modules', value: '14/14', change: 'All systems operational', color: 'from-green-500 to-emerald-500' },
                    { icon: '📊', label: 'Data Processed', value: '2.4 TB', change: '+88GB today', color: 'from-purple-500 to-pink-500' },
                    { icon: '⚡', label: 'System Uptime', value: '99.97%', change: '1331 days online', color: 'from-orange-500 to-red-500' }
                ].map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
                    >
                        <div className={`text-3xl mb-3 w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                            {metric.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">{metric.label}</h3>
                        <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                        <div className="text-sm text-slate-400">{metric.change}</div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">📋</span>
                    Module Status Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { name: 'AGI Office Suite', load: 87, status: 'optimal' },
                        { name: 'Aviation Weather', load: 72, status: 'good' },
                        { name: 'Medical Engine', load: 94, status: 'high' },
                        { name: 'LoRa Physical', load: 63, status: 'good' },
                        { name: 'Location Config', load: 45, status: 'optimal' },
                        { name: 'System Core', load: 58, status: 'optimal' }
                    ].map((module, index) => (
                        <motion.div
                            key={module.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-slate-700/30 rounded-xl p-4"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-white">{module.name}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs ${module.status === 'optimal' ? 'bg-green-500/20 text-green-400' :
                                    module.status === 'good' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-orange-500/20 text-orange-400'
                                    }`}>
                                    {module.status}
                                </span>
                            </div>
                            <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
                                <motion.div
                                    className={`h-2 rounded-full ${module.load > 90 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                                        module.load > 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                            'bg-gradient-to-r from-green-500 to-blue-500'
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${module.load}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                />
                            </div>
                            <div className="text-sm text-slate-400">Load: {module.load}%</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="text-center mt-12">
                <p className="text-slate-400">
                    EuroWeb Platform v9.1.0 | Professional Development Environment | Created by Ledjan Ahmati
                </p>
            </div>
        </motion.div>
    </div>
))

// Main modernized Web8TabSystem component
export default function ModernWeb8TabSystem() {
    // Modern state management with enhanced performance
    const [state, setState] = useState<TabSystemState>({
        tabs: [],
        openTabs: [],
        activeTab: null,
        systemMetrics: {
            totalTabs: 0,
            activeSessions: 0,
            memoryUsage: 0,
            cpuUsage: 0,
            networkLatency: 0,
            lastUpdated: new Date()
        },
        searchQuery: '',
        selectedCategory: 'all',
        isSearchMode: false
    })

    // Memoized tab definitions for better performance
    const initialTabs = useMemo((): readonly TabData[] => [
        {
            id: 'overview',
            title: 'System Overview',
            icon: '🎛️',
            component: <ModernSystemOverview />,
            category: 'system',
            priority: 'high',
            description: 'Modern platform dashboard with real-time metrics',
            status: 'active',
            notifications: 3,
            lastAccessed: new Date()
        },
        {
            id: 'agi-office',
            title: 'AGI Excel Engine',
            icon: '📊',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="AGI Excel Engine" />}>
                        <AGIExcelEngine />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'office',
            priority: 'high',
            description: 'Full featured Excel-like spreadsheet with formulas and AI',
            status: 'active',
            notifications: 12,
            lastAccessed: new Date(Date.now() - 300000)
        },
        {
            id: 'aviation',
            title: 'Aviation Weather',
            icon: '✈️',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="Aviation Weather" />}>
                        <AviationWeatherDashboard />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'aviation',
            priority: 'high',
            description: 'SAT + METAR/TAF + NWP → Airport Forecasts',
            status: 'active',
            notifications: 5,
            lastAccessed: new Date(Date.now() - 600000)
        },
        {
            id: 'medical',
            title: 'AGI Medical Engine Ultra',
            icon: '🏥',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="Medical Engine" />}>
                        <AGIMedicalEngineUltra />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'medical',
            priority: 'high',
            description: 'Advanced Healthcare Intelligence & Medical Analytics',
            status: 'active',
            notifications: 8,
            lastAccessed: new Date(Date.now() - 900000)
        },
        {
            id: 'lora-connect-ultra',
            title: 'LoRa Connect Engine Ultra',
            icon: '📡',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="LoRa Connect Engine Ultra" />}>
                        <LoRaConnectEngineUltra />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'iot',
            priority: 'high',
            description: 'Long Range Communication Intelligence & LoRaWAN Management',
            status: 'active',
            notifications: 15,
            lastAccessed: new Date(Date.now() - 180000)
        },
        {
            id: 'lora',
            title: 'LoRa Physical',
            icon: '🛰️',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="LoRa Physical" />}>
                        <LoRaPhysicalDashboard />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'iot',
            priority: 'medium',
            description: 'IoT Integration for UTT-ALB Physical Token Management',
            status: 'active',
            notifications: 2,
            lastAccessed: new Date(Date.now() - 1200000)
        },
        {
            id: 'location',
            title: 'Location Config',
            icon: '📍',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="Location Config" />}>
                        <StationLocationConfig />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'system',
            priority: 'medium',
            description: 'Configurable station locations and mesh networking',
            status: 'active',
            notifications: 0,
            lastAccessed: new Date(Date.now() - 1800000)
        },
        {
            id: 'agi-bio',
            title: 'AGI BioNature',
            icon: '🧬',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="AGI BioNature" />}>
                        <AGIBioNature />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'bio',
            priority: 'high',
            description: 'Biological Intelligence & Nature Analysis System',
            status: 'active',
            notifications: 6,
            lastAccessed: new Date(Date.now() - 2100000)
        },
        {
            id: 'agi-core-ultra',
            title: 'AGI Core Engine Ultra',
            icon: '🧠',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="AGI Core Engine Ultra" />}>
                        <AGICoreEngineUltra />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'ai',
            priority: 'high',
            description: 'Master Intelligence System - Central AGI Processing Core',
            status: 'active',
            notifications: 12,
            lastAccessed: new Date()
        },
        {
            id: 'agi-eco-ultra',
            title: 'AGI Eco Engine Ultra',
            icon: '🌍',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="AGI Eco Engine Ultra" />}>
                        <AGIEcoEngineUltra />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'eco',
            priority: 'high',
            description: 'Advanced Ecological Intelligence & Environmental AI Systems',
            status: 'active',
            notifications: 8,
            lastAccessed: new Date(Date.now() - 300000)
        },
        {
            id: 'agi-electrical-ultra',
            title: 'AGI Electrical Engine Ultra',
            icon: '⚡',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="AGI Electrical Engine Ultra" />}>
                        <AGIElectricalEngineUltra />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'system',
            priority: 'high',
            description: 'Smart Electrical Systems & Power Grid Intelligence',
            status: 'active',
            notifications: 5,
            lastAccessed: new Date(Date.now() - 600000)
        },
        {
            id: 'euromesh-ultra',
            title: 'EuroMesh Network Ultra',
            icon: '🌐',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="EuroMesh Network Ultra" />}>
                        <EuroMeshNetworkEngineUltra />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'mesh',
            priority: 'high',
            description: 'Advanced Mesh Networking & Distributed Intelligence',
            status: 'active',
            notifications: 15,
            lastAccessed: new Date(Date.now() - 900000)
        },
        {
            id: 'agi-eco',
            title: 'AGI Eco',
            icon: '🌱',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="AGI Eco" />}>
                        <AGIEco />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'eco',
            priority: 'high',
            description: 'Ecological Intelligence & Environmental Monitoring',
            status: 'active',
            notifications: 4,
            lastAccessed: new Date(Date.now() - 2400000)
        },
        {
            id: 'euromesh-network',
            title: 'EuroMesh Network',
            icon: '🕸️',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="EuroMesh Network" />}>
                        <EuroMeshDashboard />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'mesh',
            priority: 'high',
            description: 'European Mesh Network Infrastructure - Advanced',
            status: 'active',
            notifications: 12,
            lastAccessed: new Date(Date.now() - 3600000)
        },
        {
            id: 'agi-spreadsheet',
            title: 'AGI Spreadsheet Engine',
            icon: '📋',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="AGI Spreadsheet" />}>
                        <AGISpreadsheetEngine />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'office',
            priority: 'high',
            description: 'Core Universal Spreadsheet Engine with AGI Integration',
            status: 'active',
            notifications: 14,
            lastAccessed: new Date(Date.now() - 3900000)
        },
        {
            id: 'openmind',
            title: 'OpenMind',
            icon: '🧠',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="OpenMind" />}>
                        <OpenMindChat />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'ai',
            priority: 'high',
            description: 'Advanced AI Chat & Reasoning System',
            status: 'active',
            notifications: 21,
            lastAccessed: new Date(Date.now() - 4200000)
        },
        {
            id: 'universal-translator',
            title: 'Universal Translator',
            icon: '🌍',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="Universal Translator" />}>
                        <UniversalTranslator />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'translation',
            priority: 'high',
            description: 'Real-time Universal Language Translation',
            status: 'active',
            notifications: 5,
            lastAccessed: new Date(Date.now() - 4500000)
        },
        {
            id: 'utt-dashboard',
            title: 'UTT Dashboard',
            icon: '🪙',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="UTT Dashboard" />}>
                        <UTTDashboard />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'blockchain',
            priority: 'high',
            description: 'Universal Token Transfer Dashboard',
            status: 'active',
            notifications: 8,
            lastAccessed: new Date(Date.now() - 5100000)
        },
        {
            id: 'ultra-quantum',
            title: 'Ultra Quantum Dashboard',
            icon: '⚡',
            component: (
                <SimpleErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} resetErrorBoundary={reset} />}>
                    <Suspense fallback={<ModernTabLoader name="Quantum Dashboard" />}>
                        <UltraQuantumDashboard />
                    </Suspense>
                </SimpleErrorBoundary>
            ),
            category: 'system',
            priority: 'high',
            description: 'Quantum Computing Dashboard',
            status: 'active',
            notifications: 7,
            lastAccessed: new Date(Date.now() - 5700000)
        }
    ], [])

    // AI-Powered Search & Intelligent Recommendations System
    const [aiSearch, setAiSearch] = useState({
        query: '',
        suggestions: [] as string[],
        isAnalyzing: false,
        smartResults: [] as any[],
        context: 'general'
    })

    const [intelligentMode, setIntelligentMode] = useState(true)
    const [userBehavior, setUserBehavior] = useState({
        mostUsedTabs: ['overview', 'agi-core-ultra', 'lora-connect-ultra'],
        sessionTime: 0,
        clickPatterns: [] as string[],
        preferences: 'advanced'
    })

    // Advanced AI Search Function
    const performAISearch = useCallback(async (query: string) => {
        if (!query.trim()) {return}

        setAiSearch(prev => ({ ...prev, isAnalyzing: true, query }))

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 800))

        const suggestions = initialTabs
            .filter(tab =>
                tab.title.toLowerCase().includes(query.toLowerCase()) ??
                tab.description.toLowerCase().includes(query.toLowerCase()) ??
                tab.category.toLowerCase().includes(query.toLowerCase())
            )
            .map(tab => tab.id)

        const smartResults = suggestions.slice(0, 5).map(tabId => {
            const tab = initialTabs.find(t => t.id === tabId)!
            return {
                id: tab.id,
                title: tab.title,
                description: tab.description,
                relevance: Math.random() * 100,
                aiReason: `Matches your query: "${query}" - High relevance for ${tab.category} tasks`
            }
        })

        setAiSearch(prev => ({
            ...prev,
            suggestions,
            smartResults,
            isAnalyzing: false
        }))
    }, [initialTabs])

    // Intelligent Tab Recommendations
    const getIntelligentRecommendations = useCallback(() => {
        const currentTime = new Date().getHours()
        let recommendations: string[] = []

        if (currentTime >= 9 && currentTime <= 17) {
            // Work hours - recommend productivity tools
            recommendations = ['agi-core-ultra', 'agi-office', 'agi-electrical-ultra']
        } else {
            // After hours - recommend monitoring and analytics
            recommendations = ['overview', 'lora-connect-ultra', 'euromesh-ultra']
        }

        return recommendations.map(id => initialTabs.find(tab => tab.id === id)!).filter(Boolean)
    }, [initialTabs])

    // Initialize tabs on mount
    useEffect(() => {
        setState(prev => ({
            ...prev,
            tabs: initialTabs,
            openTabs: ['overview'],
            activeTab: 'overview'
        }))
    }, [initialTabs])

    // Enhanced metrics update with modern patterns
    useEffect(() => {
        const updateMetrics = () => {
            setState(prev => ({
                ...prev,
                systemMetrics: {
                    totalTabs: prev.tabs.length,
                    activeSessions: prev.openTabs.length,
                    memoryUsage: Math.round((60 + Math.sin(Date.now() / 10000) * 10) * 10) / 10,
                    cpuUsage: Math.round((20 + Math.cos(Date.now() / 8000) * 15) * 10) / 10,
                    networkLatency: Math.round((10 + Math.sin(Date.now() / 6000) * 5) * 10) / 10,
                    lastUpdated: new Date()
                }
            }))
        }

        const interval = setInterval(updateMetrics, 5000)
        updateMetrics() // Initial update

        return () => clearInterval(interval)
    }, [])

    // Modern tab management functions
    const openTab = useCallback((tabId: string) => {
        setState(prev => ({
            ...prev,
            openTabs: prev.openTabs.includes(tabId) ? prev.openTabs : [...prev.openTabs, tabId],
            activeTab: tabId
        }))
    }, [])

    const closeTab = useCallback((tabId: string) => {
        setState(prev => {
            const newOpenTabs = prev.openTabs.filter(id => id !== tabId)
            const newActiveTab = prev.activeTab === tabId
                ? (newOpenTabs.length > 0 ? newOpenTabs[newOpenTabs.length - 1] : null)
                : prev.activeTab

            return {
                ...prev,
                openTabs: newOpenTabs,
                activeTab: newActiveTab
            }
        })
    }, [])

    const setActiveTab = useCallback((tabId: string) => {
        setState(prev => ({ ...prev, activeTab: tabId }))
    }, [])

    // Filtered tabs based on search and category
    const filteredTabs = useMemo(() => {
        return state.tabs.filter(tab => {
            const matchesSearch = state.searchQuery === '' ??
                tab.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ??
                tab.description.toLowerCase().includes(state.searchQuery.toLowerCase())

            const matchesCategory = state.selectedCategory === 'all' ??
                tab.category === state.selectedCategory

            return matchesSearch && matchesCategory
        })
    }, [state.tabs, state.searchQuery, state.selectedCategory])

    // Get active tab data
    const activeTabData = useMemo(() =>
        state.tabs.find(tab => tab.id === state.activeTab),
        [state.tabs, state.activeTab]
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
            {/* Modern Header */}
            <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
                <div className="max-w-full px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            className="flex items-center gap-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                EuroWeb Platform
                            </h1>
                            <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
                                <span>Professional Development Platform</span>
                                <span>|</span>
                                <span>Version 9.1.0</span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex items-center gap-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search tabs..."
                                    value={state.searchQuery}
                                    onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                                    className="w-64 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                                />
                                <span className="absolute right-3 top-2.5 text-slate-400">🔍</span>
                            </div>

                            {/* System Metrics */}
                            <div className="hidden lg:flex items-center gap-6 text-sm">
                                {/* AI Intelligence Indicator */}
                                <motion.div
                                    className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30"
                                    animate={{
                                        boxShadow: intelligentMode
                                            ? ['0 0 20px rgba(147, 51, 234, 0.3)', '0 0 30px rgba(147, 51, 234, 0.6)', '0 0 20px rgba(147, 51, 234, 0.3)']
                                            : '0 0 0px rgba(147, 51, 234, 0)'
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <span className="text-purple-400">🧠</span>
                                    <span className="text-purple-300 font-semibold text-xs">AI Active</span>
                                    <div className={`w-2 h-2 rounded-full ${intelligentMode ? 'bg-green-400' : 'bg-gray-400'} animate-pulse`} />
                                </motion.div>

                                {/* AI Search Button */}
                                <motion.button
                                    onClick={() => setAiSearch(prev => ({ ...prev, query: '', suggestions: [] }))}
                                    className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="text-blue-400">🔍</span>
                                    <span className="text-blue-300 text-xs">AI Search</span>
                                </motion.button>

                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">Memory</span>
                                    <span className="text-blue-400 font-semibold">{state.systemMetrics.memoryUsage}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">CPU</span>
                                    <span className="text-green-400 font-semibold">{state.systemMetrics.cpuUsage}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">Network</span>
                                    <span className="text-purple-400 font-semibold">{state.systemMetrics.networkLatency}ms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">Sessions</span>
                                    <span className="text-orange-400 font-semibold">{state.systemMetrics.activeSessions}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            <div className="flex h-[calc(100vh-88px)]">
                {/* Ultra Thin Icon-Only Sidebar */}
                <motion.aside
                    className="w-12 bg-slate-800/30 backdrop-blur-xl border-r border-slate-700/50 overflow-y-auto hover:w-64 transition-all duration-300 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onWheel={(e) => {
                        e.currentTarget.scrollTop += e.deltaY;
                        e.preventDefault();
                    }}
                >
                    <div className="p-2 group-hover:p-4 transition-all duration-300">
                        {/* Header - hidden when thin, visible on hover */}
                        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span>📚</span>
                            <span className="hidden group-hover:block">Modules</span>
                        </h2>

                        {/* Category Filter - hidden when thin */}
                        <div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden group-hover:block">
                            <select
                                value={state.selectedCategory}
                                onChange={(e) => setState(prev => ({ ...prev, selectedCategory: e.target.value }))}
                                className="w-full px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="all">All Categories</option>
                                <option value="system">System</option>
                                <option value="office">Office</option>
                                <option value="medical">Medical</option>
                                <option value="aviation">Aviation</option>
                                <option value="iot">IoT</option>
                                <option value="ai">AI</option>
                                <option value="mesh">Mesh</option>
                                <option value="bio">Bio</option>
                                <option value="eco">Eco</option>
                                <option value="translation">Translation</option>
                                <option value="blockchain">Blockchain</option>
                            </select>
                        </div>

                        {/* Ultra Compact Tab List */}
                        <div className="space-y-1">{filteredTabs.map((tab, index) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => openTab(tab.id)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className={`w-full text-left group-hover:px-3 px-1 py-2 rounded border transition-all duration-150 relative ${state.openTabs.includes(tab.id)
                                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                                    : 'bg-slate-700/20 border-slate-600/30 hover:bg-slate-700/40 text-slate-300'
                                    }`}
                                title={`${tab.title} (${tab.priority} priority)`}
                            >
                                {/* Icon-only view (when thin) */}
                                <div className="flex items-center justify-center group-hover:hidden">
                                    <span className="text-lg">{tab.icon}</span>
                                    {tab.notifications > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                                            {tab.notifications > 9 ? '9+' : tab.notifications}
                                        </span>
                                    )}
                                </div>

                                {/* Full view (when hovered) */}
                                <div className="hidden group-hover:flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <span className="text-sm">{tab.icon}</span>
                                        <span className="font-medium text-xs truncate">{tab.title}</span>
                                    </div>
                                    <div className="flex items-center gap-1 ml-2">
                                        {tab.notifications > 0 && (
                                            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                {tab.notifications}
                                            </span>
                                        )}
                                        <span className={`w-2 h-2 rounded-full ${tab.priority === 'high' ? 'bg-red-400' :
                                            tab.priority === 'medium' ? 'bg-yellow-400' :
                                                'bg-green-400'
                                            }`}
                                            title={`${tab.priority} priority`}
                                        />
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                        </div>

                        {/* AI Recommendations Section */}
                        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden group-hover:block">
                            <div className="px-2 py-3 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30">
                                <h3 className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1">
                                    <span>🤖</span>
                                    AI Recommendations
                                </h3>
                                {getIntelligentRecommendations().slice(0, 3).map((tab) => (
                                    <motion.button
                                        key={`rec-${tab.id}`}
                                        onClick={() => openTab(tab.id)}
                                        className="w-full text-left p-2 rounded bg-slate-700/30 hover:bg-slate-600/50 transition-colors mb-1 last:mb-0"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs">{tab.icon}</span>
                                            <span className="text-xs text-slate-300 truncate">{tab.title}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 truncate">
                                            Suggested for current time
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* Main Content */}
                <main className="flex-1 overflow-hidden">
                    {/* Tab Bar */}
                    {state.openTabs.length > 0 && (
                        <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 px-6 py-2">
                            <div className="flex items-center gap-2 overflow-x-auto">
                                {state.openTabs.map((tabId) => {
                                    const tab = state.tabs.find(t => t.id === tabId)
                                    if (!tab) {return null}

                                    return (
                                        <motion.div
                                            key={tabId}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${state.activeTab === tabId
                                                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                                                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70'
                                                }`}
                                            onClick={() => setActiveTab(tabId)}
                                        >
                                            <span>{tab.icon}</span>
                                            <span className="whitespace-nowrap">{tab.title}</span>
                                            {tab.notifications > 0 && (
                                                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                                    {tab.notifications}
                                                </span>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    closeTab(tabId)
                                                }}
                                                className="ml-2 text-slate-400 hover:text-red-400 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="h-full overflow-auto">
                        <AnimatePresence mode="wait">
                            {activeTabData ? (
                                <motion.div
                                    key={activeTabData.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full"
                                >
                                    {activeTabData.component}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex items-center justify-center text-slate-400"
                                >
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">�</div>
                                        <h3 className="text-xl mb-2">Welcome to EuroWeb Platform</h3>
                                        <p>Select a module from the sidebar to get started</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    )
}
