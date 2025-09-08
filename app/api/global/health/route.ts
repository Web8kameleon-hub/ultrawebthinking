import { NextResponse } from 'next/server'
import { web8Global, healthCheck } from '@/lib/web8-global-config'

export async function GET() {
  try {
    const healthStatus = await healthCheck()
    
    return NextResponse.json({
      success: true,
      data: healthStatus,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Global health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
