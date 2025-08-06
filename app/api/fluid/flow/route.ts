/**
 * FLUID FLOW API - Natural Water-like Flow Control
 * RESTful endpoints for monitoring and controlling fluid architecture
 * 
 * @version 8.0.0-FLUID
 * @author Ledjan Ahmati
 */

import { NextRequest, NextResponse } from 'next/server';
import { FluidArchitecture } from '../../../../lib/FluidArchitecture';

// Global fluid architecture instance
let fluidSystem: FluidArchitecture | null = null;

/**
 * Initialize fluid system if needed
 */
function getFluidSystem(): FluidArchitecture {
  if (!fluidSystem) {
    fluidSystem = new FluidArchitecture();
  }
  return fluidSystem;
}

/**
 * GET /api/fluid/flow - Get current flow metrics
 */
export async function GET(request: NextRequest) {
  try {
    const fluid = getFluidSystem();
    const metrics = fluid.getFlowMetrics();
    
    console.log(`🌊 Flow metrics requested - Water quality: ${metrics.waterQuality}`);
    
    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      data: metrics,
      message: `Flow is ${metrics.waterQuality.toLowerCase()} - natural as pure water`
    });
    
  } catch (error) {
    console.error('❌ Error getting flow metrics:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get flow metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * POST /api/fluid/flow - Control flow parameters
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, stream, value, obstacle } = body;
    const fluid = getFluidSystem();
    
    let result = false;
    let message = '';
    
    switch (action) {
      case 'boost_velocity':
        result = fluid.boostFlowVelocity(stream, value);
        message = result ? `⚡ Boosted ${stream} velocity` : `❌ Failed to boost ${stream}`;
        break;
        
      case 'remove_obstacle':
        result = fluid.removeFlowObstacle(stream, obstacle);
        message = result ? `🧹 Removed obstacle "${obstacle}" from ${stream}` : `❌ Failed to remove obstacle`;
        break;
        
      case 'create_channel':
        if (body.config) {
          fluid.createFlowChannel(stream, body.config);
          result = true;
          message = `🌊 Created new flow channel: ${stream}`;
        }
        break;
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['boost_velocity', 'remove_obstacle', 'create_channel']
        }, { status: 400 });
    }
    
    console.log(`🎮 Flow control: ${message}`);
    
    // Get updated metrics
    const metrics = fluid.getFlowMetrics();
    
    return NextResponse.json({
      success: result,
      message,
      action,
      updatedMetrics: metrics,
      waterQuality: metrics.waterQuality
    });
    
  } catch (error) {
    console.error('❌ Error controlling flow:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to control flow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/fluid/flow - Emergency flow reset
 */
export async function DELETE(request: NextRequest) {
  try {
    console.log('🚨 Emergency flow reset initiated');
    
    if (fluidSystem) {
      fluidSystem.destroy();
      fluidSystem = null;
    }
    
    // Reinitialize with fresh state
    const newFluid = getFluidSystem();
    const metrics = newFluid.getFlowMetrics();
    
    console.log('✨ Flow system reset - crystal clear state restored');
    
    return NextResponse.json({
      success: true,
      message: 'Flow system reset successfully',
      newMetrics: metrics,
      waterQuality: metrics.waterQuality,
      timestamp: Date.now()
    });
    
  } catch (error) {
    console.error('❌ Error resetting flow:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to reset flow system',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
