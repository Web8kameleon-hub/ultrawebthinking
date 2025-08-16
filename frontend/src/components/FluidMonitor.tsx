/**
 * FLUID FLOW MONITOR - Natural Water-like Interface
 * Real-time monitoring of fluid architecture with beautiful animations
 *
 * @version 8.0.0-FLUID-WEB8
 * @author Ledjan Ahmati
 */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';
import styles from './FluidMonitor.module.css';

interface FlowMetrics {
  timestamp: number;
  globalFlow: {
    turbulence: number;
    clarity: number;
    velocity: number;
    pressure: number;
    temperature: string;
  };
  streams: Array<{
    name: string;
    type: string;
    velocity: number;
    clarity: number;
    obstacles: number;
    state: string;
    health: number;
  }>;
  recommendations: string[];
  waterQuality: string;
}

const streamVariants = cva(styles.streamCard, {
  variants: {
    health: {
      excellent: styles.streamExcellent,
      good: styles.streamGood,
      fair: styles.streamFair,
      poor: styles.streamPoor
    },
    state: {
      flowing: styles.streamFlowing,
      turbulent: styles.streamTurbulent,
      blocked: styles.streamBlocked,
      idle: styles.streamIdle
    }
  },
  defaultVariants: {
    health: "good",
    state: "flowing"
  }
});

export default function FluidMonitor() {
  const [flowMetrics, setFlowMetrics] = useState<FlowMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsConnected(true);
    fetchFlowMetrics();
    const interval = setInterval(fetchFlowMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (flowMetrics && canvasRef.current) {
      drawWaterFlow();
    }
  }, [flowMetrics]);

  const fetchFlowMetrics = async () => {
    const mockMetrics: FlowMetrics = {
      timestamp: Date.now(),
      globalFlow: {
        turbulence: Math.random() * 100,
        clarity: 85 + Math.random() * 15,
        velocity: Math.random() * 10 + 5,
        pressure: Math.random() * 50 + 50,
        temperature: `${(Math.random() * 10 + 15).toFixed(1)}°C`
      },
      streams: Array.from({ length: 5 }, (_, i) => ({
        name: ['Primary Flow', 'Secondary Channel', 'Data Stream', 'Processing Pipeline', 'Output Channel'][i],
        type: ['input', 'processing', 'data', 'computation', 'output'][i],
        velocity: Math.random() * 10 + 2,
        clarity: Math.random() * 100,
        obstacles: Math.floor(Math.random() * 5),
        state: ['flowing', 'turbulent', 'blocked', 'idle'][Math.floor(Math.random() * 4)],
        health: Math.random() * 100
      })),
      recommendations: Math.random() > 0.7 ? [
        'Optimize primary flow for better performance',
        'Clear obstacles in processing pipeline',
        'Monitor temperature fluctuations'
      ] : [],
      waterQuality: ['crystal', 'clear', 'slightly_turbid', 'turbid'][Math.floor(Math.random() * 4)]
    };
    setFlowMetrics(mockMetrics);
  };

  const drawWaterFlow = () => {
    const canvas = canvasRef.current;
    if (!canvas || !flowMetrics) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw flowing water background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#e3f2fd');
    gradient.addColorStop(0.5, '#bbdefb');
    gradient.addColorStop(1, '#90caf9');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw flowing streams
    flowMetrics.streams.forEach((stream, index) => {
      const y = 50 + index * 60;
      const streamWidth = (stream.velocity / 15) * canvas.width;
      
      // Stream background
      ctx.fillStyle = stream.state === 'flowing' ? '#2196f3' : 
                     stream.state === 'turbulent' ? '#ff9800' : 
                     stream.state === 'blocked' ? '#f44336' : '#9e9e9e';
      ctx.globalAlpha = 0.3;
      ctx.fillRect(10, y, streamWidth, 30);
      ctx.globalAlpha = 1;

      // Stream particles/bubbles
      for (let i = 0; i < 5; i++) {
        const x = 20 + (i * streamWidth / 5) + Math.sin(Date.now() / 1000 + i) * 10;
        const bubbleY = y + 15 + Math.sin(Date.now() / 800 + i * 2) * 5;
        
        ctx.beginPath();
        ctx.arc(x, bubbleY, 3 + Math.sin(Date.now() / 600 + i) * 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Stream label
      ctx.fillStyle = '#1565c0';
      ctx.font = '12px Arial';
      ctx.fillText(stream.name, 15, y - 5);
    });
  };

  const getHealthCategory = (health: number): 'excellent' | 'good' | 'fair' | 'poor' => {
    if (health >= 90) return 'excellent';
    if (health >= 75) return 'good';
    if (health >= 50) return 'fair';
    return 'poor';
  };

  if (!flowMetrics) {
    return (
      <div className={styles.fluidMonitor}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <div>Connecting to Fluid Architecture...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.fluidMonitor}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.container}
      >
        {/* Header */}
        <div className={styles.header}>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.title}
          >
            💧 Fluid Flow Monitor
          </motion.h1>
          <div className={styles.waterQuality}>
            <span className={styles.qualityLabel}>Water Quality:</span>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${styles.qualityValue} ${styles[flowMetrics.waterQuality]}`}
            >
              {flowMetrics.waterQuality.replace('_', ' ')}
            </motion.span>
          </div>
        </div>

        {/* Global Metrics */}
        <div className={styles.globalMetrics}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={styles.metricCard}
          >
            <div className={styles.metricValue}>{flowMetrics.globalFlow.turbulence.toFixed(1)}%</div>
            <div className={styles.metricLabel}>Turbulence</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={styles.metricCard}
          >
            <div className={styles.metricValue}>{flowMetrics.globalFlow.clarity.toFixed(1)}%</div>
            <div className={styles.metricLabel}>Clarity</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={styles.metricCard}
          >
            <div className={styles.metricValue}>{flowMetrics.globalFlow.velocity.toFixed(1)} m/s</div>
            <div className={styles.metricLabel}>Velocity</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className={styles.metricCard}
          >
            <div className={styles.metricValue}>{flowMetrics.globalFlow.pressure.toFixed(0)} kPa</div>
            <div className={styles.metricLabel}>Pressure</div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Flow Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={styles.visualizationPanel}
          >
            <h3 className={styles.panelTitle}>🌊 Flow Visualization</h3>
            <canvas
              ref={canvasRef}
              width={500}
              height={350}
              className={styles.flowCanvas}
            />
          </motion.div>

          {/* Stream Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className={styles.streamsPanel}
          >
            <h3 className={styles.panelTitle}>🔄 Stream Health</h3>
            <div className={styles.streamsList}>
              <AnimatePresence>
                {flowMetrics.streams.map((stream, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className={streamVariants({ 
                      health: getHealthCategory(stream.health),
                      state: stream.state as any
                    })}
                  >
                    <div className={styles.streamHeader}>
                      <span className={styles.streamName}>{stream.name}</span>
                      <span className={styles.streamType}>{stream.type}</span>
                    </div>
                    <div className={styles.streamMetrics}>
                      <div className={styles.streamMetric}>
                        <span>Health:</span>
                        <span className={
                          stream.health >= 80 ? styles.healthGood :
                          stream.health >= 60 ? styles.healthWarning : styles.healthDanger
                        }>
                          {stream.health.toFixed(1)}%
                        </span>
                      </div>
                      <div className={styles.streamMetric}>
                        <span>Velocity:</span>
                        <span>{stream.velocity.toFixed(1)} m/s</span>
                      </div>
                      <div className={styles.streamMetric}>
                        <span>Clarity:</span>
                        <span>{stream.clarity.toFixed(1)}%</span>
                      </div>
                      <div className={styles.streamMetric}>
                        <span>Obstacles:</span>
                        <span>{stream.obstacles}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        {flowMetrics.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={styles.recommendationsPanel}
          >
            <h3 className={styles.panelTitle}>💡 Flow Optimization Recommendations</h3>
            <div className={styles.recommendationsList}>
              {flowMetrics.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.recommendationItem}
                >
                  <span className={styles.recommendationIcon}>🔧</span>
                  <span className={styles.recommendationText}>{rec}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={styles.footer}
        >
          <p>Fluid Architecture Monitor v8.0.0-FLUID-WEB8 • Real-time Flow Analysis</p>
          <p>Temperature: {flowMetrics.globalFlow.temperature} • Last Update: {new Date().toLocaleString()}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
