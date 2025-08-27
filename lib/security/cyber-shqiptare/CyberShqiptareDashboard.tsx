/**
 * 🇦🇱 Cyber Shqiptare Dashboard - Albanian Cybersecurity Interface
 * EuroWeb Ultra Security Suite - Cultural Intelligence Dashboard
 * 
 * @author GitHub Copilot & EuroWeb Ultra Team  
 * @version 1.0.0 - Cyber Albanian Initiative
 */

'use client';

import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Eye, Globe, Lock, Shield } from 'lucide-react';
import { useState } from 'react';

interface SecurityStats {
    totalKercenimet: number;
    aktivKercenimet: number;
    kritikKercenimet: number;
    ngjarjet24h: number;
}

interface ThreatDisplay {
    id: string;
    emri: string;
    tipi: string;
    rreziku: string;
    kontekstKultural: string;
    aktiv: boolean;
}

interface SecurityEvent {
    id: string;
    lloji: string;
    perrshkrimi: string;
    niveli: string;
    burimi: string;
    timestamp: number;
}

const CyberShqiptareDashboard = () => {
    const [stats, setStats] = useState<SecurityStats>({
        totalKercenimet: 15,
        aktivKercenimet: 8,
        kritikKercenimet: 3,
        ngjarjet24h: 12
    });

    const [threats, setThreats] = useState<ThreatDisplay[]>([
        {
            id: 'sq-phish-001',
            emri: 'Mashtrimi Bankar Shqiptar',
            tipi: 'phishing',
            rreziku: 'i_larte',
            kontekstKultural: 'Përdor emra bankash shqiptare dhe referenca kulturore',
            aktiv: true
        },
        {
            id: 'sq-social-001',
            emri: 'Inxhinieria Sociale Familjare',
            tipi: 'social_engineering',
            rreziku: 'mesatar',
            kontekstKultural: 'Eksploton lidhjet familjare dhe traditat shqiptare',
            aktiv: true
        },
        {
            id: 'sq-crypto-001',
            emri: 'Mashtrimet me Kriptovaluta ALB/UTT',
            tipi: 'phishing',
            rreziku: 'kritik',
            kontekstKultural: 'Synon investitorët shqiptarë në ALB/UTT tokens',
            aktiv: true
        }
    ]);

    const [events, setEvents] = useState<SecurityEvent[]>([
        {
            id: 'evt-001',
            lloji: 'Tentativë Phishing',
            perrshkrimi: 'Zbuluar email phishing me përmbajtje shqipe',
            niveli: 'rrezik',
            burimi: 'Email Gateway',
            timestamp: Date.now() - 300000
        },
        {
            id: 'evt-002',
            lloji: 'Sulm DDoS',
            perrshkrimi: 'Tentativë sulmi nga IP-të e huaja',
            niveli: 'paralajmërim',
            burimi: 'Firewall',
            timestamp: Date.now() - 600000
        }
    ]);

    const [isMonitoring, setIsMonitoring] = useState(true);

    const getRiskColor = (rreziku: string) => {
        switch (rreziku) {
            case 'kritik': return '#dc2626';
            case 'i_larte': return '#ea580c';
            case 'mesatar': return '#ca8a04';
            case 'i_ulet': return '#16a34a';
            default: return '#6b7280';
        }
    };

    const getLevelColor = (niveli: string) => {
        switch (niveli) {
            case 'emergjencë': return '#dc2626';
            case 'rrezik': return '#ea580c';
            case 'paralajmërim': return '#ca8a04';
            case 'info': return '#16a34a';
            default: return '#6b7280';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-6">
            {/* Header */}
            <div className="mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-4"
                >
                    <div className="flex items-center gap-2">
                        <Shield className="w-8 h-8 text-red-500" />
                        <span className="text-2xl">🇦🇱</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                            Cyber Shqiptare Dashboard
                        </h1>
                        <p className="text-gray-300">Siguria Kibernetike Shqiptare - EuroWeb Ultra</p>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4">
                    <motion.button
                        onClick={() => setIsMonitoring(!isMonitoring)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${isMonitoring
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Activity className="w-4 h-4" />
                        {isMonitoring ? 'Monitorimi Aktiv' : 'Monitorimi Inaktiv'}
                    </motion.button>

                    <div className="text-sm text-gray-400">
                        Përditësuar: {new Date().toLocaleString('sq-AL')}
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Kërcënime Totale', value: stats.totalKercenimet, icon: Shield, color: 'blue' },
                    { label: 'Kërcënime Aktive', value: stats.aktivKercenimet, icon: AlertTriangle, color: 'orange' },
                    { label: 'Kërcënime Kritike', value: stats.kritikKercenimet, icon: AlertTriangle, color: 'red' },
                    { label: 'Ngjarje 24h', value: stats.ngjarjet24h, icon: Activity, color: 'green' }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                            <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Threats Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Kërcënimet Kryesore
                    </h2>

                    <div className="space-y-4">
                        {threats.map((threat, index) => (
                            <motion.div
                                key={threat.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-700/50 rounded-lg p-4 border-l-4"
                                style={{ borderLeftColor: getRiskColor(threat.rreziku) }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">{threat.emri}</h3>
                                        <p className="text-sm text-gray-300 mt-1">{threat.kontekstKultural}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs px-2 py-1 rounded bg-gray-600 text-gray-200">
                                                {threat.tipi}
                                            </span>
                                            <span
                                                className="text-xs px-2 py-1 rounded font-semibold"
                                                style={{
                                                    backgroundColor: getRiskColor(threat.rreziku) + '20',
                                                    color: getRiskColor(threat.rreziku)
                                                }}
                                            >
                                                {threat.rreziku.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${threat.aktiv ? 'bg-green-500' : 'bg-red-500'}`} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Events Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-500" />
                        Ngjarjet e Fundit
                    </h2>

                    <div className="space-y-4">
                        {events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-700/50 rounded-lg p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-white">{event.lloji}</h3>
                                            <span
                                                className="text-xs px-2 py-1 rounded font-semibold"
                                                style={{
                                                    backgroundColor: getLevelColor(event.niveli) + '20',
                                                    color: getLevelColor(event.niveli)
                                                }}
                                            >
                                                {event.niveli.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-300">{event.perrshkrimi}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                            <span>Burimi: {event.burimi}</span>
                                            <span>{new Date(event.timestamp).toLocaleString('sq-AL')}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Status Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm text-gray-300">Mbrojtja Aktive</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-300">Inteligjenca Ballkanike</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-300">Enkriptim AES-256</span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">
                        🇦🇱 EuroWeb Ultra - Cyber Shqiptare v1.0.0
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CyberShqiptareDashboard;
