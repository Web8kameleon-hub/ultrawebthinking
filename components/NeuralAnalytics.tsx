/**
 * Neural Analytics Engine - Real-time Intelligence Processing
 * EuroWeb Platform - Industrial Grade Analytics & AI Insights
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.1 Industrial
 * @license MIT
 */

'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';

// CVA Variants
const analyticsVariants = cva(
  'neural-analytics fixed top-4 left-4 bg-black bg-opacity-90 backdrop-blur-lg rounded-xl border border-purple-500 border-opacity-30 shadow-2xl z-50',
  {
    variants: {
      state: {
        minimized: 'w-16 h-16',
        compact: 'w-80 h-64',
        expanded: 'w-96 h-[500px]',
        fullscreen: 'w-[90vw] h-[90vh] top-[5vh] left-[5vw]'
      }
    },
    defaultVariants: {
      state: 'minimized'
    }
  }
);

const metricVariants = cva(
  'metric-card bg-gray-800 bg-opacity-50 rounded-lg p-3 border transition-all duration-300',
  {
    variants: {
      status: {
        normal: 'border-gray-600',
        warning: 'border-yellow-500 bg-yellow-900 bg-opacity-20',
        critical: 'border-red-500 bg-red-900 bg-opacity-20',
        optimal: 'border-green-500 bg-green-900 bg-opacity-20'
      }
    },
    defaultVariants: {
      status: 'normal'
    }
  }
);

interface NeuralMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical' | 'optimal';
  history: number[];
  threshold?: { min?: number; max?: number };
  icon: string;
}

interface AnalyticsInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'prediction' | 'optimization' | 'alert';
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
  data?: any;
}

interface NeuralAnalyticsProps {
  onInsightClick?: (insight: AnalyticsInsight) => void;
  onMetricAlert?: (metric: NeuralMetric) => void;
  autoAnalyze?: boolean;
  className?: string;
}

const defaultMetrics: NeuralMetric[] = [
  {
    id: 'neural-processing',
    name: 'Neural Processing',
    value: 87.3,
    unit: '%',
    trend: 'up',
    status: 'optimal',
    history: [82, 84, 86, 85, 87.3],
    threshold: { min: 70, max: 95 },
    icon: '🧠'
  },
  {
    id: 'pattern-recognition',
    name: 'Pattern Recognition',
    value: 94.7,
    unit: '%',
    trend: 'stable',
    status: 'optimal',
    history: [93, 94, 95, 94.5, 94.7],
    threshold: { min: 80, max: 98 },
    icon: '🔍'
  },
  {
    id: 'learning-rate',
    name: 'Learning Rate',
    value: 0.847,
    unit: '',
    trend: 'up',
    status: 'normal',
    history: [0.82, 0.835, 0.841, 0.844, 0.847],
    threshold: { min: 0.7, max: 1.0 },
    icon: '📈'
  },
  {
    id: 'memory-efficiency',
    name: 'Memory Efficiency',
    value: 76.2,
    unit: '%',
    trend: 'down',
    status: 'warning',
    history: [82, 80, 78, 77, 76.2],
    threshold: { min: 60, max: 90 },
    icon: '💾'
  },
  {
    id: 'response-time',
    name: 'Response Time',
    value: 127,
    unit: 'ms',
    trend: 'down',
    status: 'optimal',
    history: [145, 139, 132, 129, 127],
    threshold: { min: 0, max: 200 },
    icon: '⚡'
  },
  {
    id: 'accuracy-score',
    name: 'Accuracy Score',
    value: 96.8,
    unit: '%',
    trend: 'up',
    status: 'optimal',
    history: [95.2, 95.8, 96.1, 96.5, 96.8],
    threshold: { min: 90, max: 100 },
    icon: '🎯'
  }
];

export const NeuralAnalytics: React.FC<NeuralAnalyticsProps> = ({
  onInsightClick,
  onMetricAlert,
  autoAnalyze = true,
  className = ''
}) => {
  // State Management
  const [analyticsState, setAnalyticsState] = useState<'minimized' | 'compact' | 'expanded' | 'fullscreen'>('minimized');
  const [metrics, setMetrics] = useState<NeuralMetric[]>(defaultMetrics);
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'insights' | 'patterns'>('metrics');

  // Refs
  const analyticsRef = useRef<HTMLDivElement>(null);

  // Generate insights based on metrics
  const generateInsights = () => {
    const newInsights: AnalyticsInsight[] = [];
    
    metrics.forEach(metric => {
      // Check for anomalies
      if (metric.status === 'critical' || metric.status === 'warning') {
        newInsights.push({
          id: `alert-${metric.id}`,
          type: 'alert',
          title: `${metric.name} Alert`,
          description: `${metric.name} is ${metric.status === 'critical' ? 'critically' : ''} outside normal range: ${metric.value}${metric.unit}`,
          confidence: 0.95,
          severity: metric.status === 'critical' ? 'high' : 'medium',
          timestamp: Date.now(),
          data: metric
        });
      }
      
      // Pattern analysis
      if (metric.history.length >= 5) {
        const trend = metric.history.slice(-3).every((val, i, arr) => i === 0 || val > arr[i-1]);
        if (trend && metric.trend === 'up') {
          newInsights.push({
            id: `pattern-${metric.id}`,
            type: 'pattern',
            title: `Positive Trend Detected`,
            description: `${metric.name} shows consistent improvement over recent measurements`,
            confidence: 0.87,
            severity: 'low',
            timestamp: Date.now(),
            data: metric
          });
        }
      }
    });
    
    // System-wide insights
    const avgAccuracy = metrics.filter(m => m.unit === '%').reduce((sum, m) => sum + m.value, 0) / metrics.filter(m => m.unit === '%').length;
    
    if (avgAccuracy > 90) {
      newInsights.push({
        id: 'system-performance',
        type: 'optimization',
        title: 'System Performance Optimal',
        description: `Neural network operating at ${avgAccuracy.toFixed(1)}% average efficiency across all metrics`,
        confidence: 0.92,
        severity: 'low',
        timestamp: Date.now()
      });
    }
    
    // Predictive insights
    newInsights.push({
      id: 'prediction-performance',
      type: 'prediction',
      title: 'Performance Forecast',
      description: `Based on current trends, system performance is projected to improve by ${(Math.random() * 5 + 2).toFixed(1)}% in the next hour`,
      confidence: 0.78,
      severity: 'medium',
      timestamp: Date.now()
    });
    
    return newInsights.slice(0, 10); // Limit to 10 insights
  };

  // Update metrics with real-time data
  useEffect(() => {
    if (!autoAnalyze) return;
    
    const interval = setInterval(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => {
          const variation = (Math.random() - 0.5) * 0.1;
          const newValue = Math.max(0, metric.value + (metric.value * variation));
          const newHistory = [...metric.history.slice(-4), newValue];
          
          // Determine status based on thresholds
          let status: NeuralMetric['status'] = 'normal';
          if (metric.threshold) {
            if (metric.threshold.min && newValue < metric.threshold.min) status = 'critical';
            else if (metric.threshold.max && newValue > metric.threshold.max) status = 'critical';
            else if (metric.threshold.min && newValue < metric.threshold.min * 1.1) status = 'warning';
            else if (metric.threshold.max && newValue > metric.threshold.max * 0.9) status = 'warning';
            else if (newValue > (metric.threshold.max || 100) * 0.8) status = 'optimal';
          }
          
          // Determine trend
          let trend: NeuralMetric['trend'] = 'stable';
          if (newHistory.length >= 3) {
            const recent = newHistory.slice(-3);
            if (
              recent[0] !== undefined &&
              recent[1] !== undefined &&
              recent[2] !== undefined
            ) {
              if (recent[2] > recent[1] && recent[1] > recent[0]) trend = 'up';
              else if (recent[2] < recent[1] && recent[1] < recent[0]) trend = 'down';
            }
          }
          
          const updatedMetric = {
            ...metric,
            value: newValue,
            history: newHistory,
            status,
            trend
          };
          
          // Trigger alert if status changed to warning/critical
          if ((status === 'warning' || status === 'critical') && metric.status !== status) {
            onMetricAlert?.(updatedMetric);
          }
          
          return updatedMetric;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [autoAnalyze, onMetricAlert]);

  // Generate insights periodically
  useEffect(() => {
    if (!autoAnalyze) return;
    
    const interval = setInterval(() => {
      setIsAnalyzing(true);
      
      setTimeout(() => {
        const newInsights = generateInsights();
        setInsights(prev => {
          const combined = [...newInsights, ...prev];
          return combined.slice(0, 20); // Keep latest 20 insights
        });
        setIsAnalyzing(false);
      }, 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, [metrics, autoAnalyze]);

  // Get metric status color
  const getStatusColor = (status: NeuralMetric['status']) => {
    switch (status) {
      case 'optimal': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: NeuralMetric['trend']) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '📊';
    }
  };

  // Handle state toggle
  const toggleState = () => {
    setAnalyticsState(prev => {
      switch (prev) {
        case 'minimized': return 'compact';
        case 'compact': return 'expanded';
        case 'expanded': return 'fullscreen';
        case 'fullscreen': return 'minimized';
        default: return 'minimized';
      }
    });
  };

  return (
    <motion.div
      ref={analyticsRef}
      className={analyticsVariants({ state: analyticsState, className })}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header / Toggle Button */}
      <motion.div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={toggleState}
        whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
      >
        {analyticsState === 'minimized' ? (
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="text-2xl"
            >
              🧠
            </motion.div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: isAnalyzing ? 360 : 0 }}
                transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0 }}
                className="text-xl"
              >
                🧠
              </motion.div>
              <div>
                <h3 className="text-white font-semibold">Neural Analytics</h3>
                <p className="text-gray-400 text-xs">
                  {isAnalyzing ? 'Processing...' : `${metrics.filter(m => m.status === 'optimal').length}/${metrics.length} optimal`}
                </p>
              </div>
            </div>
            {(analyticsState === 'compact' || analyticsState === 'expanded' || analyticsState === 'fullscreen') && (
              <button
                className="text-gray-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setAnalyticsState('minimized');
                }}
              >
                ✕
              </button>
            )}
          </>
        )}
      </motion.div>

      {/* Content */}
      <AnimatePresence>
        {(analyticsState === 'compact' || analyticsState === 'expanded' || analyticsState === 'fullscreen') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-1 overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {(['metrics', 'insights', 'patterns'] as const).map(tab => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Metrics Tab */}
              {activeTab === 'metrics' && (
                <div className="space-y-3">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={metric.id}
                      className={metricVariants({ status: metric.status })}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{metric.icon}</span>
                          <div>
                            <div className="text-white text-sm font-medium">
                              {metric.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {getTrendIcon(metric.trend)} {metric.trend}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div 
                            className="text-lg font-bold"
                            style={{ color: getStatusColor(metric.status) }}
                          >
                            {typeof metric.value === 'number' 
                              ? metric.value.toFixed(metric.unit === 'ms' ? 0 : 1) 
                              : metric.value}
                            {metric.unit}
                          </div>
                        </div>
                      </div>
                      
                      {/* Mini Trend Chart */}
                      <div className="mt-2 flex items-end gap-1 h-6">
                        {metric.history.map((value, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t"
                            style={{
                              height: `${(value / Math.max(...metric.history)) * 100}%`,
                              backgroundColor: getStatusColor(metric.status),
                              opacity: 0.3 + (i / metric.history.length) * 0.7
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Insights Tab */}
              {activeTab === 'insights' && (
                <div className="space-y-3">
                  {insights.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <div className="text-4xl mb-2">🔮</div>
                      <div>Analyzing data patterns...</div>
                    </div>
                  ) : (
                    insights.map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        className="bg-gray-800 bg-opacity-50 rounded-lg p-3 border border-gray-600 hover:border-purple-500 cursor-pointer transition-all"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => onInsightClick?.(insight)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">
                                {insight.type === 'pattern' ? '🔍' :
                                 insight.type === 'anomaly' ? '⚠️' :
                                 insight.type === 'prediction' ? '🔮' :
                                 insight.type === 'optimization' ? '⚡' : '🚨'}
                              </span>
                              <h4 className="text-white text-sm font-medium">
                                {insight.title}
                              </h4>
                            </div>
                            <p className="text-gray-300 text-xs mb-2">
                              {insight.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                              <span>•</span>
                              <span className={`capitalize ${
                                insight.severity === 'high' ? 'text-red-400' :
                                insight.severity === 'medium' ? 'text-yellow-400' :
                                'text-green-400'
                              }`}>
                                {insight.severity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* Patterns Tab */}
              {activeTab === 'patterns' && (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-2">🎯</div>
                  <div>Pattern analysis in development</div>
                  <div className="text-xs mt-2">Advanced neural pattern recognition coming soon</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NeuralAnalytics;
