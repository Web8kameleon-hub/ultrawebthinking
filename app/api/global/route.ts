/**
 * Global Data Integration API - Real World Data Sources
 * Connects to authentic global APIs: NASA, ENTSO-E, WHO, OpenSky, etc.
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

import {
    ALL_GLOBAL_SOURCES,
    getSourceByKey,
    SOURCE_CATEGORIES
} from '@/lib/globalSources';
import { assertReal } from '@/lib/real';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'
export const revalidate = 0

interface GlobalDataRequest {
  source: string
  endpoint?: string
  params?: Record<string, string>
  region?: string
}

interface GlobalDataResponse {
  source: string
  data: any
  metadata: {
    timestamp: string
    source_url: string
    auth_used: string
    rate_limit?: string
    cache_ttl?: number
  }
  status: 'success' | 'error' | 'partial'
  error?: string
}

// Real API calls to global sources
async function fetchFromGlobalSource(
  sourceKey: string, 
  endpoint?: string, 
  params: Record<string, string> = {}
): Promise<GlobalDataResponse> {
  const source = getSourceByKey(sourceKey as any)
  if (!source) {
    throw new Error(`Unknown source: ${sourceKey}`)
  }

  // Check environment variables for auth
  if ('envVar' in source && source.envVar && !process.env[source.envVar]) {
    throw new Error(`Missing environment variable: ${source.envVar}`)
  }

  let url = source.baseUrl
  if (endpoint) {
    url += endpoint.startsWith('/') ? endpoint : '/' + endpoint
  }

  // Add query parameters
  const urlObj = new URL(url)
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value)
  })

  // Add authentication
  const headers: Record<string, string> = {
    'User-Agent': 'Web8-EuroWeb/8.0.0 Industrial',
    'Accept': 'application/json'
  }

  if ('envVar' in source && source.envVar) {
    const apiKey = process.env[source.envVar]
    if (apiKey) {
      switch (source.auth) {
        case 'api-key':
          urlObj.searchParams.set('api_key', apiKey)
          break
        case 'security-token':
          urlObj.searchParams.set('securityToken', apiKey)
          break
        case 'bearer':
          headers.Authorization = `Bearer ${apiKey}`
          break
      }
    }
  }

  const startTime = Date.now()
  
  try {
    const response = await fetch(urlObj.toString(), {
      headers,
      signal: AbortSignal.timeout(10000) // 10s timeout
    })

    const responseTime = Date.now() - startTime
    
    if (!response.ok) {
      return {
        source: sourceKey,
        data: null,
        metadata: {
          timestamp: new Date().toISOString(),
          source_url: urlObj.toString(),
          auth_used: source.auth
        },
        status: 'error',
        error: `HTTP ${response.status}: ${response.statusText} (${responseTime}ms)`
      }
    }

    let data
    const contentType = response.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      data = await response.json()
    } else if (contentType.includes('application/xml') || contentType.includes('text/xml')) {
      data = { xml_content: await response.text() }
    } else {
      data = { raw_content: await response.text() }
    }

    return {
      source: sourceKey,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        source_url: urlObj.toString(),
        auth_used: source.auth,
        rate_limit: 'rateLimit' in source ? source.rateLimit : undefined,
        cache_ttl: responseTime < 1000 ? 300 : 60 // Cache faster responses longer
      },
      status: 'success'
    }

  } catch (error) {
    return {
      source: sourceKey,
      data: null,
      metadata: {
        timestamp: new Date().toISOString(),
        source_url: urlObj.toString(),
        auth_used: source.auth
      },
      status: 'error',
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// Predefined real data queries
async function getPresetData(preset: string): Promise<GlobalDataResponse[]> {
  const results: GlobalDataResponse[] = []

  switch (preset) {
    case 'albania_overview':
      // Real data about Albania from multiple global sources
      results.push(
        await fetchFromGlobalSource('worldBank', '/country/ALB/indicator/NY.GDP.MKTP.CD', { format: 'json', date: '2023' }),
        await fetchFromGlobalSource('aviationWeather', '', { 
          dataSource: 'metars', 
          requestType: 'retrieve', 
          format: 'xml', 
          stationString: 'LYTV',
          hoursBeforeNow: '2' 
        }),
        await fetchFromGlobalSource('opensky', '/states/all', { lamin: '39.5', lomin: '19.0', lamax: '42.7', lomax: '21.1' })
      )
      break

    case 'european_energy':
      // Real European energy data
      results.push(
        await fetchFromGlobalSource('entsoe', '', {
          documentType: 'A44',
          in_Domain: '10YAL-KESH-----5', // Albania
          periodStart: new Date(Date.now() - 24*60*60*1000).toISOString().slice(0,10).replace(/-/g,'') + '0000',
          periodEnd: new Date().toISOString().slice(0,10).replace(/-/g,'') + '0000'
        })
      )
      break

    case 'global_health':
      // Real global health data
      results.push(
        await fetchFromGlobalSource('who', '/Dimension')
      )
      break

    case 'space_weather':
      // Real space/astronomy data
      results.push(
        await fetchFromGlobalSource('nasa', '/planetary/apod'),
        await fetchFromGlobalSource('nasa', '/DONKI/notifications', { 
          startDate: new Date(Date.now() - 7*24*60*60*1000).toISOString().slice(0,10),
          endDate: new Date().toISOString().slice(0,10)
        })
      )
      break

    case 'crypto_markets':
      // Real cryptocurrency data
      results.push(
        await fetchFromGlobalSource('coingecko', '/simple/price', { ids: 'bitcoin,ethereum,solana', vs_currencies: 'usd,eur' }),
        await fetchFromGlobalSource('solana', '', {}) // Will use JSON-RPC method in body
      )
      break

    case 'scientific_research':
      // Real scientific publications
      results.push(
        await fetchFromGlobalSource('arxiv', '/query', { search_query: 'cat:cs.AI', max_results: '5' }),
        await fetchFromGlobalSource('openAlex', '/works', { 'filter': 'publication_year:2024', 'per_page': '5' })
      )
      break

    default:
      throw new Error(`Unknown preset: ${preset}`)
  }

  return results.filter(r => r !== null)
}

export async function GET(request: NextRequest) {
  try {
    assertReal('global.data.integration')
    
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source')
    const endpoint = searchParams.get('endpoint')
    const preset = searchParams.get('preset')
    const list = searchParams.get('list')

    // List available sources
    if (list === 'sources') {
      return NextResponse.json({
        categories: SOURCE_CATEGORIES,
        sources: Object.entries(ALL_GLOBAL_SOURCES).map(([key, source]) => ({
          key,
          name: source.name,
          type: source.type,
          protocol: source.protocol,
          description: source.description,
          auth: source.auth,
          configured: !('envVar' in source) || !source.envVar || !!process.env[source.envVar]
        })),
        presets: [
          'albania_overview',
          'european_energy', 
          'global_health',
          'space_weather',
          'crypto_markets',
          'scientific_research'
        ]
      })
    }

    // Use preset queries
    if (preset) {
      const results = await getPresetData(preset)
      return NextResponse.json({
        preset,
        results,
        timestamp: new Date().toISOString(),
        total_sources: results.length,
        successful: results.filter(r => r.status === 'success').length
      })
    }

    // Individual source query
    if (source) {
      const params: Record<string, string> = {}
      searchParams.forEach((value, key) => {
        if (!['source', 'endpoint'].includes(key)) {
          params[key] = value
        }
      })

      const result = await fetchFromGlobalSource(source, endpoint || undefined, params)
      return NextResponse.json(result)
    }

    // Default: show usage
    return NextResponse.json({
      message: 'Web8 Global Data Integration API',
      usage: {
        list_sources: '/api/global?list=sources',
        preset_data: '/api/global?preset=albania_overview',
        individual_source: '/api/global?source=nasa&endpoint=/planetary/apod',
        with_params: '/api/global?source=worldBank&endpoint=/country/ALB/indicator/NY.GDP.MKTP.CD&format=json'
      },
      real_mode: process.env.REAL_MODE === '1',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Global data integration failed',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    assertReal('global.data.batch')
    
    const body: GlobalDataRequest[] = await request.json()
    
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json({
        error: 'Request body must be an array of GlobalDataRequest objects'
      }, { status: 400 })
    }

    if (body.length > 10) {
      return NextResponse.json({
        error: 'Maximum 10 requests per batch'
      }, { status: 400 })
    }

    // Process all requests in parallel
    const results = await Promise.all(
      body.map(async (req) => {
        try {
          return await fetchFromGlobalSource(req.source, req.endpoint, req.params || {})
        } catch (error) {
          return {
            source: req.source,
            data: null,
            metadata: {
              timestamp: new Date().toISOString(),
              source_url: 'error',
              auth_used: 'none'
            },
            status: 'error' as const,
            error: error instanceof Error ? error.message : String(error)
          }
        }
      })
    )

    return NextResponse.json({
      batch_results: results,
      timestamp: new Date().toISOString(),
      total_requests: body.length,
      successful: results.filter(r => r.status === 'success').length,
      errors: results.filter(r => r.status === 'error').length
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Batch request failed',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
