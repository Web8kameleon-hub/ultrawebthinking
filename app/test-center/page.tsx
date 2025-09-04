/**
 * EuroWeb Test Center - All Components 
 * @author Ledjan Ahmati
 * @version 8.0.0 Real
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import React, { useState } from "react";

// Dynamic imports to prevent SSR issues
const SurfingBeautiful = dynamic(() => import("../../components/Surfing-Beautiful"), {
  loading: () => <div className="animate-pulse bg-slate-200 h-64 rounded-lg">Loading Surfing...</div>
});

const Aviation = dynamic(() => import("../../components/Aviation"), {
  loading: () => <div className="animate-pulse bg-slate-200 h-64 rounded-lg">Loading Aviation...</div>
});

type ComponentType = 'surfing' | 'aviation' | 'mind' | 'overview';

const TestCenter: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<ComponentType>('overview');

  const components = {
    surfing: { 
      name: '🌊 Surfing Beautiful', 
      description: 'AGI-powered chat, search, navigation',
      component: <SurfingBeautiful />
    },
    aviation: { 
      name: '✈️ Aviation Control', 
      description: 'Real-time flight monitoring system',
      component: <Aviation />
    },
    mind: { 
      name: '🧠 Mind Center', 
      description: 'AGI neural network visualization',
      component: <div className="p-8 text-center text-slate-500">🚧 Mind component coming soon...</div>
    },
    overview: {
      name: '📊 Overview',
      description: 'System status and performance',
      component: null
    }
  };

  const renderOverview = () => (
    <div className="max-w-6xl mx-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          🚀 EuroWeb Ultra Platform
        </h1>
        <p className="text-xl text-slate-600">
          Real AGI-powered components, beautiful UI, functional APIs
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Object.entries(components).filter(([key]) => key !== 'overview').map(([key, comp], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setActiveComponent(key as ComponentType)}
          >
            <h3 className="text-xl font-bold text-slate-800 mb-2">{comp.name}</h3>
            <p className="text-slate-600 mb-4">{comp.description}</p>
            <div className="text-sm text-blue-600 font-medium">Click to test →</div>
          </motion.div>
        ))}
      </div>

      {/* API Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-50 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-4">🔌 API Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Chat API', endpoint: '/api/chat', status: 'active' },
            { name: 'Search API', endpoint: '/api/search', status: 'active' },
            { name: 'Navigate API', endpoint: '/api/navigate', status: 'active' }
          ].map((api) => (
            <div key={api.name} className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="font-medium">{api.name}</span>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                  {api.status}
                </span>
              </div>
              <div className="text-sm text-slate-500 mt-1">{api.endpoint}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Test */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 bg-blue-50 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-4">⚡ Quick Test</h2>
        <div className="space-y-2 text-sm text-slate-600">
          <div>• Open browser console to see API logs</div>
          <div>• Test Surfing component for real AGI responses</div>
          <div>• Check Aviation for real-time flight data</div>
          <div>• Import postman_collection.json for API testing</div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <span className="font-bold text-slate-800">EuroWeb Test Center</span>
            </div>
            <div className="flex gap-1">
              {Object.entries(components).map(([key, comp]) => (
                <button
                  key={key}
                  onClick={() => setActiveComponent(key as ComponentType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeComponent === key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {comp.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeComponent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeComponent === 'overview' 
            ? renderOverview() 
            : components[activeComponent].component
          }
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TestCenter;

