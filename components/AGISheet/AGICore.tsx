'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';

const coreVariants = cva(
  "p-6 rounded-xl border-2 transition-all duration-300",
  {
    variants: {
      status: {
        active: "border-green-500 bg-green-50",
        processing: "border-yellow-500 bg-yellow-50",
        idle: "border-gray-300 bg-gray-50",
      }
    }
  }
);

interface AGICoreProps {
  mode?: 'dashboard' | 'standalone';
  theme?: 'royal' | 'dark' | 'nature';
  enableRealTime?: boolean;
}

export const AGICore: React.FC<AGICoreProps> = ({ 
  mode = 'standalone', 
  theme = 'royal',
  enableRealTime = true 
}) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'active'>('idle');
  const [layers, setLayers] = useState(7);
  const [processingSpeed, setProcessingSpeed] = useState('2500 THz');
  const [connections, setConnections] = useState(3500);
  const [memory, setMemory] = useState(100);

  useEffect(() => {
    if (enableRealTime) {
      const interval = setInterval(() => {
        setStatus(prev => {
          const statuses: Array<'idle' | 'processing' | 'active'> = ['idle', 'processing', 'active'];
          return statuses[Math.floor(Math.random() * statuses.length)];
        });
        setConnections(prev => prev + Math.floor(Math.random() * 10) - 5);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [enableRealTime]);

  const startProcessing = () => {
    setStatus('processing');
    setTimeout(() => setStatus('active'), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">🧠 AGI Core Engine</h2>
        <p className="text-gray-600 mt-2">Artificial General Intelligence Processing Unit</p>
      </div>

      {/* Status Display */}
      <div className={coreVariants({ status })}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{layers}</div>
            <div className="text-sm text-gray-600">AGI Layers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{processingSpeed}</div>
            <div className="text-sm text-gray-600">Processing Speed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{connections}</div>
            <div className="text-sm text-gray-600">Active Connections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{memory}%</div>
            <div className="text-sm text-gray-600">Memory Optimal</div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Core Controls</h3>
        <div className="flex flex-wrap gap-4">
          <motion.button
            onClick={startProcessing}
            disabled={status === 'processing'}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {status === 'processing' ? 'Processing...' : 'Start AGI Process'}
          </motion.button>
          
          <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            Neural Analysis
          </button>
          
          <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            Quantum Sync
          </button>
        </div>
      </div>

      {/* Real-time Activity */}
      {enableRealTime && (
        <div className="mt-6 bg-black rounded-xl p-4 text-green-400 font-mono text-sm">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            AGI Core Live Activity
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            <div>{">"} Neural pathway optimization: 98.7%</div>
            <div>{">"} Quantum entanglement sync: STABLE</div>
            <div>{">"} Memory allocation: OPTIMAL</div>
            <div>{">"} AGI consciousness level: {status.toUpperCase()}</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
