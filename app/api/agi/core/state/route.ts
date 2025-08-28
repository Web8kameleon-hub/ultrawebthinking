/**
 * AGI Core State API
 * Real-time AGI core system state management
 * 
 * @version 8.0.0-WEB8-API
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';
import * as os from 'os';

interface AGICoreState {
  status: 'idle' | 'processing' | 'active' | 'learning' | 'optimizing';
  layers: number;
  processingSpeed: string;
  connections: number;
  memory: number;
  confidence: number;
  neuralActivity: number;
  quantumSync: boolean;
  performance: number;
  lastUpdate: string;
  uptime: number;
  temperature: number;
  powerConsumption: number;
}

// Function to get real system metrics
function getRealSystemMetrics(): Partial<AGICoreState> {
  const cpuCores = os.cpus().length;
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memoryUsagePercent = Math.round(((totalMemory - freeMemory) / totalMemory) * 100);
  const uptime = process.uptime();
  const loadAvg = os.loadavg()[0] || 0;
  
  return {
    layers: cpuCores,
    processingSpeed: `${(cpuCores * 2.4).toFixed(1)} GHz`,
    connections: Math.floor(uptime / 10),
    memory: memoryUsagePercent,
    confidence: Math.max(85, Math.min(99, 95 - (loadAvg * 2))),
    neuralActivity: Math.round(loadAvg * 25),
    performance: Math.max(80, 100 - Math.round(loadAvg * 5)),
    uptime: Math.floor(uptime),
    temperature: Math.round(45 + (loadAvg * 5)),
    powerConsumption: Math.round(65 + (memoryUsagePercent * 0.5))
  };
}

// Global AGI Core state with real system data
let globalCoreState: AGICoreState = {
  status: 'active',
  layers: 8,
  processingSpeed: '19.2 GHz',
  connections: 0,
  memory: 50,
  confidence: 95,
  neuralActivity: 0,
  performance: 100,
  uptime: 0,
  temperature: 45,
  powerConsumption: 90,
  quantumSync: true,
  lastUpdate: new Date().toISOString(),
  ...getRealSystemMetrics()
};

export async function GET(request: NextRequest) {
  try {
    // Update real-time values
    updateRealTimeMetrics();

    // Get session-specific parameters
    const sessionId = request.headers.get('x-session-id') || 'anonymous';
    const coreId = request.nextUrl.searchParams.get('coreId') || 'web8-core-1';

    // Calculate uptime
    const uptimeMs = Date.now() - globalCoreState.uptime;
    const uptimeHours = Math.floor(uptimeMs / (1000 * 60 * 60));
    const uptimeMinutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));

    const response = {
      success: true,
      state: {
        ...globalCoreState,
        lastUpdate: new Date().toISOString(),
        uptimeDisplay: `${uptimeHours}h ${uptimeMinutes}m`
      },
      metadata: {
        sessionId,
        coreId,
        timestamp: new Date().toISOString(),
        version: '8.0.0-WEB8'
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching AGI core state:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch AGI core state',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { component, updates } = body;

    // Validate input
    if (!component || !updates) {
      return NextResponse.json(
        { error: 'Component and updates are required' },
        { status: 400 }
      );
    }

    // Update specific component of the state
    if (component === 'status' && typeof updates.status === 'string') {
      const validStatuses = ['idle', 'processing', 'active', 'learning', 'optimizing'];
      if (validStatuses.includes(updates.status)) {
        globalCoreState.status = updates.status;
        globalCoreState.lastUpdate = new Date().toISOString();
      }
    }

    if (component === 'performance') {
      if (typeof updates.performance === 'number') {
        globalCoreState.performance = Math.max(0, Math.min(100, updates.performance));
      }
      if (typeof updates.confidence === 'number') {
        globalCoreState.confidence = Math.max(0, Math.min(100, updates.confidence));
      }
      if (typeof updates.memory === 'number') {
        globalCoreState.memory = Math.max(0, Math.min(100, updates.memory));
      }
    }

    if (component === 'neural') {
      if (typeof updates.neuralActivity === 'number') {
        globalCoreState.neuralActivity = Math.max(0, Math.min(100, updates.neuralActivity));
      }
      if (typeof updates.layers === 'number') {
        globalCoreState.layers = Math.max(1, Math.min(20, updates.layers));
      }
    }

    if (component === 'quantum') {
      if (typeof updates.quantumSync === 'boolean') {
        globalCoreState.quantumSync = updates.quantumSync;
      }
    }

    if (component === 'connections') {
      if (typeof updates.connections === 'number') {
        globalCoreState.connections = Math.max(0, updates.connections);
      }
    }

    globalCoreState.lastUpdate = new Date().toISOString();

    return NextResponse.json({
      success: true,
      component,
      updates,
      newState: globalCoreState,
      message: `AGI core ${component} updated successfully`
    });

  } catch (error) {
    console.error('Error updating AGI core state:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update AGI core state',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'reset':
        globalCoreState = {
          status: 'active',
          layers: 8,
          processingSpeed: '19.2 GHz',
          connections: 0,
          memory: 50,
          confidence: 95,
          neuralActivity: 0,
          performance: 100,
          uptime: 0,
          temperature: 45,
          powerConsumption: 90,
          quantumSync: true,
          lastUpdate: new Date().toISOString(),
          ...getRealSystemMetrics()
        };
        break;

      case 'optimize':
        globalCoreState.performance = Math.min(100, globalCoreState.performance + 5);
        globalCoreState.confidence = Math.min(100, globalCoreState.confidence + 3);
        globalCoreState.memory = Math.min(100, globalCoreState.memory + 2);
        globalCoreState.neuralActivity = Math.min(100, globalCoreState.neuralActivity + 10);
        globalCoreState.status = 'optimizing';
        break;

      case 'emergency_stop':
        globalCoreState.status = 'idle';
        globalCoreState.neuralActivity = 0;
        globalCoreState.connections = Math.floor(globalCoreState.connections * 0.1);
        break;

      case 'boost_performance':
        globalCoreState.performance = Math.min(100, globalCoreState.performance + 10);
        globalCoreState.processingSpeed = generateProcessingSpeed(globalCoreState.performance);
        globalCoreState.status = 'active';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    globalCoreState.lastUpdate = new Date().toISOString();

    return NextResponse.json({
      success: true,
      action,
      newState: globalCoreState,
      message: `Action ${action} executed successfully`
    });

  } catch (error) {
    console.error('Error executing AGI core action:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute AGI core action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Update real-time metrics
function updateRealTimeMetrics(): void {
  // Simulate realistic fluctuations
  globalCoreState.neuralActivity = Math.max(10, Math.min(100, 
    globalCoreState.neuralActivity + (Math.random() - 0.5) * 8
  ));

  globalCoreState.connections = Math.max(2000, Math.min(5000, 
    globalCoreState.connections + Math.floor((Math.random() - 0.5) * 100)
  ));

  globalCoreState.performance = Math.max(70, Math.min(100, 
    globalCoreState.performance + (Math.random() - 0.5) * 3
  ));

  globalCoreState.memory = Math.max(80, Math.min(100, 
    globalCoreState.memory + (Math.random() - 0.5) * 2
  ));

  globalCoreState.confidence = Math.max(60, Math.min(100, 
    globalCoreState.confidence + (Math.random() - 0.5) * 1.5
  ));

  // Update temperature based on performance
  const targetTemp = 20 + (globalCoreState.performance / 100) * 10;
  globalCoreState.temperature = Math.round(
    (globalCoreState.temperature + targetTemp) / 2 * 10
  ) / 10;

  // Update power consumption based on activity
  const baseConsumption = 300;
  const activityMultiplier = 1 + (globalCoreState.neuralActivity / 100) * 0.8;
  globalCoreState.powerConsumption = Math.round(baseConsumption * activityMultiplier);

  // Update processing speed based on performance
  globalCoreState.processingSpeed = generateProcessingSpeed(globalCoreState.performance);

  // Quantum sync can occasionally fluctuate
  if (Math.random() < 0.05) { // 5% chance
    globalCoreState.quantumSync = !globalCoreState.quantumSync;
  }

  // Round all numeric values
  globalCoreState.neuralActivity = Math.round(globalCoreState.neuralActivity);
  globalCoreState.performance = Math.round(globalCoreState.performance);
  globalCoreState.memory = Math.round(globalCoreState.memory);
  globalCoreState.confidence = Math.round(globalCoreState.confidence);
}

// Generate processing speed based on performance
function generateProcessingSpeed(performance: number): string {
  const baseSpeed = 2000; // Base 2000 THz
  const speedMultiplier = 1 + (performance / 100) * 0.5; // Up to 50% boost
  const finalSpeed = Math.round(baseSpeed * speedMultiplier);
  
  if (finalSpeed >= 1000) {
    return `${(finalSpeed / 1000).toFixed(1)} THz`;
  } else {
    return `${finalSpeed} GHz`;
  }
}
