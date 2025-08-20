/**
 * EuroWeb Ultra Professional Platform
 * Professional UI/UX with modern design system
 */

'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';

// Professional CVA variants
const cardVariants = cva(
  'relative overflow-hidden transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        glass: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl',
        neural: 'bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/25',
        industrial: 'bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-600/30 shadow-2xl',
        quantum: 'bg-gradient-to-br from-cyan-900/90 to-blue-900/90 backdrop-blur-xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/25'
      },
      size: {
        sm: 'p-4 rounded-lg',
        md: 'p-6 rounded-xl',
        lg: 'p-8 rounded-2xl'
      },
      glow: {
        true: 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
      }
    },
    defaultVariants: {
      variant: 'glass',
      size: 'md',
      glow: false
    }
  }
);

const buttonVariants = cva(
  'relative inline-flex items-center justify-center font-semibold transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
        neural: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 focus:ring-purple-500',
        glass: 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 shadow-lg hover:shadow-xl',
        outline: 'border-2 border-current text-current hover:bg-current hover:text-white'
      },
      size: {
        sm: 'px-4 py-2 text-sm rounded-lg',
        md: 'px-6 py-3 text-base rounded-xl',
        lg: 'px-8 py-4 text-lg rounded-2xl'
      },
      glow: {
        true: 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      glow: false
    }
  }
);

const tabVariants = cva(
  'relative flex items-center space-x-3 px-6 py-4 cursor-pointer transition-all duration-300 group',
  {
    variants: {
      active: {
        true: 'bg-white/10 backdrop-blur-xl border-b-2 border-blue-400 text-white',
        false: 'text-white/70 hover:text-white hover:bg-white/5'
      }
    }
  }
);

interface Tab {
  id: string;
  title: string;
  icon: string;
  url: string;
  color: string;
  description: string;
  isActive: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
}

// Lazy load components
const NeuralAnalytics = lazy(() => import('./NeuralAnalytics'));
const SecurityDashboard = lazy(() => import('./SecurityDashboard'));

const ProfessionalLoader = ({ message = 'Loading...' }: { message?: string }) => (
  <motion.div 
    className="flex flex-col items-center justify-center p-12 space-y-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="relative">
      <motion.div
        className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
    <motion.p 
      className="text-white/80 font-medium"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {message}
    </motion.p>
  </motion.div>
);

export const EuroWebProfessionalPlatform: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'dashboard',
      title: 'AGI Command Center',
      icon: '🧠',
      url: 'euroweb://command-center',
      color: 'from-purple-600 to-blue-600',
      description: 'Neural analytics and system control',
      isActive: true
    },
    {
      id: 'agioffice',
      title: 'AGI Office Pro',
      icon: '💼',
      url: 'euroweb://office-pro',
      color: 'from-blue-600 to-cyan-600',
      description: 'Intelligent workspace automation',
      isActive: false
    },
    {
      id: 'agimed',
      title: 'AGI Medical',
      icon: '🏥',
      url: 'euroweb://medical-ai',
      color: 'from-red-600 to-pink-600',
      description: 'Advanced medical diagnostics',
      isActive: false
    },
    {
      id: 'guardian',
      title: 'Quantum Guardian',
      icon: '🛡️',
      url: 'euroweb://security-matrix',
      color: 'from-orange-600 to-red-600',
      description: 'Quantum security protocols',
      isActive: false
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'System Optimized',
      message: 'Neural networks performance increased by 23%',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'info',
      title: 'AGI Update',
      message: 'New quantum algorithms deployed successfully',
      timestamp: new Date()
    }
  ]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      content: 'Welcome to EuroWeb Ultra. I\'m your AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 67,
    memoryUsage: 45,
    networkActivity: 89,
    aiProcesses: 12
  });

  const activeTab = tabs.find(tab => tab.isActive);

  // Animated metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpuUsage: Math.max(20, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(20, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        networkActivity: Math.max(30, Math.min(100, prev.networkActivity + (Math.random() - 0.5) * 15)),
        aiProcesses: Math.max(5, Math.min(20, prev.aiProcesses + Math.floor((Math.random() - 0.5) * 4)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleTabClick = (tabId: string) => {
    setTabs(prev => prev.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })));
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      content: chatInput,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: `ai-${Date.now()}`,
        content: 'I understand your request. Let me process that through our neural networks...',
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const renderContent = () => {
    if (!activeTab) return <ProfessionalLoader />;

    switch (activeTab.id) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cardVariants({ variant: 'neural', size: 'lg', glow: true })}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    AGI Command Center
                  </h1>
                  <p className="text-purple-200">Advanced Neural Control Interface</p>
                </div>
                <div className="text-6xl">🧠</div>
              </div>

              {/* Real-time Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'CPU Usage', value: systemMetrics.cpuUsage, unit: '%', color: 'from-blue-400 to-blue-600' },
                  { label: 'Memory', value: systemMetrics.memoryUsage, unit: '%', color: 'from-green-400 to-green-600' },
                  { label: 'Network', value: systemMetrics.networkActivity, unit: '%', color: 'from-purple-400 to-purple-600' },
                  { label: 'AI Processes', value: systemMetrics.aiProcesses, unit: '', color: 'from-orange-400 to-orange-600' }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white/80 text-sm font-medium">{metric.label}</p>
                      <span className="text-2xl font-bold text-white">
                        {metric.value}{metric.unit}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${metric.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={cardVariants({ variant: 'glass', size: 'lg' })}
              >
                <Suspense fallback={<ProfessionalLoader message="Loading Neural Analytics..." />}>
                  <NeuralAnalytics />
                </Suspense>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className={cardVariants({ variant: 'industrial', size: 'lg' })}
              >
                <h3 className="text-2xl font-bold text-white mb-6">🔮 Quantum Operations</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Neural Processing', status: 'active', progress: 87 },
                    { name: 'Quantum Computing', status: 'optimizing', progress: 92 },
                    { name: 'Data Synthesis', status: 'complete', progress: 100 },
                    { name: 'Edge Computing', status: 'standby', progress: 45 }
                  ].map((operation, index) => (
                    <motion.div
                      key={operation.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{operation.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          operation.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          operation.status === 'optimizing' ? 'bg-blue-500/20 text-blue-400' :
                          operation.status === 'complete' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {operation.status}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${operation.progress}%` }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'agioffice':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cardVariants({ variant: 'quantum', size: 'lg', glow: true })}
          >
            <div className="text-center">
              <div className="text-8xl mb-6">💼</div>
              <h2 className="text-3xl font-bold text-white mb-4">AGI Office Pro</h2>
              <p className="text-cyan-200 mb-8 text-lg">Intelligent workspace automation with quantum processing</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={buttonVariants({ variant: 'neural', size: 'lg', glow: true })}
                onClick={() => window.open('/agioffice', '_blank')}
              >
                Launch AGI Office Pro
              </motion.button>
            </div>
          </motion.div>
        );

      case 'agimed':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cardVariants({ variant: 'neural', size: 'lg', glow: true })}
          >
            <div className="text-center">
              <div className="text-8xl mb-6">🏥</div>
              <h2 className="text-3xl font-bold text-white mb-4">AGI Medical</h2>
              <p className="text-purple-200 mb-8 text-lg">Advanced medical AI with diagnostic precision</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={buttonVariants({ variant: 'primary', size: 'lg', glow: true })}
                onClick={() => window.open('/agimed', '_blank')}
              >
                Access Medical AI
              </motion.button>
            </div>
          </motion.div>
        );

      case 'guardian':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className={cardVariants({ variant: 'industrial', size: 'lg' })}>
              <h2 className="text-3xl font-bold text-white mb-6">🛡️ Quantum Guardian</h2>
              <Suspense fallback={<ProfessionalLoader message="Loading Security Matrix..." />}>
                <SecurityDashboard />
              </Suspense>
            </div>
          </motion.div>
        );

      default:
        return <ProfessionalLoader />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EuroWeb Ultra
              </div>
              <div className="text-sm text-white/60">v8.0 Professional</div>
            </motion.div>

            <motion.div
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search AGI Systems..."
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent w-80"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">🔍</div>
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-white/70 hover:text-white transition-colors"
              >
                <div className="text-xl">🔔</div>
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-semibold">
                    {notifications.length}
                  </div>
                )}
              </motion.button>

              {/* User Profile */}
              <div className="flex items-center space-x-2 text-white">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                <span className="font-medium">Admin</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="relative z-10 bg-black/10 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab, index) => (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={tabVariants({ active: tab.isActive })}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className="text-2xl">{tab.icon}</span>
                <div>
                  <div className="font-semibold">{tab.title}</div>
                  <div className="text-xs opacity-70">{tab.description}</div>
                </div>
                {tab.isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                    layoutId="activeTab"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Chat */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-2xl text-white text-2xl z-50 flex items-center justify-center"
      >
        💬
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed top-0 right-0 h-full w-96 bg-black/40 backdrop-blur-2xl border-l border-white/20 z-40 flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">🤖 Neural Assistant</h3>
                <p className="text-xs text-purple-100">Powered by OpenMind AI</p>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-purple-200 text-xl"
              >
                ×
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-white/20">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask your AI assistant..."
                  className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!chatInput.trim()}
                  className={buttonVariants({ variant: 'neural', size: 'sm' })}
                >
                  ↗️
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EuroWebProfessionalPlatform;
