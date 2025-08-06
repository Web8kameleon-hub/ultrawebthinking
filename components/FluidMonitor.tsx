/**
 * FLUID FLOW MONITOR - Natural Water-like Interface
 * Real-time monitoring of fluid architecture with beautiful animations
 * 
 * @version 8.0.0-FLUID
 * @author Ledjan Ahmati
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
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

export const FluidMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<FlowMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Fetch flow metrics
  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/fluid/flow');
      const result = await response.json();
      
      if (result.success) {
        setMetrics(result.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching flow metrics:', error);
    }
  };

  // Auto-refresh metrics
  useEffect(() => {
    fetchMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 2000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Animate water flow on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !metrics) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationTime = 0;

    const animate = () => {
      animationTime += 0.02;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw water flow animation
      drawWaterFlow(ctx, canvas.width, canvas.height, animationTime, metrics);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [metrics]);

  // Control flow functions
  const boostVelocity = async (streamName: string) => {
    try {
      const response = await fetch('/api/fluid/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'boost_velocity',
          stream: streamName,
          value: 10
        })
      });
      
      if (response.ok) {
        fetchMetrics(); // Refresh
      }
    } catch (error) {
      console.error('Error boosting velocity:', error);
    }
  };

  const removeObstacle = async (streamName: string, obstacle: string) => {
    try {
      const response = await fetch('/api/fluid/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove_obstacle',
          stream: streamName,
          obstacle
        })
      });
      
      if (response.ok) {
        fetchMetrics(); // Refresh
      }
    } catch (error) {
      console.error('Error removing obstacle:', error);
    }
  };

  const resetFlow = async () => {
    try {
      const response = await fetch('/api/fluid/flow', {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchMetrics(); // Refresh
      }
    } catch (error) {
      console.error('Error resetting flow:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.waterSpinner}></div>
        <p>Analyzing water flow patterns...</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={styles.errorContainer}>
        <p>Unable to connect to fluid flow system</p>
        <button onClick={fetchMetrics} className={styles.retryButton}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className={styles.fluidMonitor}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          🌊 Fluid Architecture Monitor
        </h1>
        <div className={styles.waterQuality}>
          <span className={styles.qualityLabel}>Water Quality:</span>
          <span className={`${styles.qualityValue} ${styles[metrics.waterQuality.toLowerCase().replace(' ', '')]}`}>
            {metrics.waterQuality}
          </span>
        </div>
      </div>

      {/* Global Flow Status */}
      <div className={styles.globalFlow}>
        <h2>🌊 Global Flow State</h2>
        <div className={styles.flowMetrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Clarity</span>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${metrics.globalFlow.clarity}%` }}
              ></div>
            </div>
            <span className={styles.metricValue}>{metrics.globalFlow.clarity.toFixed(1)}%</span>
          </div>
          
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Velocity</span>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${metrics.globalFlow.velocity}%` }}
              ></div>
            </div>
            <span className={styles.metricValue}>{metrics.globalFlow.velocity.toFixed(1)}%</span>
          </div>
          
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Turbulence</span>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${styles.turbulence}`}
                style={{ width: `${Math.min(100, metrics.globalFlow.turbulence * 20)}%` }}
              ></div>
            </div>
            <span className={styles.metricValue}>{metrics.globalFlow.turbulence.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Water Flow Visualization */}
      <div className={styles.visualizationContainer}>
        <h2>💧 Flow Visualization</h2>
        <canvas 
          ref={canvasRef}
          width={800}
          height={300}
          className={styles.flowCanvas}
        />
      </div>

      {/* Flow Streams */}
      <div className={styles.flowStreams}>
        <h2>🚿 Flow Streams</h2>
        <div className={styles.streamsList}>
          {metrics.streams.map((stream, index) => (
            <div key={index} className={styles.streamCard}>
              <div className={styles.streamHeader}>
                <h3>{stream.name}</h3>
                <span className={`${styles.streamState} ${styles[stream.state]}`}>
                  {stream.state}
                </span>
              </div>
              
              <div className={styles.streamMetrics}>
                <div className={styles.streamMetric}>
                  <span>Velocity: {stream.velocity}%</span>
                  <div className={styles.miniProgress}>
                    <div style={{ width: `${stream.velocity}%` }}></div>
                  </div>
                </div>
                
                <div className={styles.streamMetric}>
                  <span>Clarity: {stream.clarity}%</span>
                  <div className={styles.miniProgress}>
                    <div style={{ width: `${stream.clarity}%` }}></div>
                  </div>
                </div>
                
                <div className={styles.streamMetric}>
                  <span>Health: {stream.health.toFixed(1)}%</span>
                  <div className={styles.miniProgress}>
                    <div style={{ width: `${stream.health}%` }}></div>
                  </div>
                </div>
              </div>
              
              {stream.obstacles > 0 && (
                <div className={styles.obstacles}>
                  <span className={styles.obstacleCount}>
                    ⚠️ {stream.obstacles} obstacles detected
                  </span>
                </div>
              )}
              
              <div className={styles.streamActions}>
                <button 
                  onClick={() => boostVelocity(stream.type)}
                  className={styles.boostButton}
                >
                  ⚡ Boost
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {metrics.recommendations.length > 0 && (
        <div className={styles.recommendations}>
          <h2>💡 Flow Recommendations</h2>
          <ul className={styles.recommendationsList}>
            {metrics.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        <button 
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`${styles.controlButton} ${autoRefresh ? styles.active : ''}`}
        >
          {autoRefresh ? '⏸️ Pause' : '▶️ Resume'} Auto-Refresh
        </button>
        
        <button 
          onClick={fetchMetrics}
          className={styles.controlButton}
        >
          🔄 Refresh Now
        </button>
        
        <button 
          onClick={resetFlow}
          className={`${styles.controlButton} ${styles.resetButton}`}
        >
          🚨 Emergency Reset
        </button>
      </div>
    </div>
  );
};

// Water flow animation function
function drawWaterFlow(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  time: number, 
  metrics: FlowMetrics
) {
  const centerY = height / 2;
  const amplitude = 30;
  const frequency = 0.02;
  const speed = metrics.globalFlow.velocity * 0.01;
  
  // Create gradient based on water quality
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  
  switch (metrics.waterQuality) {
    case 'Crystal Clear':
      gradient.addColorStop(0, 'rgba(135, 206, 250, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 191, 255, 0.8)');
      break;
    case 'Pure':
      gradient.addColorStop(0, 'rgba(176, 224, 230, 0.8)');
      gradient.addColorStop(1, 'rgba(135, 206, 250, 0.8)');
      break;
    default:
      gradient.addColorStop(0, 'rgba(105, 105, 105, 0.6)');
      gradient.addColorStop(1, 'rgba(169, 169, 169, 0.6)');
  }
  
  ctx.fillStyle = gradient;
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;
  
  // Draw flowing water wave
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  
  for (let x = 0; x <= width; x += 2) {
    const y = centerY + Math.sin(x * frequency + time * speed) * amplitude;
    ctx.lineTo(x, y);
  }
  
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  
  // Draw flow particles
  for (let i = 0; i < 20; i++) {
    const x = (time * speed * 50 + i * 40) % (width + 40) - 40;
    const y = centerY + Math.sin(x * frequency + time * speed) * amplitude + Math.random() * 20 - 10;
    
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();
  }
}

export default FluidMonitor;
