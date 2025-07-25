/**
 * Strict Ethical Neural API Route
 * Enhanced ethical compliance monitoring
 * 
 * @version 8.0.0-ETHICAL
 * @author Ledjan Ahmati
 * @contact dealsjona@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { EthicalNeuralPlanner } from '../../../../lib/EthicalNeuralPlanner';

// Global strict ethical planner instance
let strictPlanner: EthicalNeuralPlanner | null = null;

export async function GET(request: NextRequest) {
  try {
    // Initialize strict ethical planner if not exists
    if (!strictPlanner) {
      strictPlanner = new EthicalNeuralPlanner();
      console.log('🛡️ Strict Ethical Neural Planner initialized');
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'compliance':
        const complianceReport = strictPlanner.getEthicalComplianceReport();
        return NextResponse.json({
          success: true,
          data: complianceReport,
          message: 'Ethical compliance report generated'
        });

      case 'status':
        const networkStatus = strictPlanner.getNetworkStatus();
        const activityMap = strictPlanner.getActivityMap();
        
        return NextResponse.json({
          success: true,
          data: {
            networkStatus,
            activityMap,
            strictMode: true,
            ethicalThreshold: 1.0,
            maxPulseRate: 60
          },
          message: 'Strict ethical neural status'
        });

      default:
        // Default: return full ethical monitoring data
        const fullStatus = strictPlanner.getNetworkStatus();
        const fullActivityMap = strictPlanner.getActivityMap();
        const complianceData = strictPlanner.getEthicalComplianceReport();

        return NextResponse.json({
          success: true,
          data: {
            networkStatus: fullStatus,
            activityMap: fullActivityMap,
            ethicalCompliance: complianceData,
            strictMode: {
              active: true,
              flickeringThreshold: 1.0,
              maxPulseRate: 60,
              safeThinkDuration: 30000,
              monitoringInterval: 25
            }
          },
          timestamp: new Date().toISOString(),
          version: '8.0.0-ETHICAL'
        });
    }

  } catch (error) {
    console.error('Strict Ethical Neural API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process strict ethical neural request',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, nodeId, activity } = body;

    // Initialize strict ethical planner if not exists
    if (!strictPlanner) {
      strictPlanner = new EthicalNeuralPlanner();
    }

    switch (action) {
      case 'emergency_reset':
        strictPlanner.emergencyEthicalReset();
        return NextResponse.json({
          success: true,
          message: 'Emergency ethical reset completed',
          timestamp: new Date().toISOString()
        });

      case 'set_activity':
        if (!nodeId || activity === undefined) {
          return NextResponse.json({
            success: false,
            error: 'Missing nodeId or activity parameters'
          }, { status: 400 });
        }

        const success = strictPlanner.setNodeActivity(nodeId, activity);
        
        if (success) {
          const status = strictPlanner.getNetworkStatus();
          const targetNode = status.nodes.find((n: any) => n.id === nodeId);
          
          return NextResponse.json({
            success: true,
            message: `Node ${nodeId} activity set to ${activity}%`,
            nodeStatus: targetNode,
            ethicalCompliance: strictPlanner.getEthicalComplianceReport()
          });
        } else {
          return NextResponse.json({
            success: false,
            error: `Failed to set activity for node ${nodeId}`
          }, { status: 400 });
        }

      case 'force_safethink':
        // Manually trigger SafeThink mode
        strictPlanner.forceSafeThinkMode();
        
        return NextResponse.json({
          success: true,
          message: 'SafeThink mode manually triggered',
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Strict Ethical Neural POST Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process strict ethical neural action',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
