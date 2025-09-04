// EuroWeb Ultra - Green AI & Edge Computing Manager
// Optimizimi i energjisë dhe procesimi lokal

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface EdgeNode {
  id: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  energyEfficiency: number; // 0-1
  latency: number; // ms
  processingPower: number; // GFLOPS
  carbonFootprint: number; // kg CO2/hour
}

interface GreenAIMetrics {
  totalEnergyConsumption: number; // kWh
  carbonEmissions: number; // kg CO2
  energyEfficiency: number; // 0-1
  quantizationLevel: number; // 0-1
  edgeOffloadRatio: number; // 0-1
  renewableEnergyUsage: number; // 0-1
}

export default function GreenAIEdgeManager() {
  const [edgeNodes, setEdgeNodes] = useState<EdgeNode[]>([
    {
      id: 'edge-tirana',
      location: 'Tiranë, Albania',
      status: 'online',
      energyEfficiency: 0.85,
      latency: 12,
      processingPower: 1250,
      carbonFootprint: 0.8
    },
    {
      id: 'edge-pristina',
      location: 'Prishtinë, Kosovo',
      status: 'online',
      energyEfficiency: 0.78,
      latency: 18,
      processingPower: 980,
      carbonFootprint: 1.2
    },
    {
      id: 'edge-skopje',
      location: 'Shkup, Macedonia',
      status: 'maintenance',
      energyEfficiency: 0.72,
      latency: 25,
      processingPower: 850,
      carbonFootprint: 1.5
    }
  ]);

  const [greenMetrics, setGreenMetrics] = useState<GreenAIMetrics>({
    totalEnergyConsumption: 145.6,
    carbonEmissions: 32.4,
    energyEfficiency: 0.82,
    quantizationLevel: 0.75,
    edgeOffloadRatio: 0.68,
    renewableEnergyUsage: 0.85
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationLog, setOptimizationLog] = useState<string[]>([]);

  // Simulon optimizimin e Green AI
  const optimizeGreenAI = useCallback(async () => {
    setIsOptimizing(true);
    const logs: string[] = [];

    // Step 1: Model Quantization
    logs.push('🔄 Starting model quantization...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 2: Edge Distribution
    logs.push('📡 Redistributing workload to edge nodes...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Step 3: Energy Optimization
    logs.push('⚡ Optimizing energy consumption patterns...');
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Step 4: Renewable Energy Switch
    logs.push('🌱 Switching to renewable energy sources...');
    await new Promise(resolve => setTimeout(resolve, 800));

    // Update metrics
    setGreenMetrics(prev => ({
      ...prev,
      energyEfficiency: Math.min(0.95, prev.energyEfficiency + 0.08),
      carbonEmissions: Math.max(15, prev.carbonEmissions - 8),
      quantizationLevel: Math.min(0.9, prev.quantizationLevel + 0.1),
      renewableEnergyUsage: Math.min(0.95, prev.renewableEnergyUsage + 0.05),
      edgeOffloadRatio: Math.min(0.85, prev.edgeOffloadRatio + 0.1)
    }));

    logs.push('✅ Green AI optimization completed!');
    setOptimizationLog(logs);
    setIsOptimizing(false);
  }, []);

  // Auto-optimization në çdo 30 sekonda
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulon ndryshime në metrics
      setGreenMetrics(prev => ({
        ...prev,
        totalEnergyConsumption: prev.totalEnergyConsumption + (Math.random() - 0.5) * 10,
        carbonEmissions: Math.max(10, prev.carbonEmissions + (Math.random() - 0.5) * 5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: EdgeNode['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency > 0.8) return 'text-green-600';
    if (efficiency > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6"
      >
        <h1 className="text-3xl font-bold mb-2">🌱 Green AI & Edge Computing</h1>
        <p className="text-green-100">
          Menaxhimi i energjisë dhe optimizimi i performancës me Edge Computing
        </p>
      </motion.div>

      {/* Green Metrics Dashboard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">📊 Green AI Metrics</h2>
          <button
            onClick={optimizeGreenAI}
            disabled={isOptimizing}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isOptimizing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                🚀 Optimize Green AI
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {greenMetrics.totalEnergyConsumption.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">kWh consumed</div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {greenMetrics.carbonEmissions.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">kg CO2 emissions</div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className={`text-2xl font-bold ${getEfficiencyColor(greenMetrics.energyEfficiency)}`}>
              {(greenMetrics.energyEfficiency * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">energy efficiency</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {(greenMetrics.quantizationLevel * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">quantization level</div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {(greenMetrics.edgeOffloadRatio * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">edge offload ratio</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {(greenMetrics.renewableEnergyUsage * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">renewable energy</div>
          </div>
        </div>
      </motion.div>

      {/* Edge Nodes Map */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">🗺️ Edge Computing Nodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {edgeNodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 p-4 rounded-lg border"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{node.location}</h3>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)}`} />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Latency:</span>
                  <span className="font-medium">{node.latency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Power:</span>
                  <span className="font-medium">{node.processingPower} GFLOPS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efficiency:</span>
                  <span className={`font-medium ${getEfficiencyColor(node.energyEfficiency)}`}>
                    {(node.energyEfficiency * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carbon:</span>
                  <span className="font-medium">{node.carbonFootprint} kg/h</span>
                </div>
              </div>

              {/* Node performance bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-green-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${node.energyEfficiency * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Optimization Log */}
      <AnimatePresence>
        {optimizationLog.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm"
          >
            <h3 className="text-white font-semibold mb-2">📋 Optimization Log</h3>
            <div className="space-y-1">
              {optimizationLog.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Energy Savings Visualization */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">💡 Energy Savings Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Daily Impact</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Energy Saved:</span>
                <span className="font-bold text-green-600">32.4 kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CO2 Reduced:</span>
                <span className="font-bold text-green-600">8.7 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cost Saved:</span>
                <span className="font-bold text-green-600">€4.86</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Monthly Projection</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Energy Saved:</span>
                <span className="font-bold text-blue-600">972 kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CO2 Reduced:</span>
                <span className="font-bold text-blue-600">261 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cost Saved:</span>
                <span className="font-bold text-blue-600">€145.80</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

