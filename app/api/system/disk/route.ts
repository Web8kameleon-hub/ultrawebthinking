import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const diskData = {
      total_space: 1024000,
      used_space: 512000,
      free_space: 512000,
      usage_percent: 50,
      read_iops: 120,
      write_iops: 85,
      read_throughput: 450.2,
      write_throughput: 320.8,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: diskData,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Disk metrics unavailable',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
