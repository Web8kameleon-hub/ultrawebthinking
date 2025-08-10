/**
 * EuroWeb Platform - Advanced Neural Dashboard
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';
import NeuralDashboard from './NeuralDashboard';
import FluidMonitor from './FluidMonitor';

// Tab interfaces
interface Tab {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType;
}

// Neural Dashboard Variants
const dashboardVariants = cva(
  "min-h-screen w-full relative overflow-hidden",
  {
    variants: {
      theme: {
        royal: "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900",
        cyber: "bg-gradient-to-br from-gray-900 via-purple-900 to-black",
        neural: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
      }
    },
    defaultVariants: {
      theme: "neural"
    }
  }
);

const cardVariants = cva(
  "backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-2xl",
  {
    variants: {
      glow: {
        purple: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30",
        blue: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30",
        green: "bg-green-500/10 hover:bg-green-500/20 border-green-500/30",
        orange: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30"
      }
    }
  }
);

interface SystemStats {
  cpu: number;
  memory: number;
  network: number;
  agiProcessing: number;
  connections: number;
  uptime: string;
}

interface NeuralMetrics {
  accuracy: number;
  learning_rate: number;
  tokens_processed: number;
  knowledge_base: number;
}

// Tab Components
const NeuralSearchTab = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-8">
      <h2 className="text-3xl font-bold text-white mb-6">🔍 Neural Search Engine</h2>
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Search the neural knowledge base..."
          className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-purple-500"
        />
        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
          🚀 Neural Search
        </button>
      </div>
    </div>
  </div>
);

const AGIAnalyticsTab = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 backdrop-blur-xl border border-blue-500/30 rounded-xl p-8">
      <h2 className="text-3xl font-bold text-white mb-6">📊 AGI Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-white font-bold mb-2">Real-time Processing</h3>
          <div className="text-green-400 text-2xl font-bold">98.7%</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-white font-bold mb-2">Neural Efficiency</h3>
          <div className="text-blue-400 text-2xl font-bold">99.2%</div>
        </div>
      </div>
    </div>
  </div>
);

const SecurityHubTab = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-xl border border-green-500/30 rounded-xl p-8">
      <h2 className="text-3xl font-bold text-white mb-6">🛡️ Guardian Security Hub</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-green-400 text-3xl mb-2">🔒</div>
          <h3 className="text-white font-bold">Secure</h3>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-green-400 text-3xl mb-2">🛡️</div>
          <h3 className="text-white font-bold">Protected</h3>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-green-400 text-3xl mb-2">⚡</div>
          <h3 className="text-white font-bold">Active</h3>
        </div>
      </div>
    </div>
  </div>
);

const OverviewTab = () => {
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    network: 0,
    agiProcessing: 0,
    connections: 0,
    uptime: "00:00:00"
  });

  const [neuralMetrics, setNeuralMetrics] = useState<NeuralMetrics>({
    accuracy: 0,
    learning_rate: 0,
    tokens_processed: 0,
    knowledge_base: 0
  });

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 1000),
        agiProcessing: Math.floor(Math.random() * 100),
        connections: Math.floor(Math.random() * 50),
        uptime: new Date().toLocaleTimeString()
      });

      setNeuralMetrics({
        accuracy: 95.7 + Math.random() * 4,
        learning_rate: 0.001 + Math.random() * 0.01,
        tokens_processed: Math.floor(Math.random() * 10000),
        knowledge_base: 98.2 + Math.random() * 1.8
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ title, value, unit, icon, glow }: {
    title: string;
    value: number | string;
    unit?: string;
    icon: string;
    glow: "purple" | "blue" | "green" | "orange";
  }) => (
    <motion.div
      className={`backdrop-blur-xl border rounded-xl p-6 shadow-2xl transition-all duration-300 ${
        glow === 'purple' ? 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50' :
        glow === 'blue' ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/50' :
        glow === 'green' ? 'bg-green-500/20 hover:bg-green-500/30 border-green-500/50' :
        'bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/50'
      }`}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white/70 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-white mt-1">
            {typeof value === 'number' ? value.toFixed(1) : value}
            {unit && <span className="text-lg text-white/60 ml-1">{unit}</span>}
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
      
      {typeof value === 'number' && value <= 100 && (
        <div className="mt-4 w-full bg-white/10 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${
              glow === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-400' :
              glow === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
              glow === 'green' ? 'bg-gradient-to-r from-green-500 to-green-400' : 
              'bg-gradient-to-r from-orange-500 to-orange-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="CPU Usage"
          value={systemStats.cpu}
          unit="%"
          icon="🧠"
          glow="purple"
        />
        <MetricCard
          title="Memory"
          value={systemStats.memory}
          unit="%"
          icon="💾"
          glow="blue"
        />
        <MetricCard
          title="Network"
          value={systemStats.network}
          unit="MB/s"
          icon="🌐"
          glow="green"
        />
        <MetricCard
          title="AGI Processing"
          value={systemStats.agiProcessing}
          unit="%"
          icon="⚡"
          glow="orange"
        />
      </div>

      {/* Neural Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="AI Accuracy"
          value={neuralMetrics.accuracy}
          unit="%"
          icon="🎯"
          glow="green"
        />
        <MetricCard
          title="Learning Rate"
          value={neuralMetrics.learning_rate}
          icon="📈"
          glow="blue"
        />
        <MetricCard
          title="Tokens/Min"
          value={neuralMetrics.tokens_processed}
          icon="🔤"
          glow="purple"
        />
        <MetricCard
          title="Knowledge Base"
          value={neuralMetrics.knowledge_base}
          unit="%"
          icon="📚"
          glow="orange"
        />
      </div>
    </div>
  );
};

export default function EuroWebDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isConnected, setIsConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Tab configuration
  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: '📊', component: OverviewTab },
    { id: 'search', label: 'Neural Search', icon: '🔍', component: NeuralSearchTab },
    { id: 'analytics', label: 'AGI Analytics', icon: '🧠', component: AGIAnalyticsTab },
    { id: 'security', label: 'Security Hub', icon: '🛡️', component: SecurityHubTab },
    { id: 'neural', label: 'Advanced Neural', icon: '🔬', component: NeuralDashboard },
    { id: 'fluid', label: 'Fluid Monitor', icon: '🌊', component: FluidMonitor }
  ];

  // Connection status simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component || OverviewTab;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Neural Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-white/5"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                delay: i * 0.01,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            🌐 EuroWeb AGI Platform
          </h1>
          <p className="text-xl text-white/70">
            Advanced Neural Processing Dashboard • v8.0.0 • {currentTime.toLocaleString()}
          </p>
          
          {/* Status Indicator */}
          <motion.div
            className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full ${
              isConnected 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            }`}
            animate={{
              scale: isConnected ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-white font-medium">
              {isConnected ? '🚀 Neural Systems Online' : '⚠️ Connecting...'}
            </span>
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-2 border border-white/20">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveTabComponent />
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          className="text-center mt-12 text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <p>🚀 EuroWeb Platform v8.0.0 | Created by Ledjan Ahmati | 🔒 Secure & Neural-Powered</p>
        </motion.div>
      </div>
    </div>
  );
}
