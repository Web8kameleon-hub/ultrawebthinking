import { NextRequest, NextResponse } from 'next/server'
import { Web8DataSerializer } from '@/lib/web8-serialization'

export async function GET(request: NextRequest) {
  try {
    // Data komplekse për të testuar serialization
    const complexData = {
      system: {
        timestamp: new Date().toISOString(),
        version: '8.0.0',
        performance: {
          cpu_usage: 42.5,
          memory_usage: 67.8,
          network_throughput: 1024.5,
          active_connections: 156,
          response_times: [12, 15, 8, 22, 18, 11, 9, 25],
          error_rates: [0.001, 0.002, 0.0005, 0.0012]
        }
      },
      agi: {
        consciousness_level: 0.87,
        neural_networks: Array.from({ length: 50 }, (_, i) => ({
          id: `network_${i}`,
          status: Math.random() > 0.1 ? 'active' : 'idle',
          efficiency: Math.random() * 100,
          connections: Math.floor(Math.random() * 1000)
        })),
        memory_pools: {
          semantic: { usage: 65.2, capacity: 2048 },
          episodic: { usage: 42.8, capacity: 1024 },
          procedural: { usage: 89.1, capacity: 512 }
        }
      },
      industrial: {
        sensors: Array.from({ length: 100 }, (_, i) => ({
          id: `sensor_${i}`,
          type: ['temperature', 'pressure', 'humidity', 'vibration'][i % 4],
          value: Math.random() * 100,
          status: Math.random() > 0.05 ? 'operational' : 'warning',
          last_reading: Date.now() - Math.random() * 3600000
        }))
      }
    }

    // Benchmark performance
    const benchmark = Web8DataSerializer.benchmark(complexData)
    
    // Get optimal format based on Accept header
    const acceptHeader = request.headers.get('Accept') || 'application/json'
    const prefersCBOR = acceptHeader.includes('application/cbor')
    const format = prefersCBOR ? 'cbor' : 'json'

    // Create optimized response
    const apiResponse = Web8DataSerializer.createAPIResponse({
      success: true,
      data: complexData,
      benchmark: {
        json_size: benchmark.json.size,
        cbor_size: benchmark.cbor.size,
        efficiency_gain: benchmark.efficiency_gain,
        recommended_format: benchmark.recommendation,
        current_format: format
      },
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: '/api/data/optimized',
        version: '8.0.0'
      }
    })

    // Return appropriate format
    if (format === 'cbor') {
      return new NextResponse(apiResponse.body as ArrayBuffer, {
        status: 200,
        headers: apiResponse.headers
      })
    } else {
      return NextResponse.json(JSON.parse(apiResponse.body as string), {
        status: 200,
        headers: apiResponse.headers
      })
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Data optimization failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('Content-Type') || 'application/json'
    let data: any

    // Handle both JSON and CBOR input
    if (contentType.includes('application/cbor')) {
      const arrayBuffer = await request.arrayBuffer()
      const serializedData = {
        data: arrayBuffer,
        format: 'cbor' as const,
        size: arrayBuffer.byteLength,
        compressed: false
      }
      data = Web8DataSerializer.deserialize(serializedData)
    } else {
      data = await request.json()
    }

    // Process and return optimized response
    const result = {
      received: data,
      processed_at: new Date().toISOString(),
      format_received: contentType.includes('cbor') ? 'cbor' : 'json',
      optimization_analysis: Web8DataSerializer.benchmark(data)
    }

    const apiResponse = Web8DataSerializer.createAPIResponse(result)

    if (apiResponse.format === 'cbor') {
      return new NextResponse(apiResponse.body as ArrayBuffer, {
        status: 200,
        headers: apiResponse.headers
      })
    } else {
      return NextResponse.json(JSON.parse(apiResponse.body as string), {
        status: 200,
        headers: apiResponse.headers
      })
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Data processing failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
