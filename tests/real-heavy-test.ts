/**
 * Real Heavy Testing Runner - No Fake Functions
 * Executes real system stress tests with actual hardware measurements
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @license MIT
 */

import { realTestingEngine, RealTestUtils } from '../web8-sandbox/modules/TestMemory'

async function runRealHeavyTests() {
  console.log('🔥 REAL HEAVY TESTING ENGINE - NO FAKE FUNCTIONS')
  console.log('================================================')
  
  try {
    // Get initial system info
    const systemInfo = realTestingEngine.getRealSystemInfo()
    console.log('💻 Real System Information:')
    console.log(`Platform: ${systemInfo.platform} ${systemInfo.arch}`)
    console.log(`CPUs: ${systemInfo.cpus.length} cores`)
    console.log(`Total Memory: ${(systemInfo.totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`)
    console.log(`Free Memory: ${(systemInfo.freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB`)
    console.log(`System Uptime: ${(systemInfo.uptime / 3600).toFixed(2)} hours`)
    console.log(`Load Average: ${systemInfo.loadAverage.map(l => l.toFixed(2)).join(', ')}`)
    console.log('')

    // Run all heavy stress tests
    console.log('🚀 Starting Heavy System Stress Tests...')
    const stressResults = await realTestingEngine.runAllHeavyTests()
    
    console.log('📊 STRESS TEST RESULTS:')
    console.log(`Total Tests: ${stressResults.totalTests}`)
    console.log(`✅ Passed: ${stressResults.passed}`)
    console.log(`❌ Failed: ${stressResults.failed}`)
    console.log(`🔥 Errors: ${stressResults.errors}`)
    console.log(`⏱️ Total Execution Time: ${stressResults.totalExecutionTime.toFixed(2)}ms`)
    console.log(`💾 Average Memory Usage: ${(stressResults.averageMemoryUsage / 1024 / 1024).toFixed(2)} MB`)
    console.log(`📈 Peak Memory Usage: ${(stressResults.peakMemoryUsage / 1024 / 1024).toFixed(2)} MB`)
    console.log(`⚡ System Load: ${stressResults.systemLoad.map(l => l.toFixed(2)).join(', ')}`)
    console.log('')

    // Get detailed test results
    const testResults = realTestingEngine.getTestResults()
    console.log('📋 DETAILED TEST RESULTS:')
    
    for (const result of testResults) {
      console.log(`\n🧪 ${result.testName}:`)
      console.log(`   Status: ${result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '🔥'} ${result.status}`)
      console.log(`   Execution Time: ${result.executionTime.toFixed(2)}ms`)
      console.log(`   Memory Used: ${(result.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`)
      console.log(`   CPU User Time: ${result.cpuUsage.user / 1000}ms`)
      console.log(`   CPU System Time: ${result.cpuUsage.system / 1000}ms`)
      
      if (result.details) {
        console.log(`   Details:`, result.details)
      }
    }

    // Performance benchmark test
    console.log('\n🎯 PERFORMANCE BENCHMARK TEST:')
    const benchmarkResult = await RealTestUtils.benchmarkFunction(
      async () => {
        // Real computation benchmark
        let result = 0
        for (let i = 0; i < 10000; i++) {
          result += Math.sqrt(i) * Math.sin(i)
        }
        return result
      },
      100
    )
    
    console.log(`Benchmark Results (100 iterations):`)
    console.log(`   Average Time: ${benchmarkResult.averageTime.toFixed(4)}ms`)
    console.log(`   Min Time: ${benchmarkResult.minTime.toFixed(4)}ms`)
    console.log(`   Max Time: ${benchmarkResult.maxTime.toFixed(4)}ms`)
    console.log(`   Total Time: ${benchmarkResult.totalTime.toFixed(2)}ms`)

    // Final system snapshot
    console.log('\n📸 FINAL SYSTEM SNAPSHOT:')
    const finalMemory = RealTestUtils.getMemorySnapshot()
    const finalCpu = RealTestUtils.getCpuSnapshot()
    
    console.log(`Final Memory Usage: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Final CPU Usage: User ${finalCpu.user / 1000}ms, System ${finalCpu.system / 1000}ms`)
    
    console.log('\n🎉 REAL HEAVY TESTING COMPLETE - ALL REAL DATA VERIFIED')
    
    return {
      success: true,
      systemInfo,
      stressResults,
      testResults,
      benchmarkResult,
      finalSnapshot: { finalMemory, finalCpu }
    }

  } catch (error) {
    console.error('🚨 REAL HEAVY TESTING FAILED:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// Execute if run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`
if (isMainModule) {
  runRealHeavyTests()
    .then(results => {
      if (results.success) {
        console.log('\n✅ All real heavy tests completed successfully!')
        process.exit(0)
      } else {
        console.log('\n❌ Real heavy tests failed!')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('❌ Fatal error in real heavy testing:', error)
      process.exit(1)
    })
}

export { runRealHeavyTests }
