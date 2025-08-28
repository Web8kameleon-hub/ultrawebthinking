/**
 * Neural Planner API
 * Provides real-time neural network data and control
 * 
 * @version 8.0.0
 * @author Ledjan Ahmati
 * @contact dealsjona@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';

// Dynamic import for NeuralPlanner to avoid TypeScript issues
async function getNeuralPlannerClass() {
  const { default: NeuralPlanner } = await import('../../../lib/NeuralPlanner');
  return NeuralPlanner;
}

// Global neural planner instance
let neuralPlanner: any = null;

async function getNeuralPlanner() {
  if (!neuralPlanner) {
    const NeuralPlanner = await getNeuralPlannerClass();
    neuralPlanner = new NeuralPlanner({
      maxPulseRate: 100,
      flickeringThreshold: 3,
      throttleDelay: 5000,
      safeThinkDuration: 10000,
      monitoringInterval: 100,
      emergencyShutdownThreshold: 200
    });
  }
  return neuralPlanner;
}

export async function GET() {
  try {
    const planner = await getNeuralPlanner();
    const networkStatus = planner.getNetworkStatus();
    const activityMap = planner.getActivityMap();
    
    return NextResponse.json({
      success: true,
      data: {
        networkStatus,
        activityMap
      },
      timestamp: new Date().toISOString(),
      version: '8.0.0'
    });
  } catch (error) {
    console.error('Neural API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch neural network data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, nodeId, value } = body;
    const planner = await getNeuralPlanner();

    switch (action) {
      case 'setActivity':
        if (!nodeId || value === undefined) {
          return NextResponse.json(
            { success: false, error: 'Node ID and value required' },
            { status: 400 }
          );
        }
        const success = planner.setNodeActivity(nodeId, value);
        return NextResponse.json({
          success,
          message: success ? `Node ${nodeId} activity set to ${value}%` : `Failed to set activity for ${nodeId}`,
          timestamp: new Date().toISOString()
        });

      case 'resetNetwork':
        planner.resetNetwork();
        return NextResponse.json({
          success: true,
          message: 'Neural network reset successfully',
          timestamp: new Date().toISOString()
        });

      case 'emergencyStop':
        planner.stopMonitoring();
        return NextResponse.json({
          success: true,
          message: 'Neural monitoring stopped',
          timestamp: new Date().toISOString()
        });

      case 'emergencyStart':
        // Create new instance if needed
        const NeuralPlanner = await getNeuralPlannerClass();
        neuralPlanner = new NeuralPlanner();
        return NextResponse.json({
          success: true,
          message: 'Neural monitoring started',
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Neural action error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute neural action',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// WebSocket support for real-time updates would go here
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { config } = body;
    
    if (neuralPlanner) {
      neuralPlanner.destroy();
    }
    
    const NeuralPlanner = await getNeuralPlannerClass();
    neuralPlanner = new NeuralPlanner(config);
    
    return NextResponse.json({
      success: true,
      message: 'Neural planner reconfigured',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Neural config error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reconfigure neural planner',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
