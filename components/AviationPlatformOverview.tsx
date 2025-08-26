'use client'

import { motion } from 'framer-motion'
import {
    Activity,
    Antenna,
    ArrowRight,
    BarChart3,
    Brain,
    Calculator,
    CheckCircle,
    CreditCard,
    DollarSign,
    FileText,
    Globe,
    Plane,
    Shield,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react'

interface ToolCard {
    title: string
    description: string
    icon: any
    color: string
    features: string[]
    status: 'active' | 'beta' | 'coming-soon'
}

export default function AviationPlatformOverview() {
    const tools: ToolCard[] = [
        {
            title: "Weather Dashboard",
            description: "Real-time METAR & TAF data with multi-airport support",
            icon: Plane,
            color: "from-blue-500 to-cyan-500",
            features: ["Live METAR/TAF", "Multi-airport", "Auto-refresh", "Favorites"],
            status: "active"
        },
        {
            title: "AI Nowcasting",
            description: "Predictive 30-minute forecasts using ML models",
            icon: Brain,
            color: "from-indigo-500 to-purple-500",
            features: ["GO/NO-GO decisions", "94.2% accuracy", "Wind shear alerts", "CB detection"],
            status: "active"
        },
        {
            title: "Edge Fleet",
            description: "LoRa gateway management with real-time telemetry",
            icon: Antenna,
            color: "from-purple-500 to-pink-500",
            features: ["Fleet monitoring", "OTA updates", "Geofencing", "Battery tracking"],
            status: "active"
        },
        {
            title: "Analytics Platform",
            description: "Performance metrics and enterprise insights",
            icon: BarChart3,
            color: "from-cyan-500 to-blue-500",
            features: ["Traffic monitoring", "Weather charts", "KPI tracking", "Custom reports"],
            status: "active"
        },
        {
            title: "UTT Billing",
            description: "Usage-based monetization with real-time charging",
            icon: DollarSign,
            color: "from-yellow-500 to-orange-500",
            features: ["Tiered pricing", "Real-time billing", "Cost optimization", "Usage analytics"],
            status: "active"
        },
        {
            title: "Formula Calculator",
            description: "Professional aviation calculations and formulas",
            icon: Calculator,
            color: "from-emerald-500 to-teal-500",
            features: ["Fuel planning", "Navigation", "Weight & balance", "Weather math"],
            status: "active"
        },
        {
            title: "PDF Export",
            description: "Professional report generation and export",
            icon: FileText,
            color: "from-pink-500 to-red-500",
            features: ["Weather briefings", "Flight plans", "Custom reports", "Enterprise format"],
            status: "active"
        },
        {
            title: "Enterprise Plans",
            description: "Tiered pricing with SLA agreements",
            icon: CreditCard,
            color: "from-orange-500 to-red-500",
            features: ["Starter to Enterprise", "SLA guarantees", "24/7 support", "White-label"],
            status: "active"
        }
    ]

    const platformStats = [
        { label: "Active Tools", value: "8", icon: Activity, color: "text-emerald-400" },
        { label: "API Endpoints", value: "25+", icon: Globe, color: "text-blue-400" },
        { label: "Prediction Accuracy", value: "94.2%", icon: Brain, color: "text-purple-400" },
        { label: "System Uptime", value: "99.2%", icon: Shield, color: "text-emerald-400" },
        { label: "Edge Coverage", value: "850 km²", icon: Antenna, color: "text-indigo-400" },
        { label: "Enterprise Clients", value: "50+", icon: Users, color: "text-yellow-400" }
    ]

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Active</span>
            case 'beta':
                return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Beta</span>
            case 'coming-soon':
                return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Coming Soon</span>
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">EuroWeb Ultra Aviation</h1>
                            <p className="text-xl text-blue-200">Edge-to-Cloud Industrial Aviation Platform</p>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <p className="text-lg text-slate-300 mb-8">
                            Complete aviation weather intelligence platform combining real-time data, AI predictions,
                            edge computing, and enterprise-grade monetization. From LoRa gateways to cloud analytics,
                            we deliver mission-critical weather intelligence for modern aviation operations.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle className="w-5 h-5" />
                                <span>Edge + Cloud Architecture</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-400">
                                <CheckCircle className="w-5 h-5" />
                                <span>AI Nowcasting</span>
                            </div>
                            <div className="flex items-center gap-2 text-purple-400">
                                <CheckCircle className="w-5 h-5" />
                                <span>UTT Billing</span>
                            </div>
                            <div className="flex items-center gap-2 text-yellow-400">
                                <CheckCircle className="w-5 h-5" />
                                <span>Enterprise SLA</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Platform Statistics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Platform Performance</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {platformStats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6 text-center"
                            >
                                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                                <div className="text-sm text-slate-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Tools Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Platform Tools & Capabilities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tools.map((tool, index) => (
                            <motion.div
                                key={tool.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.5 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center`}>
                                        <tool.icon className="w-6 h-6 text-white" />
                                    </div>
                                    {getStatusBadge(tool.status)}
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                                <p className="text-sm text-slate-400 mb-4">{tool.description}</p>

                                <div className="space-y-2">
                                    {tool.features.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="flex items-center gap-2 text-xs text-slate-300">
                                            <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Architecture Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Edge-to-Cloud Architecture</h2>
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Antenna className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Edge Layer</h3>
                                <p className="text-sm text-slate-400 mb-3">
                                    LoRa gateways with GPS, mesh networking, and local sensors
                                </p>
                                <div className="space-y-1 text-xs text-slate-500">
                                    <div>• Real-time data collection</div>
                                    <div>• Geofencing & drift detection</div>
                                    <div>• Store-and-forward</div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Globe className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Core API</h3>
                                <p className="text-sm text-slate-400 mb-3">
                                    Next.js API with enterprise authentication and rate limiting
                                </p>
                                <div className="space-y-1 text-xs text-slate-500">
                                    <div>• JWT + HMAC security</div>
                                    <div>• UTT billing integration</div>
                                    <div>• Real-time WebSocket</div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Brain className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">AI Engine</h3>
                                <p className="text-sm text-slate-400 mb-3">
                                    ML models for predictive nowcasting and anomaly detection
                                </p>
                                <div className="space-y-1 text-xs text-slate-500">
                                    <div>• RandomForest + GBDT</div>
                                    <div>• 30-min predictions</div>
                                    <div>• 94.2% accuracy</div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Enterprise</h3>
                                <p className="text-sm text-slate-400 mb-3">
                                    White-label solutions with SLA guarantees and 24/7 support
                                </p>
                                <div className="space-y-1 text-xs text-slate-500">
                                    <div>• Custom branding</div>
                                    <div>• On-premise deployment</div>
                                    <div>• Dedicated infrastructure</div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="flex items-center justify-center mt-8 gap-4">
                            <ArrowRight className="w-5 h-5 text-slate-500" />
                            <ArrowRight className="w-5 h-5 text-slate-500" />
                            <ArrowRight className="w-5 h-5 text-slate-500" />
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Ready to Explore?</h2>
                    <p className="text-slate-400 mb-8">
                        Navigate through the platform using the tabs above to explore each tool and capability.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span>Real-time data processing</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span>Enterprise security</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Activity className="w-4 h-4 text-purple-400" />
                            <span>99.2% uptime SLA</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
