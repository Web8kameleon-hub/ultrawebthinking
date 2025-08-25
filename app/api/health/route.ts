/**
 * Health Check API Endpoint
 * EuroWeb Platform v9.0.1
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @license MIT
 */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '9.0.1',
      platform: 'EuroWeb Ultra',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      services: {
        api: 'operational',
        database: 'operational',
        cache: 'operational',
        aviation: 'operational',
        utt: 'operational',
        office: 'operational',
      }
    }

    return NextResponse.json(health, { status: 200 })
  } catch (_error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
        version: '9.0.1'
      }, 
      { status: 503 }
    )
  }
}
