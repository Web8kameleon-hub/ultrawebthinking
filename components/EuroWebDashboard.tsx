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

export default function EuroWebDashboard() {
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

  const [isConnected, setIsConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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

      setCurrentTime(new Date());
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
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
      className={cardVariants({ glow })}
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
              glow === 'purple' ? 'bg-purple-500' :
              glow === 'blue' ? 'bg-blue-500' :
              glow === 'green' ? 'bg-green-500' : 'bg-orange-500'
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
    <div className={dashboardVariants({ theme: "neural" })}>
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

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className={cardVariants({ glow: "purple" })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">Neural Search</h3>
              <p className="text-white/70 mb-4">Advanced AI-powered search engine</p>
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Launch Search
              </button>
            </div>
          </motion.div>

          <motion.div
            className={cardVariants({ glow: "blue" })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">AGI Analytics</h3>
              <p className="text-white/70 mb-4">Real-time intelligence analysis</p>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                View Analytics
              </button>
            </div>
          </motion.div>

          <motion.div
            className={cardVariants({ glow: "green" })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-white mb-2">Security Hub</h3>
              <p className="text-white/70 mb-4">Guardian protection system</p>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Security Center
              </button>
            </div>
          </motion.div>
        </div>

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
