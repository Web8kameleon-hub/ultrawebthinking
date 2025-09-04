/**
 * Real API Test System - Swiss Precision Testing
 * Tests real APIs with actual data, no mocks
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @license MIT
 */

import { performance } from 'perf_hooks'

interface TestResult {
  name: string
  url: string
  success: boolean
  responseTime: number
  statusCode: number
  dataReceived: boolean
  realData: boolean
  swissPrecision: boolean
  error?: string
}

interface SwissTestSuite {
  timestamp: string
  totalTests: number
  passedTests: number
  failedTests: number
  averageResponseTime: number
  swissPrecisionScore: number
  results: TestResult[]
}

// Swiss precision API endpoints to test
const API_ENDPOINTS = [
  {
    name: 'AGI Core API',
    url: 'http://localhost:3000/api/agi/core',
    requiredFields: ['timestamp', 'systemHealth', 'data', 'swissPrecision']
  },
  {
    name: 'AGI Memory API', 
    url: 'http://localhost:3000/api/agi/memory',
    requiredFields: ['timestamp', 'metrics', 'blocks', 'swissPrecision']
  },
  {
    name: 'System CPU API',
    url: 'http://localhost:3000/api/system/cpu', 
    requiredFields: ['cores', 'usage', 'cpus', 'swissPrecision']
  }
]

// Test a single API endpoint with Swiss precision
async function testAPIEndpoint(endpoint: typeof API_ENDPOINTS[0]): Promise<TestResult> {
  const startTime = performance.now()
  
  try {
    const response = await fetch(endpoint.url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'EuroWeb-Swiss-Test-Agent'
      }
    })
    
    const responseTime = Math.round(performance.now() - startTime)
    const data = await response.json()
    
    // Verify required fields exist
    const hasRequiredFields = endpoint.requiredFields.every(field => 
      data.hasOwnProperty(field)
    )
    
    // Check for real data indicators
    const hasRealData = (
      data.timestamp && 
      new Date(data.timestamp).getTime() > 0 &&
      (!data.error)
    )
    
    // Swiss precision check
    const isSwissPrecision = data.swissPrecision === true
    
    return {
      name: endpoint.name,
      url: endpoint.url,
      success: response.ok && hasRequiredFields && hasRealData,
      responseTime,
      statusCode: response.status,
      dataReceived: hasRequiredFields,
      realData: hasRealData,
      swissPrecision: isSwissPrecision
    }
    
  } catch (error) {
    const responseTime = Math.round(performance.now() - startTime)
    
    return {
      name: endpoint.name,
      url: endpoint.url,
      success: false,
      responseTime,
      statusCode: 0,
      dataReceived: false,
      realData: false,
      swissPrecision: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Run Swiss precision test suite
async function runSwissTestSuite(): Promise<SwissTestSuite> {
  console.log('🇨🇭 Starting Swiss Precision API Test Suite...')
  console.log('=' .repeat(60))
  
  const startTime = performance.now()
  const results: TestResult[] = []
  
  for (const endpoint of API_ENDPOINTS) {
    console.log(`Testing: ${endpoint.name}`)
    const result = await testAPIEndpoint(endpoint)
    results.push(result)
    
    // Swiss precision logging
    const status = result.success ? '✅ PASS' : '❌ FAIL'
    const precision = result.swissPrecision ? '🇨🇭' : '⚠️'
    console.log(`  ${status} ${precision} ${result.responseTime}ms - ${endpoint.name}`)
    
    if (result.error) {
      console.log(`    Error: ${result.error}`)
    }
    
    if (!result.realData) {
      console.log(`    ⚠️  No real data detected`)
    }
  }
  
  const totalTime = Math.round(performance.now() - startTime)
  const passedTests = results.filter(r => r.success).length
  const failedTests = results.length - passedTests
  const averageResponseTime = Math.round(
    results.reduce((acc, r) => acc + r.responseTime, 0) / results.length
  )
  const swissPrecisionScore = Math.round(
    (results.filter(r => r.swissPrecision).length / results.length) * 100
  )
  
  console.log('=' .repeat(60))
  console.log(`🇨🇭 Swiss Precision Test Results:`)
  console.log(`   Total Tests: ${results.length}`)
  console.log(`   Passed: ${passedTests} ✅`)
  console.log(`   Failed: ${failedTests} ${failedTests > 0 ? '❌' : ''}`)
  console.log(`   Average Response Time: ${averageResponseTime}ms`)
  console.log(`   Swiss Precision Score: ${swissPrecisionScore}%`)
  console.log(`   Total Execution Time: ${totalTime}ms`)
  
  return {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    passedTests,
    failedTests,
    averageResponseTime,
    swissPrecisionScore,
    results
  }
}

// Main execution
async function main() {
  try {
    const testResults = await runSwissTestSuite()
    
    // Exit with appropriate code
    if (testResults.failedTests > 0) {
      console.log('\n❌ Some tests failed. Check the logs above.')
      process.exit(1)
    } else {
      console.log('\n✅ All tests passed with Swiss precision!')
      process.exit(0)
    }
    
  } catch (error) {
    console.error('Swiss Test Suite Error:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { runSwissTestSuite, testAPIEndpoint }
