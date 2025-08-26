/**
 * EuroWeb Web8 Platform - Medical Engine Panel
 * Enhanced with framer-motion, CVA, and real-time metrics
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

// CVA Variants for Medical Panel
const medPanelVariants = cva(
    "rounded-lg border transition-all duration-300",
    {
        variants: {
            variant: {
                default: "bg-white border-gray-200 shadow-sm",
                industrial: "bg-slate-900 border-slate-700 shadow-xl",
                medical: "bg-emerald-50 border-emerald-200 shadow-lg",
                critical: "bg-red-50 border-red-300 shadow-lg"
            },
            size: {
                sm: "p-4",
                md: "p-6",
                lg: "p-8"
            }
        },
        defaultVariants: {
            variant: "industrial",
            size: "lg"
        }
    }
);

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "underline-offset-4 hover:underline text-primary",
                medical: "bg-emerald-600 text-white hover:bg-emerald-700",
                critical: "bg-red-600 text-white hover:bg-red-700"
            },
            size: {
                default: "h-10 py-2 px-4",
                sm: "h-9 px-3 rounded-md",
                lg: "h-11 px-8 rounded-md",
                icon: "h-10 w-10"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

// Types
interface MedicalStudy {
    id: string;
    patientName: string;
    timestamp: string;
    status: 'completed' | 'pending' | 'failed';
    severity: 'info' | 'low' | 'moderate' | 'high' | 'critical';
    confidence: number;
}

interface NodeMetrics {
    total: number;
    online: number;
    offline: number;
    degraded: number;
    lastUpdate: string;
}

interface MedEnginePanelProps extends VariantProps<typeof medPanelVariants> {
    className?: string;
}

export function MedEnginePanel({ variant, size, className }: MedEnginePanelProps) {
    const [studies, setStudies] = useState<MedicalStudy[]>([]);
    const [nodeMetrics, setNodeMetrics] = useState<NodeMetrics | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'studies' | 'metrics' | 'run'>('dashboard');

    // Fetch medical studies
    const fetchStudies = async () => {
        try {
            const response = await fetch('/api/med/studies');
            if (response.ok) {
                const data = await response.json();
                setStudies(data.studies || []);
            }
        } catch (error) {
            console.error('Failed to fetch studies:', error);
        }
    };

    // Fetch node metrics
    const fetchMetrics = async () => {
        try {
            const response = await fetch('/api/metrics/nodes');
            if (response.ok) {
                const data = await response.json();
                setNodeMetrics(data);
            }
        } catch (error) {
            console.error('Failed to fetch metrics:', error);
        }
    };

    // Run medical study
    const runStudy = async () => {
        setIsRunning(true);
        try {
            const testData = {
                patient: { id: 'TEST-001', name: 'Test Patient' },
                vitals: [
                    { name: 'HR', value: 95, ref: { low: 60, high: 90 } },
                    { name: 'BP_SYS', value: 140, ref: { low: 90, high: 120 } }
                ],
                requestedPanels: ['GENERAL']
            };

            const response = await fetch('/api/med/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Study completed:', result);
                fetchStudies(); // Refresh studies list
            }
        } catch (error) {
            console.error('Failed to run study:', error);
        } finally {
            setIsRunning(false);
        }
    };

    useEffect(() => {
        fetchStudies();
        fetchMetrics();

        // Refresh metrics every 10 seconds
        const interval = setInterval(fetchMetrics, 10000);
        return () => clearInterval(interval);
    }, []);

    const motionVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <div className={cn(medPanelVariants({ variant, size }), className)}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between mb-6"
            >
                <h2 className="text-2xl font-bold text-white">
                    🏥 SuperCrista Medicine Engine
                </h2>
                <div className="flex space-x-2">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 bg-green-500 rounded-full"
                    />
                    <span className="text-emerald-400 text-sm">Engine Active</span>
                </div>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6">
                {(['dashboard', 'studies', 'metrics', 'run'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            buttonVariants({ variant: activeTab === tab ? 'medical' : 'ghost', size: 'sm' }),
                            "capitalize"
                        )}
                    >
                        {tab === 'dashboard' && '📊'}
                        {tab === 'studies' && '📋'}
                        {tab === 'metrics' && '📈'}
                        {tab === 'run' && '🚀'} {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={motionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                                <h3 className="text-lg font-semibold text-white mb-3">System Status</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-300">Engine Status:</span>
                                        <span className="text-green-400">Active</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-300">Total Studies:</span>
                                        <span className="text-white">{studies.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-300">Online Nodes:</span>
                                        <span className="text-green-400">{nodeMetrics?.online || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                                <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={runStudy}
                                        disabled={isRunning}
                                        className={cn(
                                            buttonVariants({ variant: 'medical', size: 'sm' }),
                                            "w-full"
                                        )}
                                    >
                                        {isRunning ? '⏳ Running...' : '🚀 Run Test Study'}
                                    </button>
                                    <button
                                        onClick={fetchStudies}
                                        className={cn(
                                            buttonVariants({ variant: 'outline', size: 'sm' }),
                                            "w-full text-white border-slate-600 hover:bg-slate-700"
                                        )}
                                    >
                                        🔄 Refresh Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'studies' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Recent Studies</h3>
                            {studies.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    No studies found. Run a test study to see results.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {studies.slice(0, 5).map((study) => (
                                        <motion.div
                                            key={study.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-slate-800 p-4 rounded-lg border border-slate-600"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-white">{study.patientName}</h4>
                                                    <p className="text-sm text-slate-400">{study.timestamp}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={cn(
                                                        "px-2 py-1 rounded text-xs font-medium",
                                                        study.severity === 'critical' && "bg-red-600 text-white",
                                                        study.severity === 'high' && "bg-orange-600 text-white",
                                                        study.severity === 'moderate' && "bg-yellow-600 text-black",
                                                        study.severity === 'low' && "bg-blue-600 text-white",
                                                        study.severity === 'info' && "bg-gray-600 text-white"
                                                    )}>
                                                        {study.severity.toUpperCase()}
                                                    </span>
                                                    <div className="text-sm text-slate-400 mt-1">
                                                        {Math.round(study.confidence * 100)}% confidence
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'metrics' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white">Node Metrics</h3>
                            {nodeMetrics && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 text-center">
                                        <div className="text-2xl font-bold text-white">{nodeMetrics.total}</div>
                                        <div className="text-sm text-slate-400">Total Nodes</div>
                                    </div>
                                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 text-center">
                                        <div className="text-2xl font-bold text-green-400">{nodeMetrics.online}</div>
                                        <div className="text-sm text-slate-400">Online</div>
                                    </div>
                                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 text-center">
                                        <div className="text-2xl font-bold text-red-400">{nodeMetrics.offline}</div>
                                        <div className="text-sm text-slate-400">Offline</div>
                                    </div>
                                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 text-center">
                                        <div className="text-2xl font-bold text-yellow-400">{nodeMetrics.degraded}</div>
                                        <div className="text-sm text-slate-400">Degraded</div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                                <div className="text-sm text-slate-400">
                                    Last updated: {nodeMetrics?.lastUpdate || 'Never'}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'run' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white">Run Medical Analysis</h3>

                            <div className="bg-slate-800 p-6 rounded-lg border border-slate-600">
                                <h4 className="font-medium text-white mb-4">Test Configuration</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-300">Patient ID:</span>
                                        <span className="text-white">TEST-001</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-300">Analysis Panels:</span>
                                        <span className="text-white">GENERAL</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-300">Expected Duration:</span>
                                        <span className="text-white">~2 seconds</span>
                                    </div>
                                </div>

                                <motion.button
                                    onClick={runStudy}
                                    disabled={isRunning}
                                    className={cn(
                                        buttonVariants({ variant: 'medical', size: 'lg' }),
                                        "w-full mt-6"
                                    )}
                                    whileHover={{ scale: isRunning ? 1 : 1.02 }}
                                    whileTap={{ scale: isRunning ? 1 : 0.98 }}
                                >
                                    {isRunning ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                        />
                                    ) : (
                                        <span className="mr-2">🚀</span>
                                    )}
                                    {isRunning ? 'Running Analysis...' : 'Start Medical Analysis'}
                                </motion.button>
                            </div>

                            {isRunning && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-blue-900/50 p-4 rounded-lg border border-blue-600"
                                >
                                    <div className="flex items-center space-x-3">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
                                        />
                                        <div>
                                            <div className="text-blue-300 font-medium">Processing medical data...</div>
                                            <div className="text-blue-400 text-sm">Running GENERAL panel analysis</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default MedEnginePanel;
