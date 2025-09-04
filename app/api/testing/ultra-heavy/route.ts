/**
 * Ultra Heavy Testing API Endpoint
 * Advanced Testing Infrastructure for EuroWeb Platform
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Quantum Industrial
 * @license MIT
 * @created September 3, 2025
 */

import { NextRequest, NextResponse } from 'next/server'
import { getHeavyTestingEngine, HeavyTestType, TestSeverity } from '../../../lib/testing/UltraHeavyTestingEngine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testType = searchParams.get('testType') as HeavyTestType || HeavyTestType.STRESS_SYSTEM
    const severity = searchParams.get('severity') as TestSeverity || TestSeverity.MEDIUM
    const action = searchParams.get('action') || 'run'

    const engine = getHeavyTestingEngine()

    console.log(`🧪 Heavy Testing API: ${action} - ${testType} (${severity})`)

    // Handle different actions
    switch (action) {
      case 'capabilities':
        return NextResponse.json({
          success: true,
          action: 'capabilities',
          data: engine.getSystemCapabilities(),
          timestamp: new Date().toISOString()
        })

      case 'active':
        return NextResponse.json({
          success: true,
          action: 'active-tests',
          data: {
            activeTests: engine.getActiveTests(),
            count: engine.getActiveTests().length
          },
          timestamp: new Date().toISOString()
        })

      case 'run':
      default:
        let result
        
        // Run specific test based on type
        switch (testType) {
          case HeavyTestType.QUANTUM_SIMULATION:
            result = await engine.runQuantumStressTest(severity)
            break
            
          case HeavyTestType.AGI_NEURAL_TEST:
            result = await engine.runAGIStressTest(severity)
            break
            
          case HeavyTestType.MESH_NETWORK_P2P:
            result = await engine.runNetworkStressTest(severity)
            break
            
          case HeavyTestType.AI_LABORATORY:
            result = await engine.runFullSystemStressTest(severity)
            break
            
          case HeavyTestType.STRESS_SYSTEM:
          default:
            result = await engine.runFullSystemStressTest(severity)
            break
        }

        return NextResponse.json({
          success: true,
          action: 'test-completed',
          testType,
          severity,
          data: result,
          timestamp: new Date().toISOString()
        })
    }

  } catch (error) {
    console.error('❌ Heavy Testing API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testType, severity, config } = body

    console.log(`🧪 Heavy Testing API POST: ${testType} (${severity})`)

    const engine = getHeavyTestingEngine()
    
    // Custom test configuration
    const testConfig = {
      type: testType || HeavyTestType.STRESS_SYSTEM,
      severity: severity || TestSeverity.MEDIUM,
      duration: config?.duration || 30000,
      parallelWorkers: config?.parallelWorkers || 4,
      targetLoad: config?.targetLoad || 80,
      memoryLimit: config?.memoryLimit || 1024,
      networkSimulation: config?.networkSimulation || false,
      quantumAlgorithms: config?.quantumAlgorithms || false,
      aiProcessing: config?.aiProcessing || false,
      cryptoOperations: config?.cryptoOperations || false
    }

    const result = await engine.runHeavyTest(testConfig)

    return NextResponse.json({
      success: true,
      action: 'custom-test-completed',
      config: testConfig,
      data: result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Heavy Testing API POST Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
