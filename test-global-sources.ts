/**
 * Global Data Sources Integration Test
 * Tests real connections to NASA, ENTSO-E, WHO, OpenSky, etc.
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

import {
    ALL_GLOBAL_SOURCES,
    getAllEnabledSources,
    getSourceByKey,
    SOURCE_CATEGORIES
} from './lib/globalSources'

interface TestResult {
  source: string
  status: 'pass' | 'fail' | 'skip'
  response_time: number
  error?: string
  configured: boolean
}

async function testSourceConnection(sourceKey: string): Promise<TestResult> {
  const source = getSourceByKey(sourceKey as any)
  if (!source) {
    return {
      source: sourceKey,
      status: 'fail',
      response_time: 0,
      error: 'Source not found',
      configured: false
    }
  }

  // Check if source is configured
  const configured = !('envVar' in source) || !source.envVar || !!process.env[source.envVar]
  
  if (!configured) {
    return {
      source: sourceKey,
      status: 'skip',
      response_time: 0,
      error: `Missing environment variable: ${('envVar' in source) ? source.envVar : 'none'}`,
      configured: false
    }
  }

  const startTime = Date.now()
  
  try {
    // Use health check endpoint if available
    let testUrl = source.baseUrl
    
    if (source.healthCheck) {
      testUrl = source.healthCheck.startsWith('http') 
        ? source.healthCheck 
        : source.baseUrl + source.healthCheck
    }

    // Add authentication if needed
    const url = new URL(testUrl)
    if ('envVar' in source && source.envVar && process.env[source.envVar]) {
      const apiKey = process.env[source.envVar]!
      switch (source.auth) {
        case 'api-key':
          url.searchParams.set('api_key', apiKey)
          break
        case 'security-token':
          url.searchParams.set('securityToken', apiKey)
          break
      }
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Web8-EuroWeb/8.0.0 Test',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(5000) // 5s timeout for tests
    })

    const responseTime = Date.now() - startTime

    if (response.ok) {
      return {
        source: sourceKey,
        status: 'pass',
        response_time: responseTime,
        configured: true
      }
    } else {
      return {
        source: sourceKey,
        status: 'fail',
        response_time: responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`,
        configured: true
      }
    }

  } catch (error) {
    const responseTime = Date.now() - startTime
    return {
      source: sourceKey,
      status: 'fail',
      response_time: responseTime,
      error: error instanceof Error ? error.message : String(error),
      configured: true
    }
  }
}

export async function testAllGlobalSources(): Promise<{
  summary: {
    total: number
    passed: number
    failed: number
    skipped: number
    average_response_time: number
  }
  results: TestResult[]
  by_category: Record<string, TestResult[]>
}> {
  console.log('🌍 Testing Global Data Sources...')
  
  const allSources = Object.keys(ALL_GLOBAL_SOURCES)
  const results: TestResult[] = []

  // Test all sources in parallel (with some limit)
  const batchSize = 5
  for (let i = 0; i < allSources.length; i += batchSize) {
    const batch = allSources.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(sourceKey => testSourceConnection(sourceKey))
    )
    results.push(...batchResults)
    
    // Small delay between batches to be respectful to APIs
    if (i + batchSize < allSources.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // Calculate summary
  const passed = results.filter(r => r.status === 'pass').length
  const failed = results.filter(r => r.status === 'fail').length
  const skipped = results.filter(r => r.status === 'skip').length
  const responseTimes = results.filter(r => r.response_time > 0).map(r => r.response_time)
  const avgResponseTime = responseTimes.length > 0 
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 0

  // Group by category
  const byCategory: Record<string, TestResult[]> = {}
  Object.entries(SOURCE_CATEGORIES).forEach(([category, sourceKeys]) => {
    byCategory[category] = results.filter(r => (sourceKeys as string[]).includes(r.source))
  })

  return {
    summary: {
      total: results.length,
      passed,
      failed,
      skipped,
      average_response_time: avgResponseTime
    },
    results,
    by_category: byCategory
  }
}

export async function testSpecificCategory(category: keyof typeof SOURCE_CATEGORIES): Promise<TestResult[]> {
  const sourceKeys = SOURCE_CATEGORIES[category]
  const results = await Promise.all(
    sourceKeys.map(sourceKey => testSourceConnection(sourceKey))
  )
  return results
}

// Example usage and test runner
export async function runQuickTest(): Promise<void> {
  console.log('🚀 Starting Quick Global Data Sources Test')
  
  try {
    // Test enabled sources only (faster)
    const enabledSources = getAllEnabledSources()
    console.log(`Found ${enabledSources.length} enabled sources`)

    if (enabledSources.length === 0) {
      console.log('⚠️  No sources are configured with environment variables')
      console.log('Set these environment variables to test real connections:')
      
      Object.entries(ALL_GLOBAL_SOURCES).forEach(([, source]) => {
        if (typeof source === 'object' && source && 'envVar' in source && source.envVar) {
          const sourceObj = source as any
          console.log(`  ${sourceObj.envVar}=your_api_key  # for ${sourceObj.name}`)
        }
      })
      return
    }

    // Test a few key sources
    const testSources = enabledSources.slice(0, 3).map(([key]) => key)
    const results = await Promise.all(
      testSources.map(sourceKey => testSourceConnection(sourceKey))
    )

    console.log('\n📊 Test Results:')
    results.forEach(result => {
      const status = result.status === 'pass' ? '✅' : result.status === 'skip' ? '⏭️' : '❌'
      console.log(`${status} ${result.source}: ${result.status} (${result.response_time}ms)`)
      if (result.error) {
        console.log(`   Error: ${result.error}`)
      }
    })

    const passed = results.filter(r => r.status === 'pass').length
    console.log(`\n🎯 Summary: ${passed}/${results.length} sources passed`)

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// For development/testing
if (import.meta.url === `file://${process.argv[1]}`) {
  runQuickTest()
}
