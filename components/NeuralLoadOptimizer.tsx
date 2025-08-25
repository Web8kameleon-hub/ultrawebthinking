// EuroWeb Ultra - Neural Load Optimizer
// Reduktimi i ngarkesës nga 90% në 70-75%

'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface NeuralLoadOptimizerProps {
  maxLoadThreshold?: number; // 0.75 = 75%
  enableGPUAcceleration?: boolean;
  enableQuantumSupport?: boolean;
}

interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  neuralLoad: number;
  gpuAcceleration: boolean;
  quantumAvailable: boolean;
  currentThroughput: number;
  optimizationLevel: 'low' | 'medium' | 'high' | 'ultra';
}

export default function NeuralLoadOptimizer({ 
  maxLoadThreshold = 0.75,
  enableGPUAcceleration = true,
  enableQuantumSupport = false 
}: NeuralLoadOptimizerProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    neuralLoad: 0,
    gpuAcceleration: false,
    quantumAvailable: false,
    currentThroughput: 0,
    optimizationLevel: 'medium'
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationHistory, setOptimizationHistory] = useState<number[]>([]);

  // Simulon matjen e performance-së reale
  const measurePerformance = useCallback(async (): Promise<PerformanceMetrics> => {
    // Simulated neural load measurement
    const baseLoad = Math.random() * 0.4 + 0.5; // 50-90%
    const gpuBoost = enableGPUAcceleration ? 0.15 : 0;
    const quantumBoost = enableQuantumSupport ? 0.25 : 0;
    
    const optimizedLoad = Math.max(0.1, baseLoad - gpuBoost - quantumBoost);
    
    return {
      cpuUsage: Math.random() * 40 + 30, // 30-70%
      memoryUsage: Math.random() * 30 + 40, // 40-70%
      neuralLoad: optimizedLoad,
      gpuAcceleration: enableGPUAcceleration && Math.random() > 0.3,
      quantumAvailable: enableQuantumSupport && Math.random() > 0.7,
      currentThroughput: Math.random() * 1000 + 500, // 500-1500 ops/sec
      optimizationLevel: optimizedLoad < 0.6 ? 'ultra' : 
                        optimizedLoad < 0.7 ? 'high' : 
                        optimizedLoad < 0.8 ? 'medium' : 'low'
    };
  }, [enableGPUAcceleration, enableQuantumSupport]);

  // Neural Throttling - automatik optimizim
  const performNeuralThrottling = useCallback(async () => {
    setIsOptimizing(true);
    
    // Simulon optimizimin neural
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newMetrics = await measurePerformance();
    setMetrics(newMetrics);
    
    // Shto në historik
    setOptimizationHistory(prev => [...prev.slice(-9), newMetrics.neuralLoad]);
    
    setIsOptimizing(false);
  }, [measurePerformance]);

  // Auto-optimization kur ngarkesa është shumë e lartë
  useEffect(() => {
    if (metrics.neuralLoad > maxLoadThreshold && !isOptimizing) {
      performNeuralThrottling();
    }
  }, [metrics.neuralLoad, maxLoadThreshold, isOptimizing, performNeuralThrottling]);

  // Matje periodike e performance-së
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isOptimizing) {
        const newMetrics = await measurePerformance();
        setMetrics(newMetrics);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [measurePerformance, isOptimizing]);

  const getLoadColor = (load: number) => {
    if (load < 0.6) return 'text-green-600';
    if (load < 0.75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOptimizationBadge = (level: string) => {
    const colors = {
      ultra: 'bg-green-100 text-green-800',
      high: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || colors.medium;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          🧠 Neural Load Optimizer
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getOptimizationBadge(metrics.optimizationLevel)}`}>
          {metrics.optimizationLevel.toUpperCase()}
        </div>
      </div>

      {/* Metrikat Kryesore */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Neural Load</p>
              <p className={`text-2xl font-bold ${getLoadColor(metrics.neuralLoad)}`}>
                {(metrics.neuralLoad * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-3xl">🧠</div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  metrics.neuralLoad < 0.6 ? 'bg-green-500' :
                  metrics.neuralLoad < 0.75 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.neuralLoad * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Throughput</p>
              <p className="text-2xl font-bold text-green-600">
                {metrics.currentThroughput.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500">ops/sec</p>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Status</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${metrics.gpuAcceleration ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-xs">GPU Acceleration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${metrics.quantumAvailable ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <span className="text-xs">Quantum Support</span>
                </div>
              </div>
            </div>
            <div className="text-3xl">🔧</div>
          </div>
        </div>
      </div>

      {/* Neural Throttling Controls */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Neural Throttling</h3>
          <button
            onClick={performNeuralThrottling}
            disabled={isOptimizing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isOptimizing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                🚀 Optimize Now
              </>
            )}
          </button>
        </div>

        {/* Optimization History Chart */}
        {optimizationHistory.length > 0 && (
          <div className="bg-white p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Optimization History</h4>
            <div className="flex items-end space-x-1 h-20">
              {optimizationHistory.map((load, index) => (
                <motion.div
                  key={index}
                  className={`flex-1 rounded-t ${
                    load < 0.6 ? 'bg-green-500' :
                    load < 0.75 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  initial={{ height: 0 }}
                  animate={{ height: `${load * 100}%` }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 Recommendations</h3>
        <div className="space-y-2 text-sm text-blue-700">
          {metrics.neuralLoad > 0.8 && (
            <p>• ⚠️ High neural load detected. Consider enabling GPU acceleration.</p>
          )}
          {!metrics.gpuAcceleration && enableGPUAcceleration && (
            <p>• 🔧 GPU acceleration is available but not active.</p>
          )}
          {metrics.optimizationLevel === 'ultra' && (
            <p>• ✅ System is running at optimal performance!</p>
          )}
          {metrics.currentThroughput < 800 && (
            <p>• 📈 Consider scaling up resources for better throughput.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
