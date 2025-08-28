/**
 * Web8 Attack Simulation API
 * API endpoint për menaxhimin e simulimeve të sulmeve
 * 
 * @author Ledjan Ahmati
 * @version 8.2.0-ATTACK-SIM
 * @contact dealsjona@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  Web8AttackSimulator, 
  SimulationConfig, 
  QuickTestConfig,
  ComprehensiveTestConfig,
  ExtremeTestConfig
} from '../../../security/attack-simulator';

let simulatorInstance: Web8AttackSimulator | null = null;

function getSimulator(): Web8AttackSimulator {
  if (!simulatorInstance) {
    simulatorInstance = new Web8AttackSimulator();
  }
  return simulatorInstance;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, config } = body;

    const simulator = getSimulator();

    switch (action) {
      case 'start':
        if (simulator.isSimulationRunning()) {
          return NextResponse.json(
            { error: 'Simulation is already running' },
            { status: 400 }
          );
        }

        // Validate config
        const simulationConfig: SimulationConfig = {
          targetUrl: config?.targetUrl || 'http://localhost:3000',
          intensity: config?.intensity || 'MEDIUM',
          duration: Math.min(config?.duration || 30, 300), // Max 5 minutes
          concurrent: config?.concurrent || false,
          logLevel: config?.logLevel || 'VERBOSE',
          safeguards: config?.safeguards !== false
        };

        // Additional safety checks
        if (!simulationConfig.safeguards && simulationConfig.intensity === 'EXTREME') {
          return NextResponse.json(
            { error: 'Extreme intensity requires safeguards to be enabled' },
            { status: 400 }
          );
        }

        const report = await simulator.runSimulation(simulationConfig);
        
        return NextResponse.json({
          success: true,
          report,
          timestamp: new Date().toISOString()
        });

      case 'stop':
        if (!simulator.isSimulationRunning()) {
          return NextResponse.json(
            { error: 'No simulation is currently running' },
            { status: 400 }
          );
        }

        simulator.stopSimulation();
        
        return NextResponse.json({
          success: true,
          message: 'Simulation stopped',
          timestamp: new Date().toISOString()
        });

      case 'status':
        return NextResponse.json({
          success: true,
          isRunning: simulator.isSimulationRunning(),
          availableVectors: simulator.getAvailableVectors().length,
          timestamp: new Date().toISOString()
        });

      case 'vectors':
        return NextResponse.json({
          success: true,
          vectors: simulator.getAvailableVectors(),
          timestamp: new Date().toISOString()
        });

      case 'presets':
        return NextResponse.json({
          success: true,
          presets: {
            quick: QuickTestConfig,
            comprehensive: ComprehensiveTestConfig,
            extreme: ExtremeTestConfig
          },
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: start, stop, status, vectors, presets' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Attack simulation API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

    const simulator = getSimulator();

    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          isRunning: simulator.isSimulationRunning(),
          availableVectors: simulator.getAvailableVectors().length,
          timestamp: new Date().toISOString()
        });

      case 'vectors':
        return NextResponse.json({
          success: true,
          vectors: simulator.getAvailableVectors(),
          timestamp: new Date().toISOString()
        });

      case 'presets':
        return NextResponse.json({
          success: true,
          presets: {
            quick: QuickTestConfig,
            comprehensive: ComprehensiveTestConfig,
            extreme: ExtremeTestConfig
          },
          timestamp: new Date().toISOString()
        });

      case 'health':
        return NextResponse.json({
          success: true,
          service: 'Web8 Attack Simulation API',
          version: '8.2.0-ATTACK-SIM',
          status: 'operational',
          timestamp: new Date().toISOString(),
          endpoints: [
            'POST /api/attack-sim - Start/stop simulations',
            'GET /api/attack-sim?action=status - Get simulation status',
            'GET /api/attack-sim?action=vectors - Get available attack vectors',
            'GET /api/attack-sim?action=presets - Get preset configurations'
          ]
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: status, vectors, presets, health' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Attack simulation API GET error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OPTIONS method for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
