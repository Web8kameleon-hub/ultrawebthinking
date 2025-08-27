'use client'

import {
    ArrowDownTrayIcon,
    BoltIcon,
    ChartBarIcon,
    CloudIcon,
    CogIcon,
    CpuChipIcon,
    CurrencyDollarIcon,
    GlobeAltIcon,
    HeartIcon,
    LockClosedIcon,
    MagnifyingGlassIcon,
    ServerIcon,
    ShieldCheckIcon,
    SpeakerWaveIcon,
    WifiIcon,
    WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

interface SystemModule {
    id: string
    name: string
    description: string
    icon: React.ComponentType<any>
    color: string
    apiEndpoint?: string
    status: 'active' | 'inactive' | 'maintenance'
    count?: number
}

interface SearchResult {
    title: string
    url: string
    snippet: string
}

const EuroWebControlPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState('search')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [systemStatus, setSystemStatus] = useState<Record<string, any>>({})

    const systemModules: SystemModule[] = [
        {
            id: 'search',
            name: 'Web Search',
            description: 'Global Web Search Engine',
            icon: MagnifyingGlassIcon,
            color: 'bg-blue-500',
            apiEndpoint: '/api/search',
            status: 'active'
        },
        {
            id: 'agi',
            name: 'AGI Core',
            description: 'Artificial General Intelligence',
            icon: CpuChipIcon,
            color: 'bg-purple-500',
            apiEndpoint: '/api/agi',
            status: 'active'
        },
        {
            id: 'ddos',
            name: 'DDoS Protection',
            description: 'Distributed Denial of Service Defense',
            icon: ShieldCheckIcon,
            color: 'bg-red-500',
            apiEndpoint: '/api/ddos',
            status: 'active'
        },
        {
            id: 'echo',
            name: 'Echo Services',
            description: 'Communication Echo Systems',
            icon: SpeakerWaveIcon,
            color: 'bg-green-500',
            apiEndpoint: '/api/echo',
            status: 'active'
        },
        {
            id: 'ingest',
            name: 'Data Ingestion',
            description: 'Real-time Data Processing',
            icon: ArrowDownTrayIcon,
            color: 'bg-yellow-500',
            apiEndpoint: '/api/ingest',
            status: 'active'
        },
        {
            id: 'lora',
            name: 'LoRa Network',
            description: 'Long Range Radio Network',
            icon: WifiIcon,
            color: 'bg-indigo-500',
            apiEndpoint: '/api/lora',
            status: 'active'
        },
        {
            id: 'med',
            name: 'Medical Systems',
            description: 'Healthcare Management Platform',
            icon: HeartIcon,
            color: 'bg-pink-500',
            apiEndpoint: '/api/med',
            status: 'active'
        },
        {
            id: 'services',
            name: 'Core Services',
            description: 'Essential System Services',
            icon: CogIcon,
            color: 'bg-gray-500',
            apiEndpoint: '/api/services',
            status: 'active'
        },
        {
            id: 'utils',
            name: 'Utilities',
            description: 'System Utility Functions',
            icon: WrenchScrewdriverIcon,
            color: 'bg-orange-500',
            apiEndpoint: '/api/utils',
            status: 'active'
        },
        {
            id: 'utt',
            name: 'UTT Token System',
            description: 'Ultra Transfer Token Network',
            icon: CurrencyDollarIcon,
            color: 'bg-emerald-500',
            apiEndpoint: '/api/utt',
            status: 'active'
        },
        {
            id: 'security',
            name: 'Mirror Defense',
            description: 'Advanced Security Protection',
            icon: LockClosedIcon,
            color: 'bg-slate-500',
            apiEndpoint: '/api/security',
            status: 'active'
        },
        {
            id: 'metrics',
            name: 'System Metrics',
            description: 'Performance Analytics',
            icon: ChartBarIcon,
            color: 'bg-cyan-500',
            apiEndpoint: '/api/metrics',
            status: 'active'
        },
        {
            id: 'aviation',
            name: 'Aviation APIs',
            description: 'Flight & Weather Data',
            icon: CloudIcon,
            color: 'bg-sky-500',
            apiEndpoint: '/api/aviation',
            status: 'active'
        },
        {
            id: 'mesh',
            name: 'Mesh Network',
            description: 'Distributed Network Topology',
            icon: ServerIcon,
            color: 'bg-violet-500',
            apiEndpoint: '/api/mesh',
            status: 'active'
        },
        {
            id: 'edge',
            name: 'Edge Computing',
            description: 'Distributed Edge Gateways',
            icon: BoltIcon,
            color: 'bg-amber-500',
            apiEndpoint: '/api/edge',
            status: 'active'
        },
        {
            id: 'billing',
            name: 'Billing System',
            description: 'Usage & Payment Processing',
            icon: GlobeAltIcon,
            color: 'bg-teal-500',
            apiEndpoint: '/api/billing',
            status: 'active'
        }
    ]

    // Web Search Function
    const performSearch = async () => {
        if (!searchQuery.trim()) return

        setIsSearching(true)
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&count=10`)
            const data = await response.json()

            if (data.results) {
                setSearchResults(data.results)
            }
        } catch (error) {
            console.error('Search error:', error)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }

    // System Status Check
    useEffect(() => {
        const checkSystemStatus = async () => {
            try {
                const response = await fetch('/api/health')
                const data = await response.json()
                setSystemStatus(data)
            } catch (error) {
                console.error('Health check error:', error)
            }
        }

        checkSystemStatus()
        const interval = setInterval(checkSystemStatus, 30000) // Check every 30s
        return () => clearInterval(interval)
    }, [])

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            performSearch()
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-400'
            case 'inactive': return 'text-red-400'
            case 'maintenance': return 'text-yellow-400'
            default: return 'text-gray-400'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Header */}
            <div className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        🌐 EuroWeb Control Panel
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Unified Control Center • {systemModules.length} Systems Active • React 18 + Next.js 14 + TypeScript
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* System Modules Menu */}
                    <div className="lg:col-span-1">
                        <h2 className="text-xl font-semibold mb-4 text-gray-300">System Modules</h2>
                        <div className="space-y-2">
                            {systemModules.map((module) => {
                                const IconComponent = module.icon
                                return (
                                    <motion.button
                                        key={module.id}
                                        onClick={() => setActiveTab(module.id)}
                                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${activeTab === module.id
                                            ? 'bg-white/10 border border-blue-500/50'
                                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg ${module.color}`}>
                                                <IconComponent className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm">{module.name}</div>
                                                <div className="text-xs text-gray-400 truncate">{module.description}</div>
                                            </div>
                                            <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status)}`} />
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {activeTab === 'search' ? (
                                <motion.div
                                    key="search"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white/5 rounded-xl border border-gray-800 p-6"
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <MagnifyingGlassIcon className="w-8 h-8 text-blue-400" />
                                        <h2 className="text-2xl font-bold">Global Web Search</h2>
                                    </div>

                                    {/* Search Input */}
                                    <div className="relative mb-6">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Search the web..."
                                            className="w-full px-4 py-3 bg-black/20 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={performSearch}
                                            disabled={isSearching}
                                            className="absolute right-2 top-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-md transition-colors"
                                        >
                                            {isSearching ? 'Searching...' : 'Search'}
                                        </button>
                                    </div>

                                    {/* Search Results */}
                                    <div className="space-y-4">
                                        {searchResults.length > 0 ? (
                                            searchResults.map((result, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="p-4 bg-black/20 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                                                >
                                                    <h3 className="font-semibold text-blue-400 hover:text-blue-300 cursor-pointer">
                                                        <a href={result.url} target="_blank" rel="noopener noreferrer">
                                                            {result.title}
                                                        </a>
                                                    </h3>
                                                    <p className="text-green-400 text-sm mt-1">{result.url}</p>
                                                    <p className="text-gray-300 mt-2">{result.snippet}</p>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-gray-400">
                                                <MagnifyingGlassIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                                <p>Enter a search query to begin</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white/5 rounded-xl border border-gray-800 p-6"
                                >
                                    {(() => {
                                        const module = systemModules.find(m => m.id === activeTab)
                                        if (!module) return null

                                        const IconComponent = module.icon

                                        return (
                                            <div>
                                                <div className="flex items-center space-x-3 mb-6">
                                                    <div className={`p-3 rounded-lg ${module.color}`}>
                                                        <IconComponent className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-bold">{module.name}</h2>
                                                        <p className="text-gray-400">{module.description}</p>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(module.status)} border border-current`}>
                                                            {module.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* System Details */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                    <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
                                                        <h3 className="font-semibold text-gray-300 mb-2">API Endpoint</h3>
                                                        <code className="text-blue-400 text-sm">{module.apiEndpoint || 'N/A'}</code>
                                                    </div>
                                                    <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
                                                        <h3 className="font-semibold text-gray-300 mb-2">Status</h3>
                                                        <div className={`font-medium ${getStatusColor(module.status)}`}>
                                                            {module.status === 'active' ? '🟢 Operational' :
                                                                module.status === 'maintenance' ? '🟡 Maintenance' : '🔴 Offline'}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Coming Soon Message */}
                                                <div className="text-center py-12 text-gray-400">
                                                    <IconComponent className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                                    <p className="text-xl font-semibold mb-2">{module.name} Dashboard</p>
                                                    <p>Advanced control interface coming soon...</p>
                                                </div>
                                            </div>
                                        )
                                    })()}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EuroWebControlPanel
