/**
 * Real System Statistics API
 * @author Ledjan Ahmati  
 * @version 8.0.0-WEB8
 */

import { NextRequest, NextResponse } from 'next/server'
import si from 'systeminformation'

export async function GET() {
  try {
    // Get real system metrics
    const [currentLoad, memory, networkStats, processes, battery, graphics] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.networkStats(),
      si.processes(),
      si.battery(),
      si.graphics()
    ])

    const systemStats = {
      timestamp: new Date().toISOString(),
      cpu: {
        load: Math.round(currentLoad.currentLoad * 10) / 10,
        cores: currentLoad.cpus?.map(cpu => ({
          load: Math.round(cpu.load * 10) / 10,
          loadIdle: Math.round(cpu.loadIdle * 10) / 10
        })) || [],
        coreCount: currentLoad.cpus?.length || 0
      },
      memory: {
        total: memory.total,
        free: memory.free,
        used: memory.used,
        available: memory.available,
        utilization: Math.round((memory.used / memory.total) * 100 * 10) / 10,
        swapTotal: memory.swaptotal,
        swapUsed: memory.swapused
      },
      network: networkStats.map(net => ({
        iface: net.iface,
        rxSec: Math.round((net.rx_sec || 0) / 1024), // KB/s
        txSec: Math.round((net.tx_sec || 0) / 1024), // KB/s
        rxBytes: net.rx_bytes,
        txBytes: net.tx_bytes,
        operstate: net.operstate
      })),
      processes: {
        all: processes.all || 0,
        running: processes.running || 0,
        blocked: processes.blocked || 0,
        sleeping: processes.sleeping || 0,
        list: processes.list?.slice(0, 10).map(proc => ({
          pid: proc.pid,
          name: proc.name,
          cpu: proc.cpu,
          mem: proc.mem,
          state: proc.state
        })) || []
      },
      battery: battery.hasBattery ? {
        percent: battery.percent,
        isCharging: battery.isCharging,
        timeRemaining: battery.timeRemaining
      } : null,
      graphics: graphics.controllers?.map(gpu => ({
        model: gpu.model,
        vendor: gpu.vendor,
        vram: gpu.vram,
        temperature: gpu.temperatureGpu
      })) || []
    }

    return NextResponse.json({
      success: true,
      data: systemStats,
      source: 'real-system-monitoring'
    })

  } catch (error) {
    console.error('System stats error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
