/**
 * Strict Ethical Neural API Route
 * Enhanced ethical compliance monitoring
 * 
 * @version 8.0.0-ETHICAL
 * @author Ledjan Ahmati
 * @contact dealsjona@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  analyzeEthicalContext,
  makeEthicalDecision,
  monitorEthicalCompliance,
  activateEmergencyEthicsProtocol,
  updateEthicalConfig,
  resetEthicalSystem,
  type Web8EthicalContext,
  type Web8EthicalDecision,
  type Web8EthicalConfig
} from '../../../../lib/EthicalNeuralPlanner';

// Ethical compliance monitoring state
let ethicalHistory: Array<{
  action: string;
  context: Record<string, unknown>;
  decision: Web8EthicalDecision;
  timestamp: number;
}> = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'compliance':
        const complianceReport = monitorEthicalCompliance();
        return NextResponse.json({
          success: true,
          data: complianceReport,
          message: 'Ethical compliance report generated'
        });

      case 'status':
        const statusData = {
          ethicalHistory: ethicalHistory.slice(-10), // Last 10 decisions
          complianceMonitoring: monitorEthicalCompliance(),
          strictMode: true,
          ethicalThreshold: 85,
          maxRiskThreshold: 70
        };
        
        return NextResponse.json({
          success: true,
          data: statusData,
          message: 'Strict ethical neural status'
        });

      default:
        // Default: return full ethical monitoring data
        const fullComplianceData = monitorEthicalCompliance();
        const recentDecisions = ethicalHistory.slice(-20);

        return NextResponse.json({
          success: true,
          data: {
            ethicalCompliance: fullComplianceData,
            recentDecisions,
            strictMode: {
              active: true,
              complianceMinimum: 85,
              maxRiskThreshold: 70,
              monitoringInterval: 1000
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
    const { action, context, decision_action } = body;

    switch (action) {
      case 'emergency_reset':
        // Reset ethical system to default state
        resetEthicalSystem();
        activateEmergencyEthicsProtocol('Manual emergency reset requested');
        
        return NextResponse.json({
          success: true,
          message: 'Emergency ethical reset completed',
          timestamp: new Date().toISOString()
        });

      case 'make_decision':
        if (!decision_action) {
          return NextResponse.json({
            success: false,
            error: 'Missing decision_action parameter'
          }, { status: 400 });
        }

        const ethicalDecision = makeEthicalDecision(decision_action, context || {});
        
        // Store in history
        ethicalHistory.push({
          action: decision_action,
          context: context || {},
          decision: ethicalDecision,
          timestamp: Date.now()
        });

        // Keep only last 100 decisions
        if (ethicalHistory.length > 100) {
          ethicalHistory = ethicalHistory.slice(-100);
        }
        
        return NextResponse.json({
          success: true,
          message: `Ethical decision made for action: ${decision_action}`,
          decision: ethicalDecision,
          complianceStatus: monitorEthicalCompliance()
        });

      case 'analyze_context':
        if (!decision_action) {
          return NextResponse.json({
            success: false,
            error: 'Missing decision_action parameter'
          }, { status: 400 });
        }

        const ethicalContext = analyzeEthicalContext(decision_action, context || {});
        
        return NextResponse.json({
          success: true,
          message: `Ethical context analyzed for: ${decision_action}`,
          context: ethicalContext
        });

      case 'update_config':
        const { config } = body;
        if (!config) {
          return NextResponse.json({
            success: false,
            error: 'Missing config parameter'
          }, { status: 400 });
        }

        updateEthicalConfig(config);
        
        return NextResponse.json({
          success: true,
          message: 'Ethical configuration updated',
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
