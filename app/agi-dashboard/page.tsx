"use client";

import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';
import dynamic from 'next/dynamic';

// Next.js Dynamic imports - Pure TypeScript 
const AGICore = dynamic(() => import('@/components/AGISheet/AGICoreUltra').then(m => ({ default: m.AGICoreUltra })), {
  loading: () => <div className="animate-pulse">Loading AGI Core...</div>
});

const AGISheet = dynamic(() => import('@/components/AGISheet/AGISheet').then(m => ({ default: m.AGISheet })), {
  loading: () => <div className="animate-pulse">Loading AGI Sheet...</div>
});

const AGIMed = dynamic(() => import('@/components/AGImed/AGIForm').then(m => ({ default: m.AGIXForm })), {
  loading: () => <div className="animate-pulse">Loading AGI Med...</div>
});

const AGIBioNature = dynamic(() => import('@/components/AGISheet/AGIBioNature').then(m => ({ default: m.AGIBioNature })), {
  loading: () => <div className="animate-pulse">Loading AGI Bio...</div>
});

const AGIEco = dynamic(() => import('@/components/AGISheet/AGIEco').then(m => ({ default: m.AGIEco })), {
  loading: () => <div className="animate-pulse">Loading AGI Eco...</div>
});

const OpenMindChat = dynamic(() => import('@/components/chat/OpenMindChat').then(m => ({ default: m.OpenMindChat })), {
  loading: () => <div className="animate-pulse">Loading Chat...</div>
});

// CVA për royal design styling
const tabVariants = cva(
  "relative px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer border border-transparent group overflow-hidden text-sm",
  {
    variants: {
      variant: {
        active: "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-400 shadow-lg",
        inactive: "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:shadow-md hover:bg-purple-50",
      }
    }
  }
);

const containerVariants = cva(
  "min-h-screen relative overflow-hidden",
  {
    variants: {
      theme: {
        royal: "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100",
        dark: "bg-gradient-to-br from-gray-900 via-purple-900 to-black",
        nature: "bg-gradient-to-br from-green-50 via-blue-50 to-teal-100"
      }
    }
  }
);

const cardVariants = cva(
  "relative backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden",
  {
    variants: {
      variant: {
        glass: "bg-white/30 border-white/20",
        solid: "bg-white border-gray-200",
        royal: "bg-gradient-to-br from-white/80 to-purple-50/80 border-purple-200/50"
      }
    }
  }
);

type TabType = 'agimed' | 'agicore' | 'agiei' | 'agisheet' | 'agibionature' | 'openmind-chat';

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
}

const AGIDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('agicore');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<number>(0);
  const [liveData, setLiveData] = useState<any>({});
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Dynamic search results që ndryshojnë
  React.useEffect(() => {
    const updateResults = () => {
      setSearchResults(Math.floor(Math.random() * 1000) + 100);
    };
    
    const interval = setInterval(updateResults, 2000);
    updateResults(); // Initial update
    
    return () => clearInterval(interval);
  }, [activeTab]);

  // Socket.IO connection për live data
  React.useEffect(() => {
    // Mock live data simulation
    const liveInterval = setInterval(() => {
      setLiveData({
        connections: Math.floor(Math.random() * 5000) + 1000,
        processing: Math.floor(Math.random() * 100) + 50,
        queries: Math.floor(Math.random() * 10000) + 5000,
        timestamp: new Date().toISOString()
      });
    }, 1500);

    return () => clearInterval(liveInterval);
  }, []);

  const tabs: TabConfig[] = [
    { id: 'agicore', label: 'AGI Core', icon: '🧠', component: AGICore },
    { id: 'agisheet', label: 'AGI Sheet', icon: '📊', component: AGISheet },
    { id: 'agimed', label: 'AGI Med', icon: '🏥', component: AGIMed },
    { id: 'agibionature', label: 'AGI Bio Nature', icon: '🌿', component: AGIBioNature },
    { id: 'agiei', label: 'AGI Eco Intelligence', icon: '💰', component: AGIEco },
    { id: 'openmind-chat', label: 'OpenMind Chat', icon: '💬', component: OpenMindChat }
  ];

  const handleTabClick = async (tabId: TabType) => {
    setLoading(true);
    // Simulate lazy loading delay
    await new Promise(resolve => setTimeout(resolve, 300));
    setActiveTab(tabId);
    setLoading(false);
  };

  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className={containerVariants({ theme: 'royal' })}>
      {/* Royal Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-32 h-32 bg-purple-300/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300/20 rounded-full blur-xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-7xl mx-auto p-6"
      >
        {/* Royal Header me live stats */}
        <div className="text-center mb-12 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cardVariants({ variant: 'glass' }) + " p-8 mb-8"}
          >
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
              � AGI Royal Dashboard
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              Artificial General Intelligence • EuroWeb Platform • Yarn Berry Environment
            </p>
            
            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gradient-to-br from-purple-500 to-blue-600 text-white p-4 rounded-xl"
              >
                <div className="text-2xl font-bold">{searchResults.toLocaleString()}</div>
                <div className="text-sm opacity-90">📊 Search Results</div>
              </motion.div>
              
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-xl"
              >
                <div className="text-2xl font-bold">{liveData.connections?.toLocaleString() || '...'}</div>
                <div className="text-sm opacity-90">🔗 Live Connections</div>
              </motion.div>
              
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 rounded-xl"
              >
                <div className="text-2xl font-bold">{liveData.processing || '...'}%</div>
                <div className="text-sm opacity-90">⚡ AI Processing</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Sticky Top Tab Navigation */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-200 mb-8">
          <div className="flex gap-2 p-4 overflow-x-auto">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={tabVariants({ 
                  variant: activeTab === tab.id ? 'active' : 'inactive' 
                })}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                disabled={loading}
              >
              {/* Royal Background Effect */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-xl"
                  transition={{ duration: 0.3 }}
                />
              )}
              
              <span className="relative z-10 flex items-center">
                <span className="mr-3 text-2xl">{tab.icon}</span>
                <span className="font-semibold">{tab.label}</span>
              </span>
              
              {/* Sparkle effect për active tab */}
              {activeTab === tab.id && (
                <motion.div
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1 right-1 w-3 h-3 bg-yellow-300 rounded-full z-20"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="flex gap-8">
          {/* Left Sidebar - Activity Table */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 flex-shrink-0"
          >
            <div className={cardVariants({ variant: 'glass' }) + " p-6 sticky top-24"}>
              <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                📊 Live Activity
              </h3>
              
              {/* Live Stats Table */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Search Results</span>
                    <span className="font-bold">{searchResults.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Live Connections</span>
                    <span className="font-bold">{liveData.connections?.toLocaleString() || '...'}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">AI Processing</span>
                    <span className="font-bold">{liveData.processing || '...'}%</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Active Queries</span>
                    <span className="font-bold">{liveData.queries?.toLocaleString() || '...'}</span>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-3">Recent Activity</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                    🧠 AGI Core: Neural analysis started
                  </div>
                  <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                    📊 AGI Sheet: Data processing complete
                  </div>
                  <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                    🏥 AGI Med: Medical scan initiated
                  </div>
                  <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                    🌿 AGI Bio: Nature analysis running
                  </div>
                  <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                    💰 AGI Eco: Economic data updated
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content Area */}
          <div className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"
                />
              </div>
            )}

            {/* Component Container */}
            {!loading && activeComponent && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cardVariants({ variant: 'royal' }) + " p-8 min-h-[600px]"}
              >
                {React.createElement(activeComponent, {
                  mode: 'dashboard',
                  theme: 'royal',
                  enableRealTime: true,
                  searchResults: searchResults,
                  liveData: liveData
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>🔗 Socket.IO Live Connection | 📦 Yarn Berry Environment | 🛡️ Guardian Protection</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AGIDashboard;
