/**
 * Sandbox Test Runner - EuroWeb Ultra Sandbox
 * Test and validate the AGI Sandbox Engine
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 1.0.0 Test
 */

import { ageimInterface } from './ageim-interface'
import { runSandbox, sandboxEngine } from './sandbox-engine'

async function runSandboxTests(): Promise<void> {
  console.log('🚀 Starting EuroWeb Ultra Sandbox Engine Tests')
  console.log('================================================')
  
  try {
    // Test 1: Basic Sandbox Status
    console.log('\n🔍 Test 1: Checking sandbox status...')
    const status = sandboxEngine.getStatus()
    console.log('✅ Sandbox status:', status)
    
    // Test 2: Run Full Sandbox Test
    console.log('\n🔍 Test 2: Running full sandbox test...')
    const result = await runSandbox()
    console.log('✅ Sandbox execution result:')
    console.log(`   - Execution Time: ${result.executionTime}ms`)
    console.log(`   - System Health: ${result.systemHealth}%`)
    console.log(`   - Security Check: ${result.securityCheck ? 'PASSED' : 'FAILED'}`)
    console.log(`   - Memory Test: ${result.memory.status || 'N/A'}`)
    console.log(`   - Planner Test: ${result.planner.status || 'N/A'}`)
    console.log(`   - DevEcho Test: ${result.devEcho.status || 'N/A'}`)
    
    // Test 3: AGEIM Interface
    console.log('\n🔍 Test 3: Testing AGEIM interface...')
    const ageimStatus = ageimInterface.getStatus()
    console.log('✅ AGEIM interface status:', ageimStatus)
    
    // Test 4: Read Logs
    console.log('\n🔍 Test 4: Reading sandbox logs...')
    const logs = sandboxEngine.readLogs(10)
    console.log('✅ Recent logs:')
    logs.forEach(log => console.log(`   ${log}`))
    
    // Test 5: Performance Metrics
    console.log('\n🔍 Test 5: Performance analysis...')
    if (result.memory.performance !== undefined) {
      console.log(`   - Memory Performance: ${result.memory.performance}%`)
    }
    if (result.planner.performance !== undefined) {
      console.log(`   - Planner Performance: ${result.planner.performance}%`)
    }
    if (result.devEcho.performance !== undefined) {
      console.log(`   - DevEcho Performance: ${result.devEcho.performance}%`)
    }
    
    console.log('\n🎉 All sandbox tests completed successfully!')
    console.log('================================================')
    
  } catch (error) {
    console.error('\n❌ Sandbox test failed:', error)
    console.error('================================================')
  }
}

// Auto-run tests if this file is executed directly
if (require.main === module) {
  runSandboxTests()
    .then(() => {
      console.log('\n✅ Test runner completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Test runner failed:', error)
      process.exit(1)
    })
}

export { runSandboxTests }
