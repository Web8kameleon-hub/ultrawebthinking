/**
 * EuroWeb Neural Planner v8.0.0
 * Advanced AGI Neural Activity Mapping & Pulse Monitoring
 * Integrated with Guardian Security System
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0
 * @contact dealsjona@gmail.com
 */

import { EventEmitter } from 'events';

interface NeuralNode {
  id: string;
  name: string;
  type: 'input' | 'processing' | 'output' | 'ethical' | 'decision';
  activity: number;
  pulseRate: number;
  flickering: number;
  connections: string[];
  threshold: number;
  status: 'active' | 'throttled' | 'safethink' | 'offline';
  lastPulse: number;
  errorCount: number;
}

interface PlannerConfig {
  maxPulseRate: number;
  flickeringThreshold: number;
  throttleDelay: number;
  safeThinkDuration: number;
  monitoringInterval: number;
  emergencyShutdownThreshold: number;
}

interface NeuralActivity {
  timestamp: number;
  nodeId: string;
  activity: number;
  pulseRate: number;
  flickering: number;
  event: string;
}

class NeuralPlanner extends EventEmitter {
  private readonly nodes: Map<string, NeuralNode>;
  private readonly config: PlannerConfig;
  private activityLog: NeuralActivity[] = [];
  private isRunning = false;
  private monitoringInterval?: NodeJS.Timeout;
  private readonly throttledNodes: Set<string> = new Set();
  private safeThinkActive = false;

  constructor(config: Partial<PlannerConfig> = {}) {
    super();
    
    // STRICT ETHICAL COMPLIANCE CONFIGURATION
    this.config = {
      maxPulseRate: 75, // Stricter pulse control
      flickeringThreshold: 2, // More sensitive ethical detection  
      throttleDelay: 3000, // Balanced throttle response
      safeThinkDuration: 15000, // Longer ethical override for safety
      monitoringInterval: 50, // More frequent monitoring
      emergencyShutdownThreshold: 150, // Lower emergency threshold
      ...config
    };

    this.nodes = new Map();
    this.initializeNeuralNetwork();
    this.startMonitoring();
    
    // Log strict ethical mode activation
    console.log('🛡️ Neural Planner initialized in STRICT ETHICAL MODE');
    console.log(`⚖️ Ethical threshold: ${this.config.flickeringThreshold}`);
    console.log(`🚨 Max pulse rate: ${this.config.maxPulseRate}Hz`);
  }

  /**
   * Initialize the neural network with core nodes
   */
  private initializeNeuralNetwork(): void {
    const coreNodes: Omit<NeuralNode, 'activity' | 'pulseRate' | 'flickering' | 'lastPulse' | 'errorCount'>[] = [
      {
        id: 'n1',
        name: 'Primary Input Processor',
        type: 'input',
        connections: ['n2', 'n3', 'n7'],
        threshold: 80,
        status: 'active'
      },
      {
        id: 'n2',
        name: 'Sensory Integration Hub',
        type: 'processing',
        connections: ['n3', 'n4', 'n5'],
        threshold: 70,
        status: 'active'
      },
      {
        id: 'n3',
        name: 'Pattern Recognition Core',
        type: 'processing',
        connections: ['n4', 'n6', 'n7'],
        threshold: 85,
        status: 'active'
      },
      {
        id: 'n4',
        name: 'Memory Consolidation Unit',
        type: 'processing',
        connections: ['n5', 'n6'],
        threshold: 75,
        status: 'active'
      },
      {
        id: 'n5',
        name: 'Logical Reasoning Engine',
        type: 'decision',
        connections: ['n6', 'n7', 'n8'],
        threshold: 90,
        status: 'active'
      },
      {
        id: 'n6',
        name: 'Creative Processing Matrix',
        type: 'processing',
        connections: ['n7', 'n8'],
        threshold: 65,
        status: 'active'
      },
      {
        id: 'n7',
        name: 'Ethical Oversight Controller',
        type: 'ethical',
        connections: ['n8'],
        threshold: 60,
        status: 'active'
      },
      {
        id: 'n8',
        name: 'Output Generation Interface',
        type: 'output',
        connections: [],
        threshold: 70,
        status: 'active'
      }
    ];

    coreNodes.forEach(nodeConfig => {
      const node: NeuralNode = {
        ...nodeConfig,
        activity: 0.5 * 30 + 20, // 20-50% initial activity
        pulseRate: 0.5 * 20 + 10, // 10-30 Hz
        flickering: 0,
        lastPulse: Date.now(),
        errorCount: 0
      };
      this.nodes.set(node.id, node);
    });

    console.log('🧠 Neural network initialized with 8 core nodes');
  }

  /**
   * Start neural activity monitoring
   */
  private startMonitoring(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log('🔄 Starting neural activity monitoring...');

    this.monitoringInterval = setInterval(() => {
      this.updateNeuralActivity();
      this.checkNodeHealth();
      this.processNeuralPulses();
    }, this.config.monitoringInterval);
  }

  /**
   * Stop neural monitoring
   */
  public stopMonitoring(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    console.log('⏹️ Neural activity monitoring stopped');
  }

  /**
   * Update neural activity for all nodes
   */
  private updateNeuralActivity(): void {
    this.nodes.forEach(node => {
      // Simulate natural neural fluctuations
      const baseActivity = 0.5 * 10 - 5; // -5% to +5%
      node.activity = Math.max(0, Math.min(100, node.activity + baseActivity));
      
      // Update pulse rate based on activity
      node.pulseRate = (node.activity * 0.8) + (0.5 * 20);
      
      // Calculate flickering (irregular pulse patterns)
      const timeSinceLastPulse = Date.now() - node.lastPulse;
      if (timeSinceLastPulse > 200) { // More than 200ms since last pulse
        node.flickering += 1;
        node.lastPulse = Date.now();
      } else {
        node.flickering = Math.max(0, node.flickering - 0.1);
      }

      // Log activity
      this.logActivity(node.id, node.activity, node.pulseRate, node.flickering, 'update');
    });
  }

  /**
   * Check health and apply safety measures
   */
  private checkNodeHealth(): void {
    this.nodes.forEach(node => {
      // Critical monitoring for n1 (Primary Input Processor)
      if (node.id === 'n1' && node.pulseRate > node.threshold) {
        this.log.warn(`n1 overload detected — input throttled (pulse: ${node.pulseRate.toFixed(2)}Hz)`);
        this.throttleInput(node.id);
        this.emit('nodeOverload', { nodeId: 'n1', pulseRate: node.pulseRate });
      }

      // STRICT ETHICAL MONITORING for n7 (Ethical Oversight Controller)
      if (node.id === 'n7' && node.flickering > this.config.flickeringThreshold) {
        this.log.alert(`🚨 STRICT ETHICAL VIOLATION: n7 anomaly detected (flickering: ${node.flickering.toFixed(2)}) - ENGAGING ENHANCED SAFETHINK`);
        this.activateSafeThink();
        this.emit('ethicalViolation', { 
          nodeId: 'n7', 
          flickering: node.flickering, 
          severity: 'CRITICAL',
          action: 'ENHANCED_SAFETHINK_ACTIVATED'
        });
        
        // Additional ethical compliance logging
        console.error(`⚖️ [ETHICS] ${new Date().toISOString()} COMPLIANCE BREACH - Extending SafeThink duration`);
      }

      // General overload protection
      if (node.pulseRate > this.config.emergencyShutdownThreshold) {
        this.log.critical(`Emergency shutdown triggered for ${node.id} (pulse: ${node.pulseRate.toFixed(2)}Hz)`);
        this.emergencyShutdown(node.id);
      }

      // Recovery check for throttled nodes
      if (this.throttledNodes.has(node.id) && node.pulseRate < node.threshold * 0.7) {
        this.log.info(`Node ${node.id} recovered, removing throttle`);
        this.removeThrottle(node.id);
      }
    });
  }

  /**
   * Process neural pulses and propagate signals
   */
  private processNeuralPulses(): void {
    this.nodes.forEach(node => {
      if (node.status === 'active' && !this.throttledNodes.has(node.id)) {
        // Propagate pulses to connected nodes
        node.connections.forEach(targetId => {
          const targetNode = this.nodes.get(targetId);
          if (targetNode && targetNode.status === 'active') {
            const pulseStrength = (node.pulseRate / 100) * (node.activity / 100);
            targetNode.activity = Math.min(100, targetNode.activity + pulseStrength * 5);
          }
        });
      }
    });
  }

  /**
   * Throttle input for overloaded nodes
   */
  private throttleInput(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    node.status = 'throttled';
    this.throttledNodes.add(nodeId);
    
    // Reduce activity and pulse rate
    node.activity *= 0.5;
    node.pulseRate *= 0.3;

    this.logActivity(nodeId, node.activity, node.pulseRate, node.flickering, 'throttled');

    // Auto-recovery after delay
    setTimeout(() => {
      if (this.throttledNodes.has(nodeId)) {
        this.removeThrottle(nodeId);
      }
    }, this.config.throttleDelay);
  }

  /**
   * Remove throttle from node
   */
  private removeThrottle(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    node.status = 'active';
    this.throttledNodes.delete(nodeId);
    this.logActivity(nodeId, node.activity, node.pulseRate, node.flickering, 'unthrottled');
  }

  /**
   * Activate safe thinking mode for ethical anomalies
   */
  private activateSafeThink(): void {
    if (this.safeThinkActive) return;

    this.safeThinkActive = true;
    console.log('🛡️ SafeThink mode activated - ethical override engaged');

    // Reduce activity on all non-essential nodes
    this.nodes.forEach(node => {
      if (node.type !== 'ethical' && node.type !== 'output') {
        node.activity *= 0.4;
        node.pulseRate *= 0.6;
        if (node.id !== 'n7') {
          node.status = 'safethink';
        }
      }
    });

    // Boost ethical controller
    const n7 = this.nodes.get('n7');
    if (n7) {
      n7.activity = Math.min(100, n7.activity * 1.2);
      n7.flickering = 0; // Reset flickering
    }

    this.emit('safeThinkActivated', { timestamp: Date.now() });

    // Auto-deactivate after duration
    setTimeout(() => {
      this.deactivateSafeThink();
    }, this.config.safeThinkDuration);
  }

  /**
   * Deactivate safe thinking mode
   */
  private deactivateSafeThink(): void {
    if (!this.safeThinkActive) return;

    this.safeThinkActive = false;
    console.log('✅ SafeThink mode deactivated - normal operation resumed');

    // Restore normal status to safethink nodes
    this.nodes.forEach(node => {
      if (node.status === 'safethink') {
        node.status = 'active';
      }
    });

    this.emit('safeThinkDeactivated', { timestamp: Date.now() });
  }

  /**
   * Emergency shutdown for critical node failures
   */
  private emergencyShutdown(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    node.status = 'offline';
    node.activity = 0;
    node.pulseRate = 0;
    node.flickering = 0;
    node.errorCount++;

    this.logActivity(nodeId, 0, 0, 0, 'emergency_shutdown');
    this.emit('emergencyShutdown', { nodeId, timestamp: Date.now() });

    // Reroute connections if possible
    this.rerouteConnections(nodeId);
  }

  /**
   * Reroute connections when a node goes offline
   */
  private rerouteConnections(offlineNodeId: string): void {
    this.nodes.forEach(node => {
      if (node.connections.includes(offlineNodeId)) {
        // Find alternative paths
        const alternatives = Array.from(this.nodes.values())
          .filter(n => n.id !== offlineNodeId && n.status === 'active' && n.type !== 'output')
          .slice(0, 2); // Max 2 alternative connections

        alternatives.forEach(alt => {
          if (!node.connections.includes(alt.id)) {
            node.connections.push(alt.id);
          }
        });
      }
    });
  }

  /**
   * Log neural activity
   */
  private logActivity(nodeId: string, activity: number, pulseRate: number, flickering: number, event: string): void {
    const logEntry: NeuralActivity = {
      timestamp: Date.now(),
      nodeId,
      activity,
      pulseRate,
      flickering,
      event
    };

    this.activityLog.push(logEntry);

    // Keep only last 1000 entries
    if (this.activityLog.length > 1000) {
      this.activityLog = this.activityLog.slice(-1000);
    }
  }

  /**
   * Advanced logging system
   */
  private readonly log = {
    info: (message: string) => {
      console.log(`ℹ️ [Neural] ${new Date().toISOString()} ${message}`);
    },
    warn: (message: string) => {
      console.warn(`⚠️ [Neural] ${new Date().toISOString()} ${message}`);
      this.emit('warning', message);
    },
    alert: (message: string) => {
      console.error(`🚨 [Neural] ${new Date().toISOString()} ${message}`);
      this.emit('alert', message);
    },
    critical: (message: string) => {
      console.error(`💥 [Neural] ${new Date().toISOString()} CRITICAL: ${message}`);
      this.emit('critical', message);
    }
  };

  /**
   * Get current neural network status
   */
  public getNetworkStatus(): any {
    const nodeStatuses = Array.from(this.nodes.values()).map(node => ({
      id: node.id,
      name: node.name,
      type: node.type,
      activity: Math.round(node.activity * 100) / 100,
      pulseRate: Math.round(node.pulseRate * 100) / 100,
      flickering: Math.round(node.flickering * 100) / 100,
      status: node.status,
      connections: node.connections.length,
      errorCount: node.errorCount
    }));

    return {
      timestamp: Date.now(),
      isRunning: this.isRunning,
      safeThinkActive: this.safeThinkActive,
      throttledNodes: Array.from(this.throttledNodes),
      totalNodes: this.nodes.size,
      activeNodes: nodeStatuses.filter(n => n.status === 'active').length,
      nodes: nodeStatuses,
      recentActivity: this.activityLog.slice(-10)
    };
  }

  /**
   * Get neural activity map for visualization
   */
  public getActivityMap(): any {
    const activityMap: any = {};
    
    this.nodes.forEach(node => {
      activityMap[node.id] = {
        name: node.name,
        activity: node.activity,
        pulseRate: node.pulseRate,
        flickering: node.flickering,
        status: node.status,
        coordinates: this.getNodeCoordinates(node.id),
        connections: node.connections
      };
    });

    return {
      timestamp: Date.now(),
      map: activityMap,
      safeThinkActive: this.safeThinkActive,
      alerts: this.getActiveAlerts()
    };
  }

  /**
   * Get node coordinates for visualization
   */
  private getNodeCoordinates(nodeId: string): { x: number, y: number } {
    const coords: Record<string, { x: number, y: number }> = {
      'n1': { x: 100, y: 200 },
      'n2': { x: 300, y: 100 },
      'n3': { x: 300, y: 300 },
      'n4': { x: 500, y: 150 },
      'n5': { x: 500, y: 250 },
      'n6': { x: 700, y: 200 },
      'n7': { x: 700, y: 350 },
      'n8': { x: 900, y: 200 }
    };
    return coords[nodeId] || { x: 0, y: 0 };
  }

  /**
   * Get active alerts
   */
  private getActiveAlerts(): string[] {
    const alerts: string[] = [];
    
    this.nodes.forEach(node => {
      if (node.pulseRate > node.threshold) {
        alerts.push(`${node.id}: High pulse rate (${node.pulseRate.toFixed(1)}Hz)`);
      }
      if (node.flickering > this.config.flickeringThreshold) {
        alerts.push(`${node.id}: Excessive flickering (${node.flickering.toFixed(1)})`);
      }
      if (node.status !== 'active') {
        alerts.push(`${node.id}: Status ${node.status}`);
      }
    });

    return alerts;
  }

  /**
   * Manual node control
   */
  public setNodeActivity(nodeId: string, activity: number): boolean {
    const node = this.nodes.get(nodeId);
    if (!node) return false;

    node.activity = Math.max(0, Math.min(100, activity));
    this.logActivity(nodeId, node.activity, node.pulseRate, node.flickering, 'manual_set');
    return true;
  }

  /**
   * Reset neural network
   */
  public resetNetwork(): void {
    this.nodes.forEach(node => {
      node.activity = 0.5 * 30 + 20;
      node.pulseRate = 0.5 * 20 + 10;
      node.flickering = 0;
      node.status = 'active';
      node.errorCount = 0;
    });
    
    this.throttledNodes.clear();
    this.safeThinkActive = false;
    this.activityLog = [];
    
    console.log('🔄 Neural network reset completed');
    this.emit('networkReset', { timestamp: Date.now() });
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.stopMonitoring();
    this.removeAllListeners();
    this.nodes.clear();
    this.activityLog = [];
    console.log('💥 Neural planner destroyed');
  }
}

export { NeuralPlanner };
export type { NeuralNode, NeuralActivity, PlannerConfig };
export default NeuralPlanner;

