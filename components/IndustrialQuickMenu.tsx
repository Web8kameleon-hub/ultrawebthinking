'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

interface QuickMenuItem {
    id: string
    title: string
    icon: string
    url: string
    category: 'core' | 'business' | 'tools' | 'system'
    description: string
}

const quickMenuItems: QuickMenuItem[] = [
    // Core AGI
    { id: 'dashboard', title: 'AGI Dashboard', icon: '🧠', url: '/', category: 'core', description: 'Central command center' },
    { id: 'agisheet', title: 'AGI Sheet', icon: '📊', url: '/agisheet', category: 'core', description: 'Excel + AI engine' },
    { id: 'openmind', title: 'OpenMind Chat', icon: '💬', url: '/openmind', category: 'core', description: 'AI conversation' },

    // Business
    { id: 'utt', title: 'UTT/Albion', icon: '🪙', url: '/utt', category: 'business', description: 'Solana token dashboard' },
    { id: 'aviation', title: 'Aviation Weather', icon: '🛩️', url: '/aviation', category: 'business', description: 'METAR/TAF data (Revenue)' },
    { id: 'medical', title: 'Medical Engine', icon: '🏥', url: '/medical', category: 'business', description: 'AI medical analysis' },

    // Tools & Analytics
    { id: 'mesh', title: 'EuroMesh Network', icon: '🕸️', url: '/mesh', category: 'tools', description: 'Distributed network' },
    { id: 'lora', title: 'LoRa Gateway', icon: '📡', url: '/lora', category: 'tools', description: 'IoT connectivity' },
    { id: 'eco', title: 'Eco Analysis', icon: '🌱', url: '/eco', category: 'tools', description: 'Environmental AI' },

    // System
    { id: 'status', title: 'System Status', icon: '⚡', url: '/status', category: 'system', description: 'Health monitoring' },
    { id: 'intelligence', title: 'Intelligence', icon: '🔍', url: '/intelligence', category: 'system', description: 'Search & analysis' },
    { id: 'translator', title: 'Universal Translator', icon: '🌍', url: '/translator', category: 'system', description: 'Multi-language AI' }
]

const categoryConfig = {
    core: { color: '#8b5cf6', label: 'AGI Core' },
    business: { color: '#10b981', label: 'Business' },
    tools: { color: '#f59e0b', label: 'Tools' },
    system: { color: '#ef4444', label: 'System' }
}

export default function IndustrialQuickMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState<keyof typeof categoryConfig | null>(null)

    const filteredItems = activeCategory
        ? quickMenuItems.filter(item => item.category === activeCategory)
        : quickMenuItems

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Main FAB Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xl hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    background: isOpen
                        ? 'linear-gradient(45deg, #ef4444, #f59e0b)'
                        : 'linear-gradient(45deg, #8b5cf6, #3b82f6)'
                }}
            >
                <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isOpen ? '✕' : '⚡'}
                </motion.span>
            </motion.button>

            {/* Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute bottom-20 right-0 w-96 max-h-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-slate-700">
                                <h3 className="text-lg font-bold text-white mb-2">🚀 Web8 Industrial Menu</h3>

                                {/* Category Filter */}
                                <div className="flex gap-1 flex-wrap">
                                    <button
                                        onClick={() => setActiveCategory(null)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${!activeCategory
                                                ? 'bg-white text-slate-900'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {Object.entries(categoryConfig).map(([key, config]) => (
                                        <button
                                            key={key}
                                            onClick={() => setActiveCategory(key as keyof typeof categoryConfig)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeCategory === key
                                                    ? 'text-white'
                                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                }`}
                                            style={{
                                                backgroundColor: activeCategory === key ? config.color : undefined
                                            }}
                                        >
                                            {config.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="max-h-64 overflow-y-auto">
                                {filteredItems.map((item) => (
                                    <motion.a
                                        key={item.id}
                                        href={item.url}
                                        className="flex items-center gap-3 p-3 hover:bg-slate-800/50 transition-colors border-b border-slate-800/30 last:border-b-0"
                                        whileHover={{ x: 4 }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                                            style={{
                                                backgroundColor: `${categoryConfig[item.category].color}20`,
                                                color: categoryConfig[item.category].color
                                            }}
                                        >
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-medium truncate">{item.title}</div>
                                            <div className="text-slate-400 text-xs truncate">{item.description}</div>
                                        </div>
                                        <div className="text-slate-500 text-xs">
                                            {categoryConfig[item.category].label}
                                        </div>
                                    </motion.a>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-3 bg-slate-800/50 border-t border-slate-700">
                                <div className="text-center text-slate-400 text-xs">
                                    <span className="font-mono">Web8 Industrial Platform</span>
                                    <span className="mx-2">•</span>
                                    <span>{filteredItems.length} modules available</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
