/**
 * Web8 AGI Dashboard - Modern Neural Interface
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DashboardMetrics {
  cpu: number;
  memory: number;
  network: number;
  agiProcessing: number;
  aiAccuracy: number;
  learningRate: number;
  tokensPerMin: number;
  knowledgeBase: number;
}

export default function Web8Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    cpu: 0,
    memory: 0,
    network: 0,
    agiProcessing: 0,
    aiAccuracy: 0,
    learningRate: 0,
    tokensPerMin: 0,
    knowledgeBase: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time data updates
    const updateMetrics = () => {
      setMetrics({
        cpu: Math.floor(0.5 * 40) + 60,
        memory: Math.floor(0.5 * 30) + 30,
        network: Math.floor(0.5 * 500) + 200,
        agiProcessing: Math.floor(0.5 * 40) + 20,
        aiAccuracy: 95 + 0.5 * 5,
        learningRate: 0.5 * 2,
        tokensPerMin: Math.floor(0.5 * 5000) + 5000,
        knowledgeBase: 95 + 0.5 * 5
      });
    };

    // Initial load
    setTimeout(() => {
      updateMetrics();
      setIsLoading(false);
    }, 1000);

    // Update every 3 seconds
    const interval = setInterval(updateMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ 
    icon, 
    label, 
    value, 
    unit, 
    color = "blue",
    trend = "up" 
  }: {
    icon: string;
    label: string;
    value: number;
    unit: string;
    color?: string;
    trend?: "up" | "down" | "stable";
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 
        bg-gradient-to-br from-white via-gray-50 to-gray-100 
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        shadow-lg hover:shadow-xl transition-all duration-300
        backdrop-blur-sm`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`text-3xl`}>{icon}</div>
          <div className={`text-xs px-2 py-1 rounded-full 
            ${trend === 'up' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 
              trend === 'down' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' : 
              'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'}`}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {label}
          </h3>
          <div className="flex items-baseline space-x-1">
            <span className={`text-2xl font-bold bg-gradient-to-r 
              ${color === 'blue' ? 'from-blue-600 to-cyan-600' :
                color === 'green' ? 'from-green-600 to-emerald-600' :
                color === 'purple' ? 'from-purple-600 to-pink-600' :
                color === 'orange' ? 'from-orange-600 to-red-600' :
                'from-blue-600 to-purple-600'}
              bg-clip-text text-transparent`}>
              {isLoading ? '--' : value.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {unit}
            </span>
          </div>
        </div>

        {/* Progress bar for percentage values */}
        {unit === '%' && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(value, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-2 rounded-full bg-gradient-to-r 
                  ${color === 'blue' ? 'from-blue-500 to-cyan-500' :
                    color === 'green' ? 'from-green-500 to-emerald-500' :
                    color === 'purple' ? 'from-purple-500 to-pink-500' :
                    color === 'orange' ? 'from-orange-500 to-red-500' :
                    'from-blue-500 to-purple-500'}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 dark:to-black/10 pointer-events-none" />
    </motion.div>
  );

  const QuickActionCard = ({ 
    icon, 
    title, 
    description, 
    action, 
    color = "blue" 
  }: {
    icon: string;
    title: string;
    description: string;
    action: string;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 
        bg-gradient-to-br from-white via-gray-50 to-gray-100 
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className={`text-4xl group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
        </div>
        
        <button className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200
          bg-gradient-to-r hover:shadow-lg transform hover:-translate-y-0.5
          ${color === 'blue' ? 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' :
            color === 'green' ? 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' :
            color === 'purple' ? 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' :
            'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}
          text-white`}>
          {action}
        </button>
      </div>

      {/* Animated border effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-xl transition-all duration-300" />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                🌐 EuroWeb AGI Platform
              </h1>
              <p className="text-blue-100 text-lg">
                Advanced Neural Processing Dashboard • v8.0.0 • {new Date().toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-green-300 mb-1">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="font-medium">🚀 Neural Systems Online</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <MetricCard 
            icon="🧠" 
            label="CPU Usage" 
            value={metrics.cpu} 
            unit="%" 
            color="blue"
            trend="up"
          />
          <MetricCard 
            icon="💾" 
            label="Memory" 
            value={metrics.memory} 
            unit="%" 
            color="green"
            trend="stable"
          />
          <MetricCard 
            icon="🌐" 
            label="Network" 
            value={metrics.network} 
            unit="MB/s" 
            color="purple"
            trend="up"
          />
          <MetricCard 
            icon="⚡" 
            label="AGI Processing" 
            value={metrics.agiProcessing} 
            unit="%" 
            color="orange"
            trend="up"
          />
        </motion.div>

        {/* Secondary Metrics */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <MetricCard 
            icon="🎯" 
            label="AI Accuracy" 
            value={metrics.aiAccuracy} 
            unit="%" 
            color="green"
            trend="up"
          />
          <MetricCard 
            icon="📈" 
            label="Learning Rate" 
            value={metrics.learningRate} 
            unit="" 
            color="blue"
            trend="stable"
          />
          <MetricCard 
            icon="🔤" 
            label="Tokens/Min" 
            value={metrics.tokensPerMin} 
            unit="" 
            color="purple"
            trend="up"
          />
          <MetricCard 
            icon="📚" 
            label="Knowledge Base" 
            value={metrics.knowledgeBase} 
            unit="%" 
            color="orange"
            trend="up"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <QuickActionCard
            icon="🔍"
            title="Neural Search"
            description="Advanced AI-powered search engine"
            action="Launch Search"
            color="blue"
          />
          <QuickActionCard
            icon="📊"
            title="AGI Analytics"
            description="Real-time intelligence analysis"
            action="View Analytics"
            color="green"
          />
          <QuickActionCard
            icon="🛡️"
            title="Security Hub"
            description="Guardian protection system"
            action="Security Center"
            color="purple"
          />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-gray-600 dark:text-gray-300">
            🚀 EuroWeb Platform v8.0.0 | Created by <span className="font-semibold text-blue-600 dark:text-blue-400">Ledjan Ahmati</span> | 🔒 Secure & Neural-Powered
          </p>
        </div>
      </motion.footer>
    </div>
  );
}

