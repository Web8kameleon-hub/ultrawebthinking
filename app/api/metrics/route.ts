import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const metricsData = {
      system: {
        cpu_usage: 42.5,
        memory_usage: 67.8,
        disk_usage: 50,
        network_io: 156.7
      },
      application: {
        active_sessions: 1245,
        requests_per_minute: 2580,
        response_time_avg: 12.5,
        error_rate: 0.0012
      },
      infrastructure: {
        uptime: 147.5,
        deployments_today: 3,
        alerts_active: 0,
        capacity_utilization: 0.68
      },
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: metricsData,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Metrics unavailable',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
