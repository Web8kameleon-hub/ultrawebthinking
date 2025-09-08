import { NextResponse } from 'next/server'
import os from 'os'

export async function GET() {
  try {
    const cpus = os.cpus()
    const loadAvg = os.loadavg()
    
    const cpuData = {
      usage: parseFloat((Math.random() * 50 + 10).toFixed(1)), // Simulated real load
      cores: cpus.length,
      temperature: parseFloat((Math.random() * 30 + 45).toFixed(1)),
      frequency: parseFloat((cpus[0]?.speed / 1000).toFixed(1)) || 3.2,
      timestamp: new Date().toISOString(),
      load_average: loadAvg.map(load => parseFloat(load.toFixed(2))),
      processes: 124 // Could be replaced with real process count
    }

    return NextResponse.json({
      success: true,
      data: cpuData,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'CPU metrics unavailable',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
