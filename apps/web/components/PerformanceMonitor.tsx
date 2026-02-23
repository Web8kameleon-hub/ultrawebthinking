/**
 * Performance Monitor Component
 * Real-time performance tracking and optimization insights
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 1.0.0
 * @license MIT
 */

'use client'

import { apiCache } from '@/lib/ultra-cache'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

interface PerformanceMetrics {
    renderTime: number
    bundleSize: number
    memoryUsage: number
    cacheHitRate: number
    totalRequests: number
    errorRate: number
    loadTime: number
}

interface ComponentMetrics {
    name: string
    renderCount: number
    avgRenderTime: number
    lastRender: number
}

export default function PerformanceMonitor() {
    const [isVisible, setIsVisible] = useState(false)
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        renderTime: 0,
        bundleSize: 0,
        memoryUsage: 0,
        cacheHitRate: 0,
        totalRequests: 0,
        errorRate: 0,
        loadTime: 0
    })
    const [componentMetrics, setComponentMetrics] = useState<ComponentMetrics[]>([])

    // Calculate performance metrics
    const updateMetrics = useCallback(() => {
        const cacheStats = apiCache.getStats()
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

        setMetrics({
            renderTime: performance.now(),
            bundleSize: getBundleSize(),
            memoryUsage: getMemoryUsage(),
            cacheHitRate: cacheStats.hitRate,
            totalRequests: cacheStats.hits + cacheStats.misses,
            errorRate: calculateErrorRate(),
            loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0
        })
    }, [])

    // Get bundle size estimation
    const getBundleSize = (): number => {
        const scripts = Array.from(document.scripts)
        return scripts.reduce((total, script) => {
            if (script.src.includes('_next/static')) {
                return total + 1000 // Estimate 1KB per script (actual would need build analysis)
            }
            return total
        }, 0)
    }

    // Get memory usage (if available)
    const getMemoryUsage = (): number => {
        if ('memory' in performance) {
            const memory = (performance as any).memory
            return Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
        }
        return 0
    }

    // Calculate error rate
    const calculateErrorRate = (): number => {
        // This would track actual errors in a real implementation
        return Math.random() * 2 // Mock 0-2% error rate
    }

    // Track component render performance
    const trackComponentRender = useCallback((componentName: string, renderTime: number) => {
        setComponentMetrics(prev => {
            const existing = prev.find(c => c.name === componentName)
            if (existing) {
                return prev.map(c =>
                    c.name === componentName
                        ? {
                            ...c,
                            renderCount: c.renderCount + 1,
                            avgRenderTime: (c.avgRenderTime + renderTime) / 2,
                            lastRender: Date.now()
                        }
                        : c
                )
            }
            return [...prev, {
                name: componentName,
                renderCount: 1,
                avgRenderTime: renderTime,
                lastRender: Date.now()
            }]
        })
    }, [])

    // Update metrics periodically
    useEffect(() => {
        updateMetrics()
        const interval = setInterval(updateMetrics, 2000)
        return () => clearInterval(interval)
    }, [updateMetrics])

    // Keyboard shortcut to toggle monitor
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                setIsVisible(prev => !prev)
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [])

    const getPerformanceStatus = (value: number, type: string): 'good' | 'warning' | 'critical' => {
        switch (type) {
            case 'renderTime':
                return value < 100 ? 'good' : value < 300 ? 'warning' : 'critical'
            case 'memoryUsage':
                return value < 50 ? 'good' : value < 100 ? 'warning' : 'critical'
            case 'cacheHitRate':
                return value > 80 ? 'good' : value > 60 ? 'warning' : 'critical'
            case 'errorRate':
                return value < 1 ? 'good' : value < 3 ? 'warning' : 'critical'
            default:
                return 'good'
        }
    }

    const statusColors = {
        good: 'text-green-400 bg-green-900/20',
        warning: 'text-yellow-400 bg-yellow-900/20',
        critical: 'text-red-400 bg-red-900/20'
    }

    if (!isVisible) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsVisible(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-xs font-mono border border-slate-600"
                    title="Performance Monitor (Ctrl+Shift+P)"
                >
                    📊 Perf
                </button>
            </div>
        )
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="fixed top-4 right-4 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl p-4 z-50 text-white font-mono text-xs shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-blue-400">⚡ Performance Monitor</h3>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-slate-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Core Metrics */}
                <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-2">
                        <MetricCard
                            label="Render Time"
                            value={`${metrics.renderTime.toFixed(1)}ms`}
                            status={getPerformanceStatus(metrics.renderTime, 'renderTime')}
                        />
                        <MetricCard
                            label="Memory"
                            value={`${metrics.memoryUsage}MB`}
                            status={getPerformanceStatus(metrics.memoryUsage, 'memoryUsage')}
                        />
                        <MetricCard
                            label="Cache Hit"
                            value={`${metrics.cacheHitRate.toFixed(1)}%`}
                            status={getPerformanceStatus(metrics.cacheHitRate, 'cacheHitRate')}
                        />
                        <MetricCard
                            label="Error Rate"
                            value={`${metrics.errorRate.toFixed(1)}%`}
                            status={getPerformanceStatus(metrics.errorRate, 'errorRate')}
                        />
                    </div>
                </div>

                {/* Cache Statistics */}
                <div className="mb-4">
                    <h4 className="text-slate-300 mb-2">🗄️ Cache Stats</h4>
                    <div className="bg-slate-800/50 rounded p-2 space-y-1">
                        <div className="flex justify-between">
                            <span>Entries:</span>
                            <span className="text-blue-400">{apiCache.getStats().size}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Hits:</span>
                            <span className="text-green-400">{apiCache.getStats().hits}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Misses:</span>
                            <span className="text-red-400">{apiCache.getStats().misses}</span>
                        </div>
                    </div>
                </div>

                {/* Component Performance */}
                <div className="mb-4">
                    <h4 className="text-slate-300 mb-2">🧩 Component Performance</h4>
                    <div className="bg-slate-800/50 rounded p-2 max-h-32 overflow-y-auto">
                        {componentMetrics.length === 0 ? (
                            <div className="text-slate-500">No data yet...</div>
                        ) : (
                            componentMetrics.slice(0, 5).map(comp => (
                                <div key={comp.name} className="flex justify-between items-center py-1">
                                    <span className="truncate">{comp.name}</span>
                                    <div className="text-right">
                                        <div className="text-blue-400">{comp.avgRenderTime.toFixed(1)}ms</div>
                                        <div className="text-slate-500">×{comp.renderCount}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => apiCache.clear()}
                        className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-1 px-2 rounded text-xs"
                    >
                        Clear Cache
                    </button>
                    <button
                        onClick={updateMetrics}
                        className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-1 px-2 rounded text-xs"
                    >
                        Refresh
                    </button>
                </div>

                {/* Keyboard shortcut hint */}
                <div className="mt-2 text-slate-500 text-center">
                    Ctrl+Shift+P to toggle
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

interface MetricCardProps {
    label: string
    value: string
    status: 'good' | 'warning' | 'critical'
}

function MetricCard({ label, value, status }: MetricCardProps) {
    const statusColors = {
        good: 'text-green-400 bg-green-900/20 border-green-700',
        warning: 'text-yellow-400 bg-yellow-900/20 border-yellow-700',
        critical: 'text-red-400 bg-red-900/20 border-red-700'
    }

    return (
        <div className={`p-2 rounded border ${statusColors[status]}`}>
            <div className="text-slate-300">{label}</div>
            <div className="font-bold">{value}</div>
        </div>
    )
}
