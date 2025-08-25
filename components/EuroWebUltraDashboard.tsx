// EuroWeb Ultra - Main Dashboard Integration
// Dashboard kryesor që integron të gjitha modulet

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, lazy, useEffect, useState } from 'react';

// Lazy load all major components
const NeuralLoadOptimizer = lazy(() => import('./NeuralLoadOptimizer'));
const GreenAIEdgeManager = lazy(() => import('./GreenAIEdgeManager'));
const CustomDashboardBuilder = lazy(() => import('./CustomDashboardBuilder'));
const SecurityDashboard = lazy(() => import('./SecurityDashboard'));
const SystemPerformanceDashboard = lazy(() => import('./SystemPerformanceDashboard'));
const LazyLoadingDemo = lazy(() => import('./LazyLoadingDemo'));

interface ModuleStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  load: number;
  users: number;
  lastUpdate: Date;
  icon: string;
  description: string;
}

interface SystemOverview {
  totalUsers: number;
  activeModules: number;
  totalModules: number;
  systemHealth: number;
  energyEfficiency: number;
  securityScore: number;
  performanceScore: number;
}

const LoadingSpinner = ({ message = 'Duke ngarkuar...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4">
    <motion.div
      className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
    <p className="text-gray-600">{message}</p>
  </div>
);

export default function EuroWebUltraDashboard() {
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [modules, setModules] = useState<ModuleStatus[]>([
    {
      id: 'agi-med',
      name: 'AGI×Med',
      status: 'online',
      load: 65,
      users: 234,
      lastUpdate: new Date(),
      icon: '🏥',
      description: 'Medical AI diagnostics and treatment recommendations'
    },
    {
      id: 'agi-edu',
      name: 'AGI×Edu',
      status: 'online',
      load: 78,
      users: 1456,
      lastUpdate: new Date(),
      icon: '📚',
      description: 'Personalized education and learning optimization'
    },
    {
      id: 'agi-el',
      name: 'AGI×El',
      status: 'online',
      load: 52,
      users: 89,
      lastUpdate: new Date(),
      icon: '⚡',
      description: 'Smart energy grid management and optimization'
    },
    {
      id: 'agi-eco',
      name: 'AGI×Eco',
      status: 'maintenance',
      load: 0,
      users: 0,
      lastUpdate: new Date(),
      icon: '🌱',
      description: 'Environmental monitoring and sustainability'
    },
    {
      id: 'agi-agro',
      name: 'AGI×Agro',
      status: 'online',
      load: 43,
      users: 156,
      lastUpdate: new Date(),
      icon: '🌾',
      description: 'Smart agriculture with IoT sensors and climate prediction'
    },
    {
      id: 'agi-defense',
      name: 'AGI×Defense',
      status: 'online',
      load: 85,
      users: 45,
      lastUpdate: new Date(),
      icon: '🛡️',
      description: 'Autonomous crisis management and defense systems'
    }
  ]);

  const [systemOverview, setSystemOverview] = useState<SystemOverview>({
    totalUsers: 1980,
    activeModules: 5,
    totalModules: 6,
    systemHealth: 94.5,
    energyEfficiency: 87.2,
    securityScore: 96.8,
    performanceScore: 91.3
  });

  const [notifications, setNotifications] = useState<string[]>([
    '🔧 AGI×Eco is under maintenance - expected completion in 2 hours',
    '✅ Security scan completed - 0 vulnerabilities found',
    '📈 System performance improved by 15% after optimization',
    '🌱 Energy efficiency increased to 87.2%'
  ]);

  // Auto-update system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setModules(prev => prev.map(module => ({
        ...module,
        load: module.status === 'online' ? 
          Math.max(20, Math.min(95, module.load + (Math.random() - 0.5) * 10)) : 0,
        users: module.status === 'online' ? 
          Math.max(0, module.users + Math.floor((Math.random() - 0.5) * 20)) : 0,
        lastUpdate: new Date()
      })));

      setSystemOverview(prev => ({
        ...prev,
        systemHealth: Math.max(90, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)),
        energyEfficiency: Math.max(80, Math.min(95, prev.energyEfficiency + (Math.random() - 0.5) * 1)),
        securityScore: Math.max(95, Math.min(100, prev.securityScore + (Math.random() - 0.5) * 0.5)),
        performanceScore: Math.max(85, Math.min(100, prev.performanceScore + (Math.random() - 0.5) * 3))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: ModuleStatus['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'error': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getLoadColor = (load: number) => {
    if (load < 50) return 'text-green-600';
    if (load < 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'neural':
        return <NeuralLoadOptimizer />;
      case 'green':
        return <GreenAIEdgeManager />;
      case 'dashboard':
        return <CustomDashboardBuilder />;
      case 'security':
        return <SecurityDashboard />;
      case 'performance':
        return <SystemPerformanceDashboard />;
      case 'demo':
        return <LazyLoadingDemo />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{systemOverview.totalUsers.toLocaleString()}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Modules</p>
              <p className="text-3xl font-bold text-green-600">
                {systemOverview.activeModules}/{systemOverview.totalModules}
              </p>
            </div>
            <div className="text-4xl">🤖</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Health</p>
              <p className={`text-3xl font-bold ${getScoreColor(systemOverview.systemHealth)}`}>
                {systemOverview.systemHealth.toFixed(1)}%
              </p>
            </div>
            <div className="text-4xl">💚</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Performance</p>
              <p className={`text-3xl font-bold ${getScoreColor(systemOverview.performanceScore)}`}>
                {systemOverview.performanceScore.toFixed(1)}%
              </p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </motion.div>
      </div>

      {/* Modules Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6">🤖 AGI Module Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{module.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{module.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status)}`} />
                      <span className="text-sm text-gray-600 capitalize">{module.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getLoadColor(module.load)}`}>
                    {module.load}%
                  </div>
                  <div className="text-xs text-gray-500">Load</div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{module.description}</p>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-gray-600">Users: </span>
                  <span className="font-medium">{module.users}</span>
                </div>
                <div className="text-gray-500">
                  {module.lastUpdate.toLocaleTimeString()}
                </div>
              </div>

              {/* Load bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      module.load < 50 ? 'bg-green-500' :
                      module.load < 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${module.load}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* System Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6">📊 System Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🌱</div>
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(systemOverview.energyEfficiency)}`}>
              {systemOverview.energyEfficiency.toFixed(1)}%
            </div>
            <div className="text-gray-600">Energy Efficiency</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${systemOverview.energyEfficiency}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-2">🛡️</div>
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(systemOverview.securityScore)}`}>
              {systemOverview.securityScore.toFixed(1)}%
            </div>
            <div className="text-gray-600">Security Score</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${systemOverview.securityScore}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-2">⚡</div>
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(systemOverview.performanceScore)}`}>
              {systemOverview.performanceScore.toFixed(1)}%
            </div>
            <div className="text-gray-600">Performance Score</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${systemOverview.performanceScore}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-4">📢 System Notifications</h2>
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="text-sm">{notification}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '🏠' },
    { id: 'performance', label: 'Performance', icon: '📊' },
    { id: 'neural', label: 'Neural Load', icon: '🧠' },
    { id: 'green', label: 'Green AI', icon: '🌱' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'dashboard', label: 'Custom Dashboard', icon: '🎛️' },
    { id: 'demo', label: 'Lazy Loading Demo', icon: '🚀' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900 to-purple-900 text-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🌐</div>
              <div>
                <h1 className="text-2xl font-bold">EuroWeb Ultra</h1>
                <p className="text-blue-200 text-sm">Advanced AI Platform Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-blue-200">System Status</div>
                <div className="font-semibold text-green-300">🟢 All Systems Operational</div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 bg-white rounded-lg shadow-lg p-4"
          >
            <h3 className="font-semibold text-gray-800 mb-4">Navigation</h3>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeModule === item.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.nav>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<LoadingSpinner message="Duke ngarkuar modulin..." />}>
                  {renderModuleContent()}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
